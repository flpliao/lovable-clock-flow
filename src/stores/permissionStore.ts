import { permissionService } from '@/services/simplifiedPermissionService';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useUserStore } from './userStore';

interface PermissionState {
  // 動作
  loadUserPermissions: (userId: string, roleId: string) => Promise<void>;
  clearPermissions: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

export const usePermissionStore = create<PermissionState>()(
  subscribeWithSelector(() => ({
    // 動作
    loadUserPermissions: async (userId: string, roleId: string) => {
      console.log('🔑 PermissionStore: 載入用戶權限', { userId, roleId });
      try {
        await permissionService.loadUserPermissions({ id: userId, role_id: roleId });
        console.log('✅ PermissionStore: 用戶權限載入完成');
      } catch (error) {
        console.error('❌ PermissionStore: 載入用戶權限失敗:', error);
        throw error; // 向上傳遞錯誤，讓調用者決定如何處理
      }
    },

    clearPermissions: () => {
      console.log('🧹 PermissionStore: 清除權限');
      try {
        permissionService.clearUserPermissions();
        console.log('✅ PermissionStore: 權限已清除');
      } catch (error) {
        console.error('❌ PermissionStore: 清除權限失敗:', error);
        throw error; // 向上傳遞錯誤，讓調用者決定如何處理
      }
    },

    hasPermission: (permission: string) => {
      console.log('🔐 PermissionStore: 檢查權限', permission);
      try {
        const result = permissionService.hasPermission(permission);
        console.log('✅ PermissionStore: 權限檢查結果', { permission, result });
        return result;
      } catch (error) {
        console.error('❌ PermissionStore: 權限檢查失敗:', error);
        return false; // 如果檢查失敗，預設拒絕訪問
      }
    },

    isAdmin: () => {
      try {
        return permissionService.isAdmin();
      } catch (error) {
        console.error('❌ PermissionStore: 管理員檢查失敗:', error);
        return false;
      }
    },

    isManager: () => {
      try {
        return permissionService.isManager();
      } catch (error) {
        console.error('❌ PermissionStore: 經理檢查失敗:', error);
        return false;
      }
    },
  }))
);

// 訂閱用戶狀態變化，自動處理權限
useUserStore.subscribe(
  state => state.currentUser,
  async currentUser => {
    if (currentUser) {
      // 用戶登入時載入權限
      try {
        await usePermissionStore
          .getState()
          .loadUserPermissions(currentUser.id, currentUser.role_id);
      } catch (error) {
        // 這裡可以選擇忽略錯誤，因為權限載入失敗不應影響用戶登入
        console.warn('⚠️ PermissionStore: 權限載入失敗，但用戶仍可繼續使用');
      }
    } else {
      // 用戶登出時清除權限
      try {
        usePermissionStore.getState().clearPermissions();
      } catch (error) {
        // 這裡可以選擇忽略錯誤，因為權限清除失敗不應影響用戶登出
        console.warn('⚠️ PermissionStore: 權限清除失敗，但用戶仍可繼續登出');
      }
    }
  }
);
