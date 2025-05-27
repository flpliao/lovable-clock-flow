
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
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  branch_id?: string;
  contact: string;
  role: 'admin' | 'user';
  role_id?: string;
  supervisor_id?: string;
  username?: string;
  email?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
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
  roles: Role[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (role: Role) => void;
  deleteRole: (id: string) => void;
  getRole: (id: string) => Role | undefined;
  hasPermission: (roleId: string, permissionId: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => void;
}
