
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // 檢查是否已驗證登入
  const isAuthenticated = currentUser !== null;

  // 創建角色檢查器
  const { isAdmin, isManager, canManageUser } = createRoleChecker(currentUser);
  
  // 創建權限檢查器
  const { hasPermission } = createPermissionChecker(currentUser, isAdmin);

  useEffect(() => {
    console.log('👤 UserProvider: 初始化 Supabase Auth 狀態管理');
    
    // 設置 Supabase Auth 狀態監聽器
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase Auth 狀態變化:', event, '會話存在:', !!session);
      
      // 處理所有可能的登入情況
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
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
        }
      } catch (error) {
        console.error('❌ 初始化認證狀態失敗:', error);
      } finally {
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
        return;
      }

      // 如果沒有存儲的用戶資料，嘗試從 staff 表格獲取
      console.log('🔍 從資料庫獲取用戶資料');
      const result = await AuthService.authenticate(session.user.email, ''); // 使用空密碼，因為已有會話
      
      if (result.success && result.user) {
        console.log('✅ 成功獲取用戶資料:', result.user.name);
        setCurrentUser(result.user);
      } else {
        // 如果無法從資料庫獲取，使用會話中的基本資料
        console.log('⚠️ 無法從資料庫獲取用戶資料，使用會話資料');
        const fallbackUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用戶',
          position: '員工',
          department: '一般',
          role: 'user'
        };
        setCurrentUser(fallbackUser);
      }
    } catch (error) {
      console.error('❌ 處理用戶登入失敗:', error);
      // 使用會話中的基本資料作為後備
      const fallbackUser: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '用戶',
        position: '員工',
        department: '一般',
        role: 'user'
      };
      setCurrentUser(fallbackUser);
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
