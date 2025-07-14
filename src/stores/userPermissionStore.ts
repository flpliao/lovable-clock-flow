import { permissionService as simplifiedPermissionService } from '@/services/simplifiedPermissionService';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useUserStore } from './userStore';

// 用戶權限 Store
interface UserPermissionState {
  // 動作
  loadUserPermissions: (userId: string, roleId: string) => Promise<void>;
  clearPermissions: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const useUserPermissionStore = create<UserPermissionState>()(
  subscribeWithSelector(() => ({
    // 動作
    loadUserPermissions: async (userId: string, roleId: string) => {
      console.log('🔑 UserPermissionStore: 載入用戶權限', { userId, roleId });
      try {
        await simplifiedPermissionService.loadUserPermissions({ id: userId, role_id: roleId });
        console.log('✅ UserPermissionStore: 用戶權限載入完成');
      } catch (error) {
        console.error('❌ UserPermissionStore: 載入用戶權限失敗:', error);
        throw error;
      }
    },

    clearPermissions: () => {
      console.log('🧹 UserPermissionStore: 清除權限');
      try {
        simplifiedPermissionService.clearUserPermissions();
        console.log('✅ UserPermissionStore: 權限已清除');
      } catch (error) {
        console.error('❌ UserPermissionStore: 清除權限失敗:', error);
        throw error;
      }
    },

    hasPermission: (permission: string) => {
      console.log('🔐 UserPermissionStore: 檢查權限', permission);
      try {
        const result = simplifiedPermissionService.hasPermission(permission);
        console.log('✅ UserPermissionStore: 權限檢查結果', { permission, result });
        return result;
      } catch (error) {
        console.error('❌ UserPermissionStore: 權限檢查失敗:', error);
        return false;
      }
    },

    isAdmin: () => {
      try {
        return simplifiedPermissionService.isAdmin();
      } catch (error) {
        console.error('❌ UserPermissionStore: 管理員檢查失敗:', error);
        return false;
      }
    },

    isManager: () => {
      try {
        return simplifiedPermissionService.isManager();
      } catch (error) {
        console.error('❌ UserPermissionStore: 經理檢查失敗:', error);
        return false;
      }
    },
  }))
);

// 訂閱用戶狀態變化，自動處理用戶權限
useUserStore.subscribe(
  state => state.currentUser,
  async currentUser => {
    if (currentUser) {
      // 用戶登入時載入用戶權限
      try {
        await useUserPermissionStore
          .getState()
          .loadUserPermissions(currentUser.id, currentUser.role_id);
      } catch (error) {
        console.warn('⚠️ UserPermissionStore: 權限載入失敗，但用戶仍可繼續使用');
      }
    } else {
      // 用戶登出時清除用戶權限
      try {
        useUserPermissionStore.getState().clearPermissions();
      } catch (error) {
        console.warn('⚠️ UserPermissionStore: 權限清除失敗，但用戶仍可繼續登出');
      }
    }
  }
);
