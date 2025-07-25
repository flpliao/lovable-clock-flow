import { MenuItem } from '@/components/header/menuConfig';

export interface Employee {
  slug: string;
  name: string;
  email: string;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}

export interface DesktopNavigationProps {
  visibleMenuItems: MenuItem[];
  onNavigation: (path: string) => void;
}

export interface MobileNavigationProps {
  isOpen: boolean;
  employee: Employee | null;
  visibleMenuItems: MenuItem[];
  onClose: () => void;
}
