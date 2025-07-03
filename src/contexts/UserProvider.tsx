import { useAuthStore } from '@/stores/authStore';
import { usePermissionStore } from '@/stores/permissionStore';
import { User, useUserStore } from '@/stores/userStore';
import { AnnualLeaveBalance } from '@/types';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

// 保持與原 UserContext 相同的接口
export interface UserContextType {
  // 用戶狀態
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  annualLeaveBalance: AnnualLeaveBalance | null;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  isUserLoaded: boolean;
  
  // 認證狀態
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  resetUserState: () => Promise<void>;
  
  // 權限檢查
  isAdmin: () => boolean;
  isManager: () => boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  canManageUser: (targetUserId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 用戶 Store
  const {
    currentUser,
    setCurrentUser,
    annualLeaveBalance,
    setAnnualLeaveBalance,
    isUserLoaded,
    clearUserData
  } = useUserStore();
  
  // 認證 Store
  const {
    isAuthenticated,
    setIsAuthenticated,
    initializeAuth,
    forceLogout
  } = useAuthStore();
  
  // 權限 Store
  const {
    isAdmin,
    isManager,
    hasPermission,
    canManageUser,
    clearPermissionCache
  } = usePermissionStore();
  
  // 初始化認證系統
  useEffect(() => {
    console.log('🚀 UserProvider: 初始化 Zustand 狀態管理系統');
    
    let cleanup: (() => void) | undefined;
    
    const initialize = async () => {
      try {
        cleanup = await initializeAuth();
      } catch (error) {
        console.error('❌ UserProvider: 認證初始化失敗', error);
      }
    };
    
    initialize();
    
    // 清理函數
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeAuth]);
  
  // 重置用戶狀態
  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態');
    
    // 清除所有狀態
    clearUserData();
    clearPermissionCache();
    
    // 執行登出
    await forceLogout();
  };
  
  // 提供統一的上下文值
  const contextValue: UserContextType = {
    // 用戶相關
    currentUser,
    setCurrentUser,
    annualLeaveBalance,
    setAnnualLeaveBalance,
    isUserLoaded,
    
    // 認證相關
    isAuthenticated,
    setIsAuthenticated,
    resetUserState,
    
    // 權限相關
    isAdmin,
    isManager,
    hasPermission,
    canManageUser
  };
  
  return (
    <UserContext.Provider value={contextValue}>
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
export type { User };

