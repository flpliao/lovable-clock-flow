export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin' | string;
  role_id?: string;
  supervisor_id?: string;
  permissions?: string[];
}

export interface NewStaff {
  name: string;
  position: string;
  department: string;
  contact: string;
  role: 'user' | 'admin' | string;
  role_id?: string;
  supervisor_id?: string;
  permissions?: string[];
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  is_system_role: boolean;
}

export interface NewStaffRole {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
}

export interface StaffManagementContextType {
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
  handleAddStaff: () => void;
  handleEditStaff: () => void;
  handleDeleteStaff: (id: string) => void;
  openEditDialog: (staff: Staff) => void;
  getSupervisorName: (supervisorId?: string) => string;
  getSubordinates: (staffId: string) => Staff[];
  
  roles: StaffRole[];
  addRole: (role: NewStaffRole) => Promise<boolean>;
  updateRole: (role: StaffRole) => Promise<boolean>;
  deleteRole: (roleId: string) => Promise<boolean>;
  
  assignRoleToStaff: (staffId: string, roleId: string) => Promise<boolean>;
  
  hasPermission: (staffId: string, permissionCode: string) => boolean;
}
