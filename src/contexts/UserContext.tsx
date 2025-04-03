
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: '廖俊雄',
    position: '資深工程師',
    department: '技術部',
    onboard_date: '2023-01-15',
    role: 'user', // Default to 'user' role
  });
  
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>({
    id: '1',
    user_id: '1',
    year: 2024,
    total_days: 7,
    used_days: 0,
  });

  // Helper function to check if the current user is an admin
  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  // Helper function to check if the current user can manage a specific user
  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // Admins can manage all users
    if (currentUser.role === 'admin') return true;
    
    // Regular users can only manage themselves
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
