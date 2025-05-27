
export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  branch_id?: string; // 新增營業處ID
  branch_name?: string; // 新增營業處名稱
  contact: string;
  role: 'admin' | 'user' | string;
  role_id?: string;
  supervisor_id?: string;
  username?: string;
  email?: string;
  permissions?: string[]; // 直接權限列表
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  branch_id?: string;
  branch_name?: string; // 新增營業處名稱
  contact: string;
  role: 'admin' | 'user' | string;
  role_id?: string;
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
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
  newStaff: NewStaff;
  setNewStaff: (staff: NewStaff) => void;
  handleAddStaff: () => boolean;
  handleEditStaff: () => boolean;
  handleDeleteStaff: (id: string) => void;
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  
  // Role management
  roles: StaffRole[];
  addRole: (role: NewStaffRole) => Promise<boolean>;
  updateRole: (role: StaffRole) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  getRole: (id: string) => StaffRole | undefined;
  hasPermission: (roleId: string, permissionId: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
}
