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
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  // 檢查是否已驗證登入
  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    console.log('👤 UserProvider: 初始化用戶狀態管理');
    
    // 檢查本地存儲是否有用戶 session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('👤 UserProvider: 從本地存儲恢復用戶:', user.name);
        setCurrentUser(user);
      } catch (error) {
        console.error('👤 UserProvider: 解析存儲用戶資料失敗:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    // 確保載入狀態設為 true，無論是否有用戶
    setIsUserLoaded(true);
  }, []);

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      localStorage.removeItem('currentUser');
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      console.log('🆔 UserProvider: 用戶ID:', currentUser.id);
      
      // 將用戶資料存儲到本地存儲
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setUserError(null);
    }
  }, [currentUser]);

  const isAdmin = () => {
    if (!currentUser) return false;
    
    // 廖俊雄永遠是最高管理員
    const isLiaoJunxiong = currentUser?.name === '廖俊雄' && 
                          currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';
    
    // 檢查角色是否為 admin
    const isRoleAdmin = currentUser?.role === 'admin';
    
    console.log('🔐 管理員權限檢查:', {
      userName: currentUser.name,
      userId: currentUser.id,
      role: currentUser.role,
      isLiaoJunxiong,
      isRoleAdmin,
      finalResult: isLiaoJunxiong || isRoleAdmin
    });
    
    return isLiaoJunxiong || isRoleAdmin;
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'admin';
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄可以管理所有用戶
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 廖俊雄最高管理員: 可管理所有用戶');
      return true;
    }
    
    // 系統管理員可以管理所有用戶
    if (currentUser.role === 'admin') {
      console.log('🔐 系統管理員: 可管理所有用戶', currentUser.name);
      return true;
    }
    
    // 管理員或用戶管理自己
    return currentUser.role === 'manager' || currentUser.id === userId;
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄擁有所有權限
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 廖俊雄權限檢查:', permission, '✅ 允許');
      return true;
    }
    
    // 系統管理員擁有所有權限
    if (currentUser.role === 'admin') {
      console.log('🔐 系統管理員權限檢查:', currentUser.name, permission, '✅ 允許');
      return true;
    }
    
    // 根據角色檢查特定權限
    switch (permission) {
      case 'view_staff':
      case 'manage_leave':
      case 'manage_departments':
      case 'create_department':
      case 'edit_department':
      case 'delete_department':
        return currentUser.role === 'manager';
      case 'create_announcement':
      case 'manage_announcements':
      case 'announcement:view':
      case 'announcement:create':
      case 'announcement:edit':
      case 'announcement:delete':
      case 'announcement:publish':
        return currentUser.department === 'HR';
      // 帳號管理權限檢查 - 系統管理員擁有所有權限
      case 'account:email:manage':
      case 'account:password:manage':
        return false; // 只有 admin 角色才有這些權限，上面已經處理
      // 排班管理權限檢查
      case 'schedule:view_all':
      case 'schedule:create':
      case 'schedule:edit':
      case 'schedule:delete':
      case 'schedule:manage':
        return currentUser.role === 'admin';
      case 'schedule:view_own':
        return true; // 所有登入用戶都能查看自己的排班
      default:
        return false;
    }
  };

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
    setCurrentUser(null);
    setAnnualLeaveBalance(null);
    setUserError(null);
    setIsUserLoaded(true);
    localStorage.removeItem('currentUser');
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
