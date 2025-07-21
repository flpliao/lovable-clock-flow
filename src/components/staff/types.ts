export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  branch?: unknown;
  staff_role?: unknown;
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
