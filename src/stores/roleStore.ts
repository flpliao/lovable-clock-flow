import { Role } from '@/services/roleService';
import { create } from 'zustand';

interface RoleState {
  roles: Role[];
}

interface RoleActions {
  // 設定角色列表
  setRoles: (roles: Role[]) => void;

  // 新增角色
  addRole: (role: Role) => void;

  // 更新角色
  updateRole: (role: Role) => void;

  // 刪除角色
  removeRole: (id: string) => void;
}

type RoleStore = RoleState & RoleActions;

export const useRoleStore = create<RoleStore>(set => ({
  // 初始狀態
  roles: [],

  // 設定角色列表
  setRoles: (roles: Role[]) => {
    set({ roles });
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
  removeRole: (id: string) => {
    set(state => ({
      roles: state.roles.filter(role => role.id !== id),
    }));
  },
}));
