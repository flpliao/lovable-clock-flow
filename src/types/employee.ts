export interface Employee {
  slug: string;
  name: string;
  email: string;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
