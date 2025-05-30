
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // 為廖俊雄設置預設的管理員用戶
    return {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: '廖俊雄',
      position: '資深工程師',
      department: '技術部',
      onboard_date: '2023-01-01',
      role: 'admin'
    };
  });
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    console.log('UserProvider initialized with admin user:', currentUser?.name);
    setIsUserLoaded(true);
  }, []);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('User logged out, cleared all states');
    } else {
      console.log('User logged in:', currentUser.name, 'Role:', currentUser.role);
      setUserError(null);
    }
  }, [currentUser]);

  const isAdmin = () => {
    const result = currentUser?.role === 'admin';
    console.log('isAdmin check:', result, 'for user:', currentUser?.name);
    return result;
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // Admin can manage all users
    if (currentUser.role === 'admin') return true;
    
    // Manager can manage users in same department
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

  const resetUserState = () => {
    console.log('Resetting user state');
    // 重置為預設的管理員用戶而不是清空
    setCurrentUser({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: '廖俊雄',
      position: '資深工程師',
      department: '技術部',
      onboard_date: '2023-01-01',
      role: 'admin'
    });
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
