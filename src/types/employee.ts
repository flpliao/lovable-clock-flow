export interface Employee {
  slug: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  start_date?: string;
  roles?: string[];
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
