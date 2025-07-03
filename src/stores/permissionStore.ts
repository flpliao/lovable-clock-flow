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
  subscribeWithSelector((set, get) => ({
    // 初始狀態
    permissionCache: new Map(),
    isLoadingPermission: false,
    
    // 計算屬性 - 基於當前用戶的角色
    isAdmin: () => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) return false;
      
      const result = currentUser.role_id === 'admin';
      console.log('🔐 PermissionStore: Admin 檢查', {
        user: currentUser.name,
        role_id: currentUser.role_id,
        result
      });
      
      return result;
    },
    
    isManager: () => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) return false;
      
      const result = currentUser.role_id === 'manager' || get().isAdmin();
      console.log('🔐 PermissionStore: Manager 檢查', {
        user: currentUser.name,
        role_id: currentUser.role_id,
        result
      });
      
      return result;
    },
    
    canManageUser: (targetUserId: string) => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) return false;
      
      // 管理員可以管理所有用戶
      if (get().isAdmin()) return true;
      
      // 用戶可以管理自己
      const result = currentUser.id === targetUserId;
      console.log('🔐 PermissionStore: 用戶管理檢查', {
        currentUserId: currentUser.id,
        targetUserId,
        result
      });
      
      return result;
    },
    
    // 權限檢查方法
    hasPermission: async (permission: string) => {
      const { currentUser } = useUserStore.getState();
      if (!currentUser) {
        console.log('🔐 PermissionStore: 用戶未登入，權限檢查失敗');
        return false;
      }
      
      // 檢查快取
      const cached = get().permissionCache.get(`${currentUser.id}-${permission}`);
      if (cached !== undefined) {
        console.log('🔐 PermissionStore: 使用快取權限結果', permission, cached);
        return cached;
      }
      
      try {
        set({ isLoadingPermission: true });
        
        const result = await permissionService.hasPermission(permission);
        
        // 更新快取
        const newCache = new Map(get().permissionCache);
        newCache.set(`${currentUser.id}-${permission}`, result);
        set({ permissionCache: newCache });
        
        console.log('🔐 PermissionStore: 權限檢查完成', {
          user: currentUser.name,
          permission,
          result
        });
        
        return result;
      } catch (error) {
        console.error('❌ PermissionStore: 權限檢查錯誤', error);
        return false;
      } finally {
        set({ isLoadingPermission: false });
      }
    },
    
    // 清除權限快取
    clearPermissionCache: () => {
      console.log('🧹 PermissionStore: 清除權限快取');
      set({ permissionCache: new Map() });
      
      // 同時清除底層服務的快取
      permissionService.clearCache();
    },
    
    // 刷新權限 - 清除快取並觸發重新檢查
    refreshPermissions: () => {
      console.log('🔄 PermissionStore: 刷新權限');
      get().clearPermissionCache();
      
      // 觸發全域事件，通知其他組件權限已更新
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('permissionRefreshed', {
          detail: { timestamp: Date.now() }
        }));
      }
    }
  }))
);

// 監聽用戶變化，自動清除權限快取
useUserStore.subscribe(
  (state) => state.currentUser,
  (currentUser, previousUser) => {
    if (currentUser?.id !== previousUser?.id) {
      console.log('👤 PermissionStore: 用戶變化，清除權限快取');
      usePermissionStore.getState().clearPermissionCache();
    }
  }
); 