export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  branch?: unknown;
  staff_role?: unknown;
  supervisor_name?: string;
  branch_id: string;
  branch_name: string;
  role_name: string;
  contact: string;
  email?: string;
  username?: string;
  hire_date?: string;
  supervisor_id?: string;
  supervisor_name?: string;
  user_id?: string;
  role_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  branch_id: string;
  branch_name: string;
  contact: string;
  email?: string;
  username?: string;
  hire_date?: string;
  supervisor_id?: string;
  role_id: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
}

export interface StaffRole {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  is_system_role?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NewStaffRole {
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface StaffPermission {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
}

// Context type for staff management
export interface StaffManagementContextType {
  staffList: Staff[];
  filteredStaffList: Staff[];
  loading: boolean;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  handleAddStaff: () => Promise<boolean>;
  handleEditStaff: () => Promise<boolean>;
  handleDeleteStaff: (staff: Staff) => void; // 改為接受 Staff 物件
  handleDeleteConfirm: () => Promise<void>; // 新增確認刪除方法
  isDeleteDialogOpen: boolean; // 新增刪除對話框狀態
  setIsDeleteDialogOpen: (open: boolean) => void; // 新增設置刪除對話框狀態
  staffToDelete: Staff | null; // 新增要刪除的員工
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  refreshData: () => Promise<void>;
  performFullSync: () => Promise<{ connectionStatus: boolean; staffData: Staff[] }>;
  roles: StaffRole[];
  addRole: (newRole: Omit<StaffRole, 'id'>) => Promise<boolean>;
  updateRole: (updatedRole: StaffRole) => Promise<boolean>;
  deleteRole: (roleId: string) => Promise<boolean>;
  getRole: (roleId?: string) => StaffRole | undefined;
  hasPermission: (staffId: string, permissionCode: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
}
