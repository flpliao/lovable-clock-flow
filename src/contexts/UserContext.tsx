
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);

  useEffect(() => {
    // 使用正確的 UUID 格式初始化用戶
    const mockUser: User = {
      id: "550e8400-e29b-41d4-a716-446655440001", // 使用 UUID 格式
      name: "廖俊雄",
      position: "資深工程師",
      department: "技術部",
      onboard_date: "2023-01-15",
      role: "admin"
    };
    setCurrentUser(mockUser);

    // 初始化年假餘額
    const mockBalance: AnnualLeaveBalance = {
      id: "balance-1",
      user_id: mockUser.id,
      year: new Date().getFullYear(),
      total_days: 14,
      used_days: 3
    };
    setAnnualLeaveBalance(mockBalance);
  }, []);

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

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      annualLeaveBalance,
      setAnnualLeaveBalance,
      isAdmin,
      isManager,
      hasPermission,
      canManageUser
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
