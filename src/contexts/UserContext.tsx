
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
  // 廖俊雄的最高管理員資料 - 確保擁有所有權限
  const superAdminUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '廖俊雄',
    position: '最高管理者',
    department: '管理部',
    onboard_date: '2023-01-01',
    role: 'admin' as const
  };

  const [currentUser, setCurrentUser] = useState<User | null>(superAdminUser);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    console.log('👤 UserProvider: 初始化最高管理員用戶 - 廖俊雄');
    console.log('🆔 UserProvider: 管理員ID:', superAdminUser.id);
    console.log('👨‍💼 UserProvider: 管理員名稱:', superAdminUser.name);
    console.log('🔐 UserProvider: 權限等級: 最高管理員 (admin)');
    console.log('✅ UserProvider: 廖俊雄擁有所有系統權限');
    setIsUserLoaded(true);
  }, []);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      console.log('🆔 UserProvider: 用戶ID:', currentUser.id);
      setUserError(null);
    }
  }, [currentUser]);

  const isAdmin = () => {
    // 廖俊雄永遠是最高管理員，擁有所有權限
    const isLiaoJunxiong = currentUser?.name === '廖俊雄' && 
                          currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';
    const isAdminRole = currentUser?.role === 'admin';
    
    const result = isLiaoJunxiong || isAdminRole;
    
    console.log('🔐 UserProvider: 最高管理員權限檢查 - 廖俊雄');
    console.log('✅ 身份確認:', currentUser?.name);
    console.log('✅ ID確認:', currentUser?.id);
    console.log('✅ 權限確認:', result ? '擁有最高管理權限' : '權限不足');
    
    return result;
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄（最高管理員）可以管理所有用戶，包括新增部門
    const isLiaoJunxiongAdmin = currentUser.name === '廖俊雄' && 
                               currentUser.id === '550e8400-e29b-41d4-a716-446655440001' &&
                               currentUser.role === 'admin';
    
    if (isLiaoJunxiongAdmin) {
      console.log('🔐 UserProvider: 廖俊雄最高管理員權限確認');
      console.log('✅ 可以管理所有用戶和部門，目標ID:', userId);
      return true;
    }
    
    // Manager can manage users in same department
    if (currentUser.role === 'manager') return true;
    
    // Users can only manage themselves
    return currentUser.id === userId;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄（最高管理員）擁有所有權限，特別是部門管理權限
    const isLiaoJunxiongAdmin = currentUser.name === '廖俊雄' && 
                               currentUser.id === '550e8400-e29b-41d4-a716-446655440001' &&
                               currentUser.role === 'admin';
    
    if (isLiaoJunxiongAdmin) {
      console.log('🔐 UserProvider: 廖俊雄最高管理員權限檢查');
      console.log('✅ 權限類型:', permission);
      console.log('✅ 權限狀態: 完全允許');
      return true;
    }
    
    // Add specific permission logic here based on role
    switch (permission) {
      case 'view_staff':
      case 'manage_leave':
      case 'manage_departments':
      case 'create_department':
      case 'edit_department':
      case 'delete_department':
        return currentUser.role === 'manager' || currentUser.role === 'admin';
      case 'create_announcement':
        return currentUser.department === 'HR' || currentUser.role === 'admin';
      default:
        return false;
    }
  };

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = () => {
    console.log('🔄 UserProvider: 重置用戶狀態到最高管理員 - 廖俊雄');
    setCurrentUser(superAdminUser);
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
