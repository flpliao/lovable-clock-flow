
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnnualLeaveBalance } from '@/types';
import { User, UserContextType } from './user/types';
import { createRoleChecker } from './user/roleUtils';
import { createPermissionChecker } from './user/permissionUtils';
import { getUserFromStorage, saveUserToStorage, clearUserStorage } from './user/userStorageUtils';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

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
    console.log('👤 UserProvider: 初始化用戶狀態管理');
    
    // 檢查本地存儲是否有用戶 session
    const storedUser = getUserFromStorage();
    if (storedUser) {
      console.log('📦 載入儲存的用戶資料:', storedUser);
      setCurrentUser(storedUser);
    }
    
    // 確保載入狀態設為 true，無論是否有用戶
    setIsUserLoaded(true);
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
      console.log('🆔 UserProvider: 用戶ID:', currentUser.id);
      
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

  const resetUserState = () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
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
