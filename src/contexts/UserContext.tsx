import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnualLeaveBalance } from '@/types';
import { User, UserContextType } from './user/types';
import { createRoleChecker } from './user/roleUtils';
import { createPermissionChecker } from './user/permissionUtils';
import { getUserFromStorage, saveUserToStorage, clearUserStorage } from './user/userStorageUtils';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { AuthService } from '@/services/authService';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 檢查是否已驗證登入 - 修正邏輯
  const isAuthenticated = currentUser !== null;

  // 創建角色檢查器
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建權限檢查器
  const { hasPermission } = createPermissionChecker(currentUser, isAdmin);

  // 將 AuthUser 轉換為 User 的輔助函數
  const convertAuthUserToUser = (authUser: any): User => {
    return {
      id: authUser.id,
      name: authUser.name,
      position: authUser.position,
      department: authUser.department,
      onboard_date: new Date().toISOString().split('T')[0], // 默認今天作為入職日期
      hire_date: authUser.hire_date,
      supervisor_id: authUser.supervisor_id,
      role: authUser.role
    };
  };

  useEffect(() => {
    console.log('👤 UserProvider: 初始化 Supabase Auth 狀態管理');
    
    // 設置 Supabase Auth 狀態監聽器
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase Auth 狀態變化:', event, '會話存在:', !!session);
      
      // 處理所有可能的登入情況
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        console.log('✅ 用戶已登入 - 事件:', event);
        console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
        
        await handleUserLogin(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        handleUserLogout();
      } else if (session && !currentUser) {
        // 處理 setSession 後可能沒有觸發特定事件的情況
        console.log('🔄 檢測到會話但無事件，處理登入狀態');
        await handleUserLogin(session);
      }
    });

    // 檢查是否有現有會話
    const initializeAuth = async () => {
      try {
        const session = await AuthService.getCurrentSession();
        if (session) {
          console.log('📦 發現現有 Supabase 會話');
          console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
          
          await handleUserLogin(session);
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

  // 處理用戶登入的統一函數
  const handleUserLogin = async (session: any) => {
    try {
      // 嘗試從本地存儲恢復用戶資料
      const storedUser = getUserFromStorage();
      if (storedUser && storedUser.id === session.user.id) {
        console.log('📦 恢復已存儲的用戶資料:', storedUser.name);
        setCurrentUser(storedUser);
        setIsUserLoaded(true);
        
        // 檢查是否在 callback 頁面，如果是則重定向
        if (window.location.pathname === '/auth/callback') {
          console.log('🔄 從 callback 頁面重定向到首頁');
          navigate('/', { replace: true });
        }
        return;
      }

      // 如果沒有本地存儲資料，使用 AuthService 獲取
      const result = await AuthService.getUserFromSession(session.user.email);
      if (result.success && result.user) {
        console.log('✅ 成功獲取用戶資料:', result.user.name);
        // 將 AuthUser 转換為 User
        const user = convertAuthUserToUser(result.user);
        setCurrentUser(user);
        setIsUserLoaded(true);
        
        // 檢查是否在 callback 頁面，如果是則重定向
        if (window.location.pathname === '/auth/callback') {
          console.log('🔄 從 callback 頁面重定向到首頁');
          navigate('/', { replace: true });
        }
        return;
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
          navigate('/', { replace: true });
        }, 500);
      }
    } finally {
      setIsUserLoaded(true);
    }
  };

  // 處理用戶登出的統一函數
  const handleUserLogout = () => {
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    clearUserStorage();
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    setIsUserLoaded(true);
  };

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
