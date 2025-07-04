import { AnnualLeaveBalance } from '@/types';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { permissionService } from '@/services/simplifiedPermissionService';

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
  subscribeWithSelector(set => ({
    // 初始狀態
    currentUser: null,
    annualLeaveBalance: null,
    isUserLoaded: false,

    // 動作
    setCurrentUser: async user => {
      console.log('👤 UserStore: 設置用戶', user?.name);

      if (user) {
        // 🆕 用戶登入時載入權限
        try {
          await permissionService.loadUserPermissions({
            id: user.id,
            role_id: user.role_id,
          });
          console.log('✅ 用戶權限載入完成');
        } catch (error) {
          console.error('❌ 載入用戶權限失敗:', error);
          // 即使權限載入失敗，也要設置用戶
        }
      } else {
        // 🆕 用戶登出時清除權限
        try {
          permissionService.clearUserPermissions();
          console.log('🧹 用戶權限已清除');
        } catch (error) {
          console.error('❌ 清除用戶權限失敗:', error);
          // 即使清除權限失敗，也要繼續登出流程
        }
      }

      set({ currentUser: user });
    },

    setAnnualLeaveBalance: balance => {
      console.log('📊 UserStore: 設置年假餘額', balance?.total_days);
      set({ annualLeaveBalance: balance });
    },

    setIsUserLoaded: loaded => {
      console.log('⏳ UserStore: 設置載入狀態', loaded);
      set({ isUserLoaded: loaded });
    },

    clearUserData: () => {
      console.log('🧹 UserStore: 清除用戶資料');
      // 🆕 清除權限快取
      permissionService.clearUserPermissions();
      set({
        currentUser: null,
        annualLeaveBalance: null,
        isUserLoaded: false,
      });
    },
  }))
);
