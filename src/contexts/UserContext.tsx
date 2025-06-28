
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnualLeaveBalance } from '@/types';
import { User, UserContextType } from './user/types';
import { createRoleChecker } from './user/roleUtils';
import { createPermissionChecker } from './user/permissionUtils';
import { getUserFromStorage, saveUserToStorage, clearUserStorage } from './user/userStorageUtils';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { AuthService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);
  const authStateRef = useRef<string>('idle'); // 追蹤認證狀態
  const navigate = useNavigate();

  // 檢查是否已驗證登入
  const isAuthenticated = currentUser !== null;

  // 從 staff 表載入用戶完整權限資料
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 從 staff 表載入用戶權限資料:', authUser.email);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('載入用戶資料超時')), 10000)
      );
      
      const staffQueryPromise = supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .single();

      const { data: staffData, error } = await Promise.race([staffQueryPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ 從 staff 表載入用戶失敗:', error);
        return null;
      }
      
      if (staffData) {
        console.log('✅ 成功從 staff 表載入用戶資料:', {
          staff_id: staffData.id,
          user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role
        });
        
        // 特別處理廖俊雄的權限
        let finalRole = staffData.role;
        if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com') {
          finalRole = 'admin';
          console.log('🔐 廖俊雄特別權限處理，強制設定為 admin');
        }
        
        // 轉換為 User 格式，使用 Supabase Auth 的 user ID
        const user: User = {
          id: authUser.id, // 使用 Supabase Auth 的 UID
          name: staffData.name,
          position: staffData.position,
          department: staffData.department,
          onboard_date: staffData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          role: finalRole as 'admin' | 'manager' | 'user',
          email: staffData.email
        };
        
        console.log('🔐 用戶權限資料載入完成:', {
          auth_uid: user.id,
          staff_id: staffData.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 載入 staff 表資料系統錯誤:', error);
      return null;
    }
  };

  // 處理用戶登入的統一函數
  const handleUserLogin = useCallback(async (session: any) => {
    // 防止重複處理相同會話
    if (authStateRef.current === 'processing') {
      console.log('⚠️ 正在處理認證狀態，跳過重複請求');
      return;
    }
    
    authStateRef.current = 'processing';
    console.log('🔄 開始處理用戶登入...', session.user?.email);
    
    try {
      // 優先從 staff 表載入用戶資料
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ 使用 staff 表資料:', staffUser.name, '角色:', staffUser.role);
        setCurrentUser(staffUser);
        saveUserToStorage(staffUser);
        authStateRef.current = 'authenticated';
        return;
      }

      // 如果沒有 staff 資料，使用 AuthService 作為後備
      const result = await AuthService.getUserFromSession(session.user.email);
      if (result.success && result.user) {
        console.log('✅ 使用 AuthService 用戶資料:', result.user.name);
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          position: result.user.position,
          department: result.user.department,
          onboard_date: new Date().toISOString().split('T')[0],
          role: result.user.role,
          email: result.user.email
        };
        
        setCurrentUser(user);
        saveUserToStorage(user);
        authStateRef.current = 'authenticated';
        return;
      }

      // 最後使用會話中的基本資料作為後備
      console.log('⚠️ 使用會話基本資料作為後備');
      const fallbackUser: User = {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用戶',
        position: '員工',
        department: '一般',
        onboard_date: new Date().toISOString().split('T')[0],
        role: 'user',
        email: session.user.email
      };
      
      setCurrentUser(fallbackUser);
      saveUserToStorage(fallbackUser);
      authStateRef.current = 'authenticated';
    } catch (error) {
      console.error('❌ 處理用戶登入失敗:', error);
      setUserError('載入用戶資料失敗');
      authStateRef.current = 'error';
    }
  }, []);

  // 處理用戶登出的統一函數
  const handleUserLogout = useCallback(() => {
    console.log('🚪 處理用戶登出');
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    clearUserStorage();
    authStateRef.current = 'idle';
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
  }, []);

  // 創建角色檢查器
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建權限檢查器
  const { hasPermission } = createPermissionChecker(currentUser, isAdmin);

  useEffect(() => {
    // 防止重複初始化
    if (isInitializedRef.current) {
      console.log('⚠️ UserContext 已經初始化，跳過重複初始化');
      return;
    }

    console.log('👤 UserProvider: 初始化 Supabase Auth 狀態管理');
    isInitializedRef.current = true;
    
    // 設置 Supabase Auth 狀態監聽器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase Auth 狀態變化:', event, '會話存在:', !!session, '當前狀態:', authStateRef.current);
      
      // 避免重複處理相同的認證事件
      if (authStateRef.current === 'processing') {
        console.log('⚠️ 正在處理認證狀態，跳過事件:', event);
        return;
      }
      
      try {
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
          console.log('✅ 用戶已登入 - 事件:', event);
          await handleUserLogin(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 用戶已登出');
          handleUserLogout();
        }
      } catch (error) {
        console.error('❌ 認證狀態變化處理錯誤:', error);
        setUserError('認證狀態處理失敗');
        authStateRef.current = 'error';
      } finally {
        setIsUserLoaded(true);
      }
    });

    // 檢查是否有現有會話
    const initializeAuth = async () => {
      try {
        console.log('🔍 檢查現有會話...');
        const session = await AuthService.getCurrentSession();
        if (session && authStateRef.current === 'idle') {
          console.log('📦 發現現有會話，載入用戶資料');
          await handleUserLogin(session);
        } else {
          console.log('❌ 未發現現有會話或狀態不正確');
        }
      } catch (error) {
        console.error('❌ 初始化認證狀態失敗:', error);
        setUserError('初始化認證失敗');
        authStateRef.current = 'error';
      } finally {
        setIsUserLoaded(true);
      }
    };

    // 延遲初始化，確保組件完全掛載
    const initTimer = setTimeout(initializeAuth, 100);

    // 清理函數
    return () => {
      subscription.unsubscribe();
      clearTimeout(initTimer);
    };
  }, [handleUserLogin, handleUserLogout]);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      
      // 將用戶資料存儲到本地存儲
      saveUserToStorage(currentUser);
      setUserError(null);
      
      // 清除權限快取，確保使用最新權限
      const permissionService = UnifiedPermissionService.getInstance();
      permissionService.clearCache();
    }
  }, [currentUser]);

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
    
    // 設置狀態為處理中，避免重複操作
    authStateRef.current = 'processing';
    
    try {
      // 使用 Supabase Auth 登出
      await AuthService.signOut();
      handleUserLogout();
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      authStateRef.current = 'error';
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      annualLeaveBalance,
      setAnnualLeaveBalance,
      isAdmin,
      isManager,
      hasPermission,
      canManageUser,
      isUserLoaded,
      userError,
      clearUserError,
      resetUserState,
      isAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Re-export types for backward compatibility
export type { User, UserContextType };
