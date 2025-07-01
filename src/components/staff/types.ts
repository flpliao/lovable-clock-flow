
export interface Staff {
  id: string;
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
  handleDeleteStaff: (id: string) => Promise<void>;
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  refreshData: () => Promise<void>;
  performFullSync: () => Promise<any>;
  roles: StaffRole[];
  addRole: (newRole: Omit<StaffRole, 'id'>) => Promise<boolean>;
  updateRole: (updatedRole: StaffRole) => Promise<boolean>;
  deleteRole: (roleId: string) => Promise<boolean>;
  getRole: (roleId?: string) => StaffRole | undefined;
  hasPermission: (staffId: string, permissionCode: string) => boolean;
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
}
