import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User, useUserStore } from './userStore';

// 從 supabase 客戶端推斷 Session 類型
type Session = NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>;

interface AuthState {
  // 狀態
  isAuthenticated: boolean;
  isInitializing: boolean;
  session: Session | null;
  authError: string | null;
  isInitialized: boolean;

  // 動作
  setIsAuthenticated: (authenticated: boolean) => void;
  setSession: (session: Session | null) => void;
  setAuthError: (error: string | null) => void;
  handleUserLogin: (session: Session) => Promise<void>;
  handleUserLogout: () => Promise<void>;
  initializeAuth: () => Promise<(() => void) | undefined>;
  forceLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // 初始狀態
    isAuthenticated: false,
    isInitializing: true,
    session: null,
    authError: null,
    isInitialized: false,

    // 動作
    setIsAuthenticated: authenticated => {
      console.log('🔐 AuthStore: 設置認證狀態', authenticated);
      set({ isAuthenticated: authenticated });
    },

    setSession: session => {
      console.log('📱 AuthStore: 設置會話', !!session);
      set({ session });
    },

    setAuthError: error => {
      console.log('❌ AuthStore: 設置認證錯誤', error);
      set({ authError: error });
    },

    handleUserLogin: async (session: Session) => {
      try {
        console.log('🔐 AuthStore: 處理用戶登入', session.user.email);

        set({ authError: null });

        // 🚨 修復：直接使用 session 中的用戶資料，避免額外的 API 調用
        // 避免調用 AuthService.getUserFromSession，因為它會再次調用 supabase.auth.getUser()

        // 先查找 staff 資料（但不通過 AuthService，直接查詢）
        let staffData = null;
        try {
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!error && data) {
            staffData = data;
            console.log('✅ AuthStore: 找到對應的員工資料', data.name);
          } else {
            // 嘗試用 email 查詢
            const { data: emailData, error: emailError } = await supabase
              .from('staff')
              .select('*')
              .eq('email', session.user.email)
              .maybeSingle();

            if (!emailError && emailData) {
              staffData = emailData;
              console.log('✅ AuthStore: 通過 email 找到員工資料', emailData.name);

              // 更新 user_id 映射
              await supabase
                .from('staff')
                .update({ user_id: session.user.id })
                .eq('id', emailData.id);
            }
          }
        } catch (error) {
          console.warn('⚠️ AuthStore: 查詢員工資料失敗', error);
        }

        // 建構用戶資料
        const userForStore: User = {
          id: session.user.id,
          name: staffData?.name || session.user.email?.split('@')[0] || '未知用戶',
          position: staffData?.position || '員工',
          department: staffData?.department || '未分配',
          onboard_date: staffData?.onboard_date || new Date().toISOString().split('T')[0],
          hire_date: staffData?.hire_date,
          supervisor_id: staffData?.supervisor_id,
          role_id: staffData?.role_id || 'user',
          email: session.user.email || staffData?.email,
        };

        // 更新用戶 store
        useUserStore.getState().setCurrentUser(userForStore);

        // 更新認證狀態
        set({
          isAuthenticated: true,
          session,
          authError: null,
        });

        console.log('✅ AuthStore: 用戶登入成功', userForStore.name);
      } catch (error) {
        console.error('❌ AuthStore: 用戶登入處理錯誤', error);
        set({
          isAuthenticated: false,
          authError: '登入處理失敗',
        });
      }
    },

    handleUserLogout: async () => {
      try {
        console.log('🚪 AuthStore: 處理用戶登出');

        const result = await AuthService.signOut();

        if (result.success) {
          // 清除用戶 store
          useUserStore.getState().clearUserData();

          // 清除認證狀態
          set({
            isAuthenticated: false,
            session: null,
            authError: null,
          });

          console.log('✅ AuthStore: 用戶登出成功');
        } else {
          console.error('❌ AuthStore: 登出失敗', result.error);
          set({ authError: result.error || '登出失敗' });
        }
      } catch (error) {
        console.error('❌ AuthStore: 登出處理錯誤', error);
        set({ authError: '登出處理失敗' });
      }
    },

    forceLogout: async () => {
      console.log('🔄 AuthStore: 執行強制登出');
      await get().handleUserLogout();
    },

    initializeAuth: async () => {
      try {
        console.log('🔍 AuthStore: 初始化認證狀態');
        set({ isInitializing: true, authError: null });

        // 🚨 修復：避免在 Supabase callback 中使用 async/await
        // 根據 Supabase 最佳實踐，避免在 callback 中直接調用其他 Supabase 方法

        // 設置 Supabase Auth 監聽器 - 防止重複處理
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('🔄 AuthStore: Auth 狀態變化', event, !!session);

          // 防止同時處理多個 auth state change
          if (isProcessingAuthChange) {
            console.log('⏳ AuthStore: 跳過重複的狀態變化處理');
            return;
          }

          isProcessingAuthChange = true;

          // 使用 setTimeout 避免在 Supabase callback 中直接調用其他 Supabase 方法
          setTimeout(async () => {
            try {
              if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                console.log('🔐 AuthStore: 處理用戶登入');
                await get().handleUserLogin(session);
              } else if (event === 'SIGNED_OUT') {
                console.log('🚪 AuthStore: 處理用戶登出');
                useUserStore.getState().clearUserData();
                set({
                  isAuthenticated: false,
                  session: null,
                  authError: null,
                });
              }

              // 只在初始化階段設置載入完成狀態
              if (get().isInitializing) {
                console.log('✅ AuthStore: 初始化階段完成，設置載入狀態');
                useUserStore.getState().setIsUserLoaded(true);
                set({ isInitializing: false });
              }
            } catch (error) {
              console.error('❌ AuthStore: 狀態變化處理錯誤', error);
              if (get().isInitializing) {
                useUserStore.getState().setIsUserLoaded(true);
                set({ isInitializing: false, authError: '認證處理失敗' });
              }
            } finally {
              isProcessingAuthChange = false;
            }
          }, 0);
        });

        // 🚨 修復：只在初始化時檢查會話，避免重複 API 調用
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ AuthStore: 獲取會話失敗', error);
          set({ authError: error.message, isInitializing: false });
          useUserStore.getState().setIsUserLoaded(true);
          return;
        }

        if (session) {
          console.log('📦 AuthStore: 發現現有會話，處理登入');
          await get().handleUserLogin(session);
        } else {
          console.log('❌ AuthStore: 未發現現有會話');
          set({ isAuthenticated: false, isInitializing: false });
          useUserStore.getState().setIsUserLoaded(true);
        }

        // 標記為已初始化
        set({ isInitialized: true });

        // 返回清理函數
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ AuthStore: 初始化認證失敗', error);
        set({
          isAuthenticated: false,
          isInitializing: false,
          authError: '認證初始化失敗',
          isInitialized: true,
        });
        useUserStore.getState().setIsUserLoaded(true);
      }
    },
  }))
);

// 自動初始化認證（僅執行一次）
let initializationPromise: Promise<(() => void) | undefined> | null = null;

// 防止多重 auth state change 處理
let isProcessingAuthChange = false;

export const ensureAuthInitialized = () => {
  const state = useAuthStore.getState();

  // 改進的防護條件：如果正在初始化或已初始化，直接返回
  if (state.isInitialized) {
    console.log('🔒 AuthStore: 認證已初始化，跳過重複初始化');
    return Promise.resolve();
  }

  if (initializationPromise) {
    console.log('🔄 AuthStore: 認證初始化進行中，等待完成');
    return initializationPromise;
  }

  console.log('🚀 AuthStore: 開始初始化認證系統');
  initializationPromise = state
    .initializeAuth()
    .then(cleanup => {
      console.log('✅ AuthStore: 認證初始化完成');
      return cleanup;
    })
    .catch(error => {
      console.error('❌ AuthStore: 認證初始化失敗', error);
      initializationPromise = null; // 重置以允許重試
      throw error;
    });

  return initializationPromise;
};
