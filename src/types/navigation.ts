import { Employee } from './employee';
import { MenuItemWithIcon } from './menu';

// 桌面導航 Props
export interface DesktopNavigationProps {
  visibleMenuItems: MenuItemWithIcon[];
}

// 行動導航 Props
export interface MobileNavigationProps {
  isOpen: boolean;
  employee: Employee;
  visibleMenuItems: MenuItemWithIcon[];
  onClose: () => void;
}
