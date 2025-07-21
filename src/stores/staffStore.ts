import { NewStaff, Staff, StaffRole } from '@/components/staff/types';
import { staffService } from '@/services/staffService';
import { DataSyncManager } from '@/utils/dataSync';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface StaffState {
  // 資料狀態
  staffList: Staff[];
  roles: StaffRole[];
  loading: boolean;

  // 對話框狀態
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  // 當前操作的員工
  currentStaff: Staff | null;
  staffToDelete: Staff | null;
  newStaff: NewStaff;

  // 動作
  setStaffList: (staffList: Staff[]) => void;
  setRoles: (roles: StaffRole[]) => void;
  setLoading: (loading: boolean) => void;

  // 對話框控制
  setIsAddDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;

  // 員工操作
  setCurrentStaff: (staff: Staff | null) => void;
  setStaffToDelete: (staff: Staff | null) => void;
  setNewStaff: (staff: NewStaff) => void;

  // 商業邏輯
  loadStaffList: () => Promise<void>;
  addStaff: (staffData: NewStaff) => Promise<boolean>;
  updateStaff: (staffData: Staff) => Promise<boolean>;
  deleteStaff: (staffId: string) => Promise<boolean>;
  openEditDialog: (staff: Staff) => void;
  resetNewStaff: () => void;
  refreshData: () => Promise<void>;
  performFullSync: () => Promise<{ connectionStatus: boolean; staffData: Staff[] }>;

  // 工具函數
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  getRole: (roleId?: string) => StaffRole | undefined;
  hasPermission: (staffId: string, permissionCode: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
}

export const useStaffStore = create<StaffState>()(
  subscribeWithSelector((set, get) => ({
    // 初始狀態
    staffList: [],
    roles: [],
    loading: false,
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    currentStaff: null,
    staffToDelete: null,
    newStaff: {
      name: '',
      position: '',
      department: '',
      branch_id: '',
      branch_name: '',
      contact: '',
      role_id: 'user',
    },

    // 基礎狀態設置
    setStaffList: staffList => set({ staffList }),
    setRoles: roles => set({ roles }),
    setLoading: loading => set({ loading }),

    // 對話框控制
    setIsAddDialogOpen: isAddDialogOpen => set({ isAddDialogOpen }),
    setIsEditDialogOpen: isEditDialogOpen => set({ isEditDialogOpen }),
    setIsDeleteDialogOpen: isDeleteDialogOpen => set({ isDeleteDialogOpen }),

    // 員工操作
    setCurrentStaff: currentStaff => set({ currentStaff }),
    setStaffToDelete: staffToDelete => set({ staffToDelete }),
    setNewStaff: newStaff => set({ newStaff }),

    // 載入員工列表
    loadStaffList: async () => {
      try {
        set({ loading: true });
        const data = await staffService.loadStaffList();
        set({ staffList: data });
      } catch (error) {
        console.error('載入員工列表失敗:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // 新增員工
    addStaff: async staffData => {
      try {
        set({ loading: true });
        const newStaff = await staffService.addStaff(staffData);
        const { staffList } = get();
        set({
          staffList: [newStaff, ...staffList],
          isAddDialogOpen: false,
        });
        get().resetNewStaff();
        return true;
      } catch (error) {
        console.error('新增員工失敗:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // 更新員工
    updateStaff: async staffData => {
      try {
        set({ loading: true });
        const updatedStaff = await staffService.updateStaff(staffData.id, staffData);
        const { staffList } = get();
        const updatedList = staffList.map(staff =>
          staff.id === staffData.id ? updatedStaff : staff
        );
        set({
          staffList: updatedList,
          isEditDialogOpen: false,
          currentStaff: null,
        });
        return true;
      } catch (error) {
        console.error('更新員工失敗:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // 刪除員工
    deleteStaff: async staffId => {
      try {
        set({ loading: true });
        await staffService.deleteStaff(staffId);
        const { staffList } = get();
        const filteredList = staffList.filter(staff => staff.id !== staffId);
        set({
          staffList: filteredList,
          isDeleteDialogOpen: false,
          staffToDelete: null,
        });
        return true;
      } catch (error) {
        console.error('刪除員工失敗:', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // 開啟編輯對話框
    openEditDialog: staff => {
      set({
        currentStaff: { ...staff },
        isEditDialogOpen: true,
      });
    },

    // 重置新員工資料
    resetNewStaff: () => {
      set({
        newStaff: {
          name: '',
          position: '',
          department: '',
          branch_id: '',
          branch_name: '',
          contact: '',
          role_id: 'user',
        },
      });
    },

    // 重新載入資料
    refreshData: async () => {
      await get().loadStaffList();
    },

    // 執行完整同步
    performFullSync: async () => {
      const syncResult = await DataSyncManager.performFullSync();
      await get().loadStaffList();
      return syncResult;
    },

    // 取得主管姓名
    getSupervisorName: supervisorId => {
      if (!supervisorId) return '';
      const { staffList } = get();
      const supervisor = staffList.find(staff => staff.id === supervisorId);
      return supervisor?.name || '';
    },

    // 取得下屬列表
    getSubordinates: staffId => {
      const { staffList } = get();
      return staffList.filter(staff => staff.supervisor_id === staffId);
    },

    // 取得角色
    getRole: roleId => {
      if (!roleId) return undefined;
      const { roles } = get();
      return roles.find(role => role.id === roleId);
    },

    // 檢查權限
    hasPermission: (_staffId, _permissionCode) => {
      // 這裡可以整合權限服務
      // 暫時返回 true，實際實作時需要整合權限系統
      return true;
    },

    // 分配角色給員工
    assignRoleToStaff: async (staffId, roleId) => {
      try {
        const { staffList } = get();
        const staff = staffList.find(s => s.id === staffId);
        if (!staff) return false;

        const updatedStaff = { ...staff, role_id: roleId };
        return await get().updateStaff(updatedStaff);
      } catch (error) {
        console.error('分配角色失敗:', error);
        return false;
      }
    },
  }))
);
