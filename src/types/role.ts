export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  is_system_role?: boolean;
  permissions?: Permission[];
}

export interface NewRole {
  id: string;
  name: string;
  description?: string | null;
  is_system_role?: boolean;
  permissions?: Permission[];
}
