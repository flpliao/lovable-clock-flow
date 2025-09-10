import { Role } from '@/types/role';
import { create } from 'zustand';

interface RoleState {
  roles: Role[];
  loading: boolean;
}

interface RoleActions {
  // 設定角色列表
  setRoles: (roles: Role[]) => void;

  // 設定載入狀態
  setLoading: (loading: boolean) => void;

  // 新增角色
  addRole: (role: Role) => void;

  // 更新角色
  updateRole: (role: Role) => void;

  // 刪除角色
  removeRole: (id: number) => void;
}

type RoleStore = RoleState & RoleActions;

export const useRoleStore = create<RoleStore>(set => ({
  // 初始狀態
  roles: [],
  loading: false,

  // 設定角色列表
  setRoles: (roles: Role[]) => {
    set({ roles });
  },

  // 設定載入狀態
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 新增角色
  addRole: (role: Role) => {
    set(state => ({
      roles: [...state.roles, role],
    }));
  },

  // 更新角色
  updateRole: (updatedRole: Role) => {
    set(state => ({
      roles: state.roles.map(role => (role.id === updatedRole.id ? updatedRole : role)),
    }));
  },

  // 刪除角色
  removeRole: (id: number) => {
    set(state => ({
      roles: state.roles.filter(role => role.id !== id),
    }));
  },
}));
