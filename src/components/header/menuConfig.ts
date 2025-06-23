
import {
  Home,
  Calendar,
  FileText,
  Settings,
  Users,
  Building2,
  BadgeCheck,
  Megaphone,
  MapPin,
  Clock
} from 'lucide-react';

export interface MenuItem {
  label: string;
  href: string;
  icon: any;
  permission: string;
}

export const getMenuItems = (userRole: string) => {
  const baseMenuItems: MenuItem[] = [
    {
      label: '首頁',
      href: '/',
      icon: Home,
      permission: 'view_dashboard'
    },
    {
      label: '打卡',
      href: '/check-in',
      icon: MapPin,
      permission: 'checkin'
    },
    {
      label: '個人出勤',
      href: '/personal-attendance',
      icon: Calendar,
      permission: 'view_personal_attendance'
    },
    {
      label: '忘記打卡管理',
      href: '/missed-checkin-management',
      icon: Clock,
      permission: 'view_personal_attendance'
    },
    {
      label: '請假申請',
      href: '/leave-request',
      icon: FileText,
      permission: 'submit_leave_request'
    },
    {
      label: '公司公告',
      href: '/company-announcements',
      icon: Megaphone,
      permission: 'view_announcements'
    }
  ];

  const managementMenuItems: MenuItem[] = [
    {
      label: '員工管理',
      href: '/staff-management',
      icon: Users,
      permission: 'manage_staff'
    },
    {
      label: '部門管理',
      href: '/department-management',
      icon: Building2,
      permission: 'manage_departments'
    },
    {
      label: '排班管理',
      href: '/schedule-management',
      icon: Calendar,
      permission: 'manage_schedules'
    },
    {
      label: '核准中心',
      href: '/approval-center',
      icon: BadgeCheck,
      permission: 'approve_requests'
    },
    {
      label: '薪資管理',
      href: '/payroll-management',
      icon: 'LucideMoney',
      permission: 'manage_payroll'
    },
    {
      label: '系統設定',
      href: '/system-settings',
      icon: Settings,
      permission: 'manage_system_settings'
    }
  ];

  let allowedItems = baseMenuItems;

  if (userRole === 'admin' || userRole === 'manager') {
    allowedItems = [...allowedItems, ...managementMenuItems];
  }

  return allowedItems.sort((a, b) => a.label.localeCompare(b.label));
};
