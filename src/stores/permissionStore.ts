import { permissionService } from '@/services/simplifiedPermissionService';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useUserStore } from './userStore';

interface PermissionState {
  // 狀態
  permissionCache: Map<string, boolean>;
  isLoadingPermission: boolean;

  // 計算屬性 getters
  isAdmin: () => boolean;
  isManager: () => boolean;
  canManageUser: (targetUserId: string) => boolean;

  // 動作
  hasPermission: (permission: string) => Promise<boolean>;
  clearPermissionCache: () => void;
  refreshPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  subscribeWithSelector(set => ({
    // 初始狀態
    permissionCache: new Map(),
    isLoadingPermission: false,

    // 計算屬性 - 使用新的權限服務
    isAdmin: () => {
      return permissionService.isAdmin();
    },

    isManager: () => {
      return permissionService.isManager();
    },

    canManageUser: (targetUserId: string) => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) return false;

      // 管理員可以管理所有用戶
      if (permissionService.isAdmin()) return true;

      // 用戶可以管理自己
      const result = currentUser.id === targetUserId;
      console.log('🔐 PermissionStore: 用戶管理檢查', {
        currentUserId: currentUser.id,
        targetUserId,
        result,
      });

      return result;
    },

    // 權限檢查方法 - 優先使用新的同步權限服務
    hasPermission: async (permission: string) => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) {
        console.log('🔐 PermissionStore: 用戶未登入，權限檢查失敗');
        return false;
      }

      // 🆕 如果權限已載入，使用同步檢查
      if (permissionService.isPermissionsLoaded()) {
        try {
          const result = permissionService.hasPermission(permission);
          console.log('🔐 PermissionStore: 同步權限檢查完成', {
            user: currentUser.name,
            permission,
            result,
          });
          return result;
        } catch (error) {
          console.error('❌ PermissionStore: 同步權限檢查錯誤', error);
          return false;
        }
      }

      // 備用方案：嘗試載入權限然後檢查
      try {
        console.log('⚠️ PermissionStore: 權限未載入，嘗試載入...');
        await permissionService.loadUserPermissions({
          id: currentUser.id,
          role_id: currentUser.role_id,
        });

        const result = permissionService.hasPermission(permission);
        console.log('🔐 PermissionStore: 權限載入後檢查完成', {
          user: currentUser.name,
          permission,
          result,
        });
        return result;
      } catch (error) {
        console.error('❌ PermissionStore: 權限檢查錯誤', error);
        return false;
      }
    },

    // 清除權限快取
    clearPermissionCache: () => {
      console.log('🧹 PermissionStore: 清除權限快取');
      set({ permissionCache: new Map() });

      // 🆕 同時清除新權限服務的快取
      permissionService.clearUserPermissions();
    },

    // 刷新權限 - 重新載入當前用戶權限
    refreshPermissions: () => {
      console.log('🔄 PermissionStore: 刷新權限');
      const { currentUser } = useUserStore.getState();

      if (currentUser) {
        // 🆕 重新載入當前用戶權限
        permissionService.reloadCurrentUserPermissions(currentUser.id, currentUser.role_id);
      }

      // 觸發全域事件，通知其他組件權限已更新
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('permissionRefreshed', {
            detail: { timestamp: Date.now() },
          })
        );
      }
    },
  }))
);

// 監聽用戶變化，自動清除權限快取
useUserStore.subscribe(
  state => state.currentUser,
  (currentUser, previousUser) => {
    if (currentUser?.id !== previousUser?.id) {
      console.log('👤 PermissionStore: 用戶變化，清除權限快取');
      usePermissionStore.getState().clearPermissionCache();
    }
  }
);
