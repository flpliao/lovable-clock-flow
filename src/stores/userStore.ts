import { AnnualLeaveBalance } from '@/types';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  hire_date?: string;
  supervisor_id?: string;
  role_id: string;
  email?: string;
}

interface UserState {
  // 狀態
  currentUser: User | null;
  annualLeaveBalance: AnnualLeaveBalance | null;
  isUserLoaded: boolean;
  
  // 動作
  setCurrentUser: (user: User | null) => void;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  setIsUserLoaded: (loaded: boolean) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector((set, get) => ({
    // 初始狀態
    currentUser: null,
    annualLeaveBalance: null,
    isUserLoaded: false,
    
    // 動作
    setCurrentUser: (user) => {
      console.log('👤 UserStore: 設置用戶', user?.name);
      set({ currentUser: user });
    },
    
    setAnnualLeaveBalance: (balance) => {
      console.log('📊 UserStore: 設置年假餘額', balance?.total_days);
      set({ annualLeaveBalance: balance });
    },
    
    setIsUserLoaded: (loaded) => {
      console.log('⏳ UserStore: 設置載入狀態', loaded);
      set({ isUserLoaded: loaded });
    },
    
    clearUserData: () => {
      console.log('🧹 UserStore: 清除用戶資料');
      set({
        currentUser: null,
        annualLeaveBalance: null,
        isUserLoaded: false
      });
    }
  }))
); 