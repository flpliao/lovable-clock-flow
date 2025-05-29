
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnnualLeaveBalance } from '@/types';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  role: 'admin' | 'manager' | 'user';
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  annualLeaveBalance: AnnualLeaveBalance | null;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  isAdmin: () => boolean;
  isManager: () => boolean;
  hasPermission: (permission: string) => boolean;
  canManageUser: (userId: string) => boolean;
  isUserLoaded: boolean;
  userError: string | null;
  clearUserError: () => void;
  resetUserState: () => void; // 新增重置功能
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    // 標記用戶上下文已加載
    setIsUserLoaded(true);
    console.log('UserProvider initialized, user loaded state:', true);
  }, []);

  // 當用戶改變時的處理 - 優化版本
  useEffect(() => {
    if (!currentUser) {
      // 用戶登出時清除所有相關狀態
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('User logged out, cleared all states');
    } else {
      console.log('User logged in:', currentUser.name);
      // 清除任何舊的錯誤狀態
      setUserError(null);
      
      // 不在這裡自動載入資料，避免錯誤通知
      // 讓各個組件自己決定何時載入資料
    }
  }, [currentUser]);

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // Admin can manage all users
    if (currentUser.role === 'admin') return true;
    
    // Manager can manage users in same department (this is simplified logic)
    if (currentUser.role === 'manager') return true;
    
    // Users can only manage themselves
    return currentUser.id === userId;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === 'admin') return true;
    
    // Add specific permission logic here based on role
    switch (permission) {
      case 'view_staff':
      case 'manage_leave':
        return currentUser.role === 'manager';
      case 'create_announcement':
        return currentUser.department === 'HR';
      default:
        return false;
    }
  };

  const clearUserError = () => {
    setUserError(null);
  };

  // 新增重置功能
  const resetUserState = () => {
    console.log('Resetting all user state');
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    setIsUserLoaded(true);
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
      resetUserState
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
