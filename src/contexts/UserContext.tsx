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
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const isInitializedRef = useRef(false);
  const currentUserRef = useRef<User | null>(null);
  const handleUserLoginRef = useRef<((session: any) => Promise<void>) | null>(null);
  const handleUserLogoutRef = useRef<(() => void) | null>(null);
  const navigateRef = useRef<any>(null);
  const isProcessingLoginRef = useRef(false);
  const navigate = useNavigate();

  // 同步 currentUserRef
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // 同步 navigateRef
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // 同步 isProcessingLoginRef
  useEffect(() => {
    isProcessingLoginRef.current = isProcessingLogin;
  }, [isProcessingLogin]);

  // 檢查是否已驗證登入 - 修正邏輯
  const isAuthenticated = currentUser !== null;

  // 從 staff 表載入用戶完整權限資料
  const loadUserFromStaffTable = async (authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 從 staff 表載入用戶權限資料:', authUser.email);
      
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .single();
      
      if (error) {
        console.error('❌ 從 staff 表載入用戶失敗:', error);
        return null;
      }
      
      if (staffData) {
        console.log('✅ 成功從 staff 表載入用戶資料:', {
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          role_id: staffData.role_id
        });
        
        // 轉換為 User 格式
        const user: User = {
          id: staffData.user_id || authUser.id,
          name: staffData.name,
          position: staffData.position,
          department: staffData.department,
          onboard_date: staffData.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          role: staffData.role as 'admin' | 'manager' | 'user'
        };
        
        console.log('🔐 用戶權限資料載入完成:', {
          name: user.name,
          role: user.role,
          isAdmin: user.role === 'admin'
        });
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ 載入 staff 表資料系統錯誤:', error);
      return null;
    }
  };

  // 創建角色檢查器
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建權限檢查器
  const { hasPermission } = createPermissionChecker(currentUser, isAdmin);

  // 處理用戶登入的統一函數
  const handleUserLogin = useCallback(async (session: any) => {
    // 防止重複處理
    if (isProcessingLoginRef.current) {
      console.log('⚠️ 用戶登入處理中，跳過重複請求');
      return;
    }

    setIsProcessingLogin(true);
    console.log('🔄 開始處理用戶登入...');

    try {
      // 優先從 staff 表載入用戶資料
      const staffUser = await loadUserFromStaffTable(session.user);
      
      if (staffUser) {
        console.log('✅ 使用 staff 表資料:', staffUser.name, '角色:', staffUser.role);
        setCurrentUser(staffUser);
        saveUserToStorage(staffUser);
        setIsUserLoaded(true);
        
        // 檢查是否在 callback 頁面，如果是則重定向
        if (window.location.pathname === '/auth/callback') {
          console.log('🔄 從 callback 頁面重定向到首頁');
          if (navigateRef.current) {
            navigateRef.current('/', { replace: true });
          }
        }
        return;
      }

      // 如果 staff 表沒有資料，嘗試從本地存儲恢復
      const storedUser = getUserFromStorage();
      if (storedUser && storedUser.id === session.user.id) {
        console.log('📦 恢復已存儲的用戶資料:', storedUser.name, '角色:', storedUser.role);
        setCurrentUser(storedUser);
        setIsUserLoaded(true);
        
        if (window.location.pathname === '/auth/callback') {
          console.log('🔄 從 callback 頁面重定向到首頁');
          if (navigateRef.current) {
            navigateRef.current('/', { replace: true });
          }
        }
        return;
      }

      // 最後使用 AuthService 作為後備
      const result = await AuthService.getUserFromSession(session.user.email);
      if (result.success && result.user) {
        console.log('✅ 使用 AuthService 用戶資料:', result.user.name, '角色:', result.user.role);
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          position: result.user.position,
          department: result.user.department,
          onboard_date: new Date().toISOString().split('T')[0],
          hire_date: result.user.hire_date,
          supervisor_id: result.user.supervisor_id,
          role: result.user.role
        };
        setCurrentUser(user);
        saveUserToStorage(user);
        setIsUserLoaded(true);
        
        if (window.location.pathname === '/auth/callback') {
          console.log('🔄 從 callback 頁面重定向到首頁');
          if (navigateRef.current) {
            navigateRef.current('/', { replace: true });
          }
        }
        return;
      } else {
        throw new Error(result.error || '獲取用戶資料失敗');
      }
    } catch (error) {
      console.error('❌ 處理用戶登入失敗:', error);
      // 使用會話中的基本資料作為後備
      const fallbackUser: User = {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用戶',
        position: '員工',
        department: '一般',
        onboard_date: new Date().toISOString().split('T')[0],
        role: 'user'
      };
      setCurrentUser(fallbackUser);
      
      // 即使發生錯誤也要重定向
      if (window.location.pathname === '/auth/callback') {
        console.log('🔄 發生錯誤但仍重定向到首頁');
        setTimeout(() => {
          if (navigateRef.current) {
            navigateRef.current('/', { replace: true });
          }
        }, 500);
      }
    } finally {
      setIsUserLoaded(true);
      setIsProcessingLogin(false);
      console.log('✅ 用戶登入處理完成');
    }
  }, []);

  // 處理用戶登出的統一函數
  const handleUserLogout = useCallback(() => {
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    clearUserStorage();
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    setIsUserLoaded(true);
  }, []);

  // 同步函數引用
  useEffect(() => {
    handleUserLoginRef.current = handleUserLogin;
    handleUserLogoutRef.current = handleUserLogout;
  }, [handleUserLogin, handleUserLogout]);

  useEffect(() => {
    // 防止重複初始化
    if (isInitializedRef.current) {
      console.log('⚠️ UserProvider 已初始化，跳過重複初始化');
      return;
    }

    console.log('👤 UserProvider: 初始化 Supabase Auth 狀態管理');
    isInitializedRef.current = true;
    
    // 設置 Supabase Auth 狀態監聽器
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase Auth 狀態變化:', event, '會話存在:', !!session);
      
      // 處理所有可能的登入情況
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        console.log('✅ 用戶已登入 - 事件:', event);
        console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
        
        if (handleUserLoginRef.current) {
          await handleUserLoginRef.current(session);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        if (handleUserLogoutRef.current) {
          handleUserLogoutRef.current();
        }
      } else if (session && !currentUserRef.current) {
        // 處理 setSession 後可能沒有觸發特定事件的情況
        console.log('🔄 檢測到會話但無事件，處理登入狀態');
        if (handleUserLoginRef.current) {
          await handleUserLoginRef.current(session);
        }
      }
    });

    // 檢查是否有現有會話
    const initializeAuth = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        if (session) {
          console.log('📦 發現現有 Supabase 會話');
          console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
          
          if (handleUserLoginRef.current) {
            await handleUserLoginRef.current(session);
          }
        } else {
          console.log('❌ 無現有 Supabase 會話');
          setIsUserLoaded(true);
        }
      } catch (error) {
        console.error('❌ 初始化認證狀態失敗:', error);
        setIsUserLoaded(true);
      }
    };

    initializeAuth();

    // 清理函數
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      clearUserStorage();
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      console.log('🆔 UserProvider: Supabase Auth 用戶ID:', currentUser.id);
      console.log('🔐 UserProvider: 管理員權限檢查:', currentUser.role === 'admin');
      
      // 將用戶資料存儲到本地存儲
      saveUserToStorage(currentUser);
      setUserError(null);
      
      // 清除權限快取，確保使用最新權限
      const permissionService = UnifiedPermissionService.getInstance();
      permissionService.clearCache();
      
      console.log('🔄 已清除權限快取，確保使用最新權限設定');
    }
  }, [currentUser]);

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
    
    // 使用 Supabase Auth 登出
    await AuthService.signOut();
    
    handleUserLogout();
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
