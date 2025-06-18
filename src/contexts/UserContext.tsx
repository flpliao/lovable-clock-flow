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
  resetUserState: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // �廖俊雄的固定管理員資料
  const adminUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '廖俊雄',
    position: '資深工程師',
    department: '技術部',
    onboard_date: '2023-01-01',
    role: 'admin' as const
  };

  const [currentUser, setCurrentUser] = useState<User | null>(adminUser);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    console.log('👤 UserProvider: 初始化管理員用戶');
    console.log('🆔 UserProvider: 用戶ID:', adminUser.id);
    console.log('👨‍💼 UserProvider: 管理員名稱:', adminUser.name);
    console.log('🔐 UserProvider: 管理員角色:', adminUser.role);
    setIsUserLoaded(true);
  }, []);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '角色:', currentUser.role);
      console.log('🆔 UserProvider: 用戶ID:', currentUser.id);
      setUserError(null);
    }
  }, [currentUser]);

  const isAdmin = () => {
    const result = currentUser?.role === 'admin' && currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';
    console.log('🔐 UserProvider: 管理員權限檢查:', result, '用戶:', currentUser?.name, '角色:', currentUser?.role);
    return result;
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄（管理員）可以管理所有用戶
    if (currentUser.role === 'admin' && currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 UserProvider: 管理員擁有管理權限，目標用戶ID:', userId);
      return true;
    }
    
    // Manager can manage users in same department
    if (currentUser.role === 'manager') return true;
    
    // Users can only manage themselves
    return currentUser.id === userId;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // �廖俊雄（管理員）擁有所有權限
    if (currentUser.role === 'admin' && currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 UserProvider: 管理員擁有權限:', permission);
      return true;
    }
    
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

  const resetUserState = () => {
    console.log('🔄 UserProvider: 重置用戶狀態到管理員');
    setCurrentUser(adminUser);
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
