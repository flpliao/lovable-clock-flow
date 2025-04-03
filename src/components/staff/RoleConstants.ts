
import { Permission, StaffRole } from './types';

// Define all available permissions in the system
export const availablePermissions: Permission[] = [
  // Staff management permissions
  { 
    id: 'staff_view',
    name: '查看人員資料',
    code: 'staff:view',
    description: '允許查看所有人員資料',
    category: '人員管理'
  },
  { 
    id: 'staff_create', 
    name: '新增人員', 
    code: 'staff:create', 
    description: '允許新增人員到系統', 
    category: '人員管理'
  },
  { 
    id: 'staff_edit', 
    name: '編輯人員', 
    code: 'staff:edit', 
    description: '允許編輯人員資料', 
    category: '人員管理'
  },
  { 
    id: 'staff_delete', 
    name: '刪除人員', 
    code: 'staff:delete', 
    description: '允許刪除人員', 
    category: '人員管理'
  },
  
  // Department management permissions
  { 
    id: 'dept_view', 
    name: '查看部門資料', 
    code: 'department:view', 
    description: '允許查看所有部門資料', 
    category: '部門管理'
  },
  { 
    id: 'dept_create', 
    name: '新增部門', 
    code: 'department:create', 
    description: '允許新增部門到系統', 
    category: '部門管理'
  },
  { 
    id: 'dept_edit', 
    name: '編輯部門', 
    code: 'department:edit', 
    description: '允許編輯部門資料', 
    category: '部門管理'
  },
  { 
    id: 'dept_delete', 
    name: '刪除部門', 
    code: 'department:delete', 
    description: '允許刪除部門', 
    category: '部門管理'
  },
  
  // Schedule management permissions
  { 
    id: 'schedule_view', 
    name: '查看排班', 
    code: 'schedule:view', 
    description: '允許查看排班資料', 
    category: '排班管理'
  },
  { 
    id: 'schedule_create', 
    name: '建立排班', 
    code: 'schedule:create', 
    description: '允許建立新排班', 
    category: '排班管理'
  },
  { 
    id: 'schedule_edit', 
    name: '編輯排班', 
    code: 'schedule:edit', 
    description: '允許編輯排班資料', 
    category: '排班管理'
  },
  { 
    id: 'schedule_delete', 
    name: '刪除排班', 
    code: 'schedule:delete', 
    description: '允許刪除排班', 
    category: '排班管理'
  },
  
  // Leave request permissions
  { 
    id: 'leave_view', 
    name: '查看請假申請', 
    code: 'leave:view', 
    description: '允許查看請假申請資料', 
    category: '請假管理'
  },
  { 
    id: 'leave_create', 
    name: '提交請假申請', 
    code: 'leave:create', 
    description: '允許提交請假申請', 
    category: '請假管理'
  },
  { 
    id: 'leave_approve', 
    name: '審批請假申請', 
    code: 'leave:approve', 
    description: '允許審批請假申請', 
    category: '請假管理'
  },
  
  // Role management permissions (admin only)
  { 
    id: 'role_manage', 
    name: '管理角色', 
    code: 'role:manage', 
    description: '允許管理系統角色和權限', 
    category: '系統管理'
  },
];

// Define default system roles
export const defaultSystemRoles: StaffRole[] = [
  {
    id: 'admin',
    name: '系統管理員',
    description: '完整系統管理權限',
    permissions: availablePermissions,
    is_system_role: true
  },
  {
    id: 'user',
    name: '一般使用者',
    description: '基本使用權限',
    permissions: availablePermissions.filter(p => 
      p.code === 'staff:view' || 
      p.code === 'department:view' || 
      p.code === 'schedule:view' ||
      p.code === 'leave:view' ||
      p.code === 'leave:create'
    ),
    is_system_role: true
  },
  {
    id: 'hr_manager',
    name: '人資主管',
    description: '人資部門主管權限',
    permissions: availablePermissions.filter(p => 
      p.category === '人員管理' || 
      p.category === '部門管理' || 
      p.code === 'leave:approve'
    ),
    is_system_role: true
  },
  {
    id: 'department_manager',
    name: '部門主管',
    description: '部門主管權限',
    permissions: availablePermissions.filter(p => 
      p.code === 'staff:view' || 
      p.code === 'department:view' || 
      p.code === 'schedule:view' ||
      p.code === 'schedule:create' ||
      p.code === 'schedule:edit' ||
      p.code === 'leave:view' ||
      p.code === 'leave:approve'
    ),
    is_system_role: true
  }
];

// Get permission categories for grouping in the UI
export const getPermissionCategories = (): string[] => {
  const categories = new Set<string>();
  availablePermissions.forEach(p => categories.add(p.category));
  return Array.from(categories);
};

// Group permissions by category
export const getPermissionsByCategory = (): Record<string, Permission[]> => {
  const groupedPermissions: Record<string, Permission[]> = {};
  
  availablePermissions.forEach(permission => {
    if (!groupedPermissions[permission.category]) {
      groupedPermissions[permission.category] = [];
    }
    groupedPermissions[permission.category].push(permission);
  });
  
  return groupedPermissions;
};
