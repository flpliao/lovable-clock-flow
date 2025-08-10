export interface Department {
  slug: string;
  name: string;
  code?: string;
  description?: string;
  parent_department_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  parent_department?: Department;
  child_departments?: Department[];
}
