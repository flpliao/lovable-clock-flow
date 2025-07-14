import { Permission } from '@/services/permissionService';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface PermissionState {
  permissions: Permission[];
  lastUpdate: number | null;

  // 基礎狀態操作
  setPermissions: (permissions: Permission[]) => void;
  clearPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  subscribeWithSelector(set => ({
    // 初始狀態
    permissions: [],
    lastUpdate: null,

    // 基礎狀態操作
    setPermissions: permissions => {
      console.log('✅ PermissionStore: 更新權限資料', `共 ${permissions.length} 個權限`);
      set({
        permissions,
        lastUpdate: Date.now(),
      });
    },

    clearPermissions: () => {
      console.log('🧹 PermissionStore: 清除權限資料');
      set({
        permissions: [],
        lastUpdate: null,
      });
    },
  }))
);
