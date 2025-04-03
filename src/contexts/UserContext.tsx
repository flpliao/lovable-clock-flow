
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AnnualLeaveBalance } from '@/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  annualLeaveBalance: AnnualLeaveBalance | null;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  isAdmin: () => boolean;
  canManageUser: (userId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);

  // 從本地存儲恢復用戶會話（如果有）
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }

    const savedBalance = localStorage.getItem('annualLeaveBalance');
    if (savedBalance) {
      try {
        setAnnualLeaveBalance(JSON.parse(savedBalance));
      } catch (error) {
        console.error('Failed to parse saved balance:', error);
        localStorage.removeItem('annualLeaveBalance');
      }
    }
  }, []);

  // 保存用戶資訊到本地存儲
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // 如果用戶登錄，但沒有年假餘額，則設置默認值
      if (!annualLeaveBalance) {
        const defaultBalance = {
          id: '1',
          user_id: currentUser.id,
          year: new Date().getFullYear(),
          total_days: 7,
          used_days: 0,
        };
        setAnnualLeaveBalance(defaultBalance);
        localStorage.setItem('annualLeaveBalance', JSON.stringify(defaultBalance));
      }
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // 保存年假餘額到本地存儲
  useEffect(() => {
    if (annualLeaveBalance) {
      localStorage.setItem('annualLeaveBalance', JSON.stringify(annualLeaveBalance));
    }
  }, [annualLeaveBalance]);

  // 檢查用戶是否為管理員
  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  // 檢查當前用戶是否可以管理特定用戶
  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // 管理員可以管理所有用戶
    if (currentUser.role === 'admin') return true;
    
    // 普通用戶只能管理自己
    return currentUser.id === userId;
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      annualLeaveBalance, 
      setAnnualLeaveBalance,
      isAdmin,
      canManageUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
