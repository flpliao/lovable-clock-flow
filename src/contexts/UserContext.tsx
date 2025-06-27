
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
      console.log('🔄 Supabase Auth 狀態變化:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ 用戶已登入');
        console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
        
        // 從會話中獲取用戶資料（如果之前存儲過）
        const storedUser = getUserFromStorage();
        if (storedUser && storedUser.id === session.user.id) {
          console.log('📦 使用已存儲的用戶資料');
          setCurrentUser(storedUser);
        } else {
          console.log('🔍 需要重新獲取用戶資料');
          // 這裡可能需要重新獲取用戶資料
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        setCurrentUser(null);
        clearUserStorage();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 JWT Token 已刷新');
        console.log('🎫 新 JWT Token:', session.access_token.substring(0, 20) + '...');
      }
    });

    // 檢查是否有現有會話
    AuthService.getCurrentSession().then((session) => {
      if (session) {
        console.log('📦 發現現有 Supabase 會話');
        console.log('🎫 JWT Token:', session.access_token.substring(0, 20) + '...');
        
        // 嘗試從本地存儲恢復用戶資料
        const storedUser = getUserFromStorage();
        if (storedUser && storedUser.id === session.user.id) {
          console.log('📦 恢復已存儲的用戶資料:', storedUser.name);
          setCurrentUser(storedUser);
        }
      } else {
        console.log('❌ 無現有 Supabase 會話');
      }
      
      setIsUserLoaded(true);
    });

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
    
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    setIsUserLoaded(true);
    clearUserStorage();
    
    // 清除權限快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
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
