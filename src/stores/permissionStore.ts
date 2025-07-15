import { Permission } from '@/services/permissionService';
import { create } from 'zustand';

interface PermissionState {
  permissions: Permission[];
  lastUpdate: number | null;

  // 基礎狀態操作
  setPermissions: (permissions: Permission[]) => void;
  clearPermissions: () => void;
}

export const usePermissionStore = create<PermissionState>()(set => ({
  permissions: [],
  lastUpdate: null,

  setPermissions: permissions => {
    set({
      permissions,
      lastUpdate: Date.now(),
    });
  },

  clearPermissions: () => {
    set({
      permissions: [],
      lastUpdate: null,
    });
  },
}));
