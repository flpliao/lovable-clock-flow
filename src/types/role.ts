export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
}

export interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
}

export interface NewRole {
  name: string;
  permissions?: Permission[];
}
