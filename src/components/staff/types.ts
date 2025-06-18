
export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  branch_id: string; // 改為必填
  branch_name: string;
  contact: string;
  role: 'admin' | 'user' | string;
  role_id: string;
  supervisor_id?: string;
  username?: string;
  email?: string;
  permissions?: string[]; // 直接權限列表
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  branch_id: string; // 改為必填
  branch_name: string;
  contact: string;
  role: 'admin' | 'user' | string;
  role_id: string;
  supervisor_id?: string;
  username?: string;
  email?: string;
}

export interface StaffRole {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
  is_system_role?: boolean;
}

export interface NewStaffRole {
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string; // 新增權限代碼
  description?: string;
  category: string; // 新增權限分類
}

export interface StaffManagementContextType {
  // Staff management
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
  handleDeleteStaff: (id: string) => Promise<void>;
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  refreshData: () => Promise<void>;
  
  // Role management
  roles: StaffRole[];
  addRole: (role: Omit<StaffRole, 'id'>) => Promise<boolean>;
  updateRole: (role: StaffRole) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  getRole: (roleId: string) => StaffRole | undefined;
  hasPermission: (staffId: string, permissionCode: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
}
