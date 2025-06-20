
import { Permission } from '../types';

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
  
  // Position management permissions
  { 
    id: 'position_view', 
    name: '查看職位資料', 
    code: 'position:view', 
    description: '允許查看所有職位資料', 
    category: '職位管理'
  },
  { 
    id: 'position_create', 
    name: '新增職位', 
    code: 'position:create', 
    description: '允許新增職位到系統', 
    category: '職位管理'
  },
  { 
    id: 'position_edit', 
    name: '編輯職位', 
    code: 'position:edit', 
    description: '允許編輯職位資料', 
    category: '職位管理'
  },
  { 
    id: 'position_delete', 
    name: '刪除職位', 
    code: 'position:delete', 
    description: '允許刪除職位', 
    category: '職位管理'
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
  
  // Announcement management permissions
  { 
    id: 'announcement_view', 
    name: '查看公告', 
    code: 'announcement:view', 
    description: '允許查看所有公告', 
    category: '公告管理'
  },
  { 
    id: 'announcement_create', 
    name: '新增公告', 
    code: 'announcement:create', 
    description: '允許建立新公告', 
    category: '公告管理'
  },
  { 
    id: 'announcement_edit', 
    name: '編輯公告', 
    code: 'announcement:edit', 
    description: '允許編輯現有公告', 
    category: '公告管理'
  },
  { 
    id: 'announcement_delete', 
    name: '刪除公告', 
    code: 'announcement:delete', 
    description: '允許刪除公告', 
    category: '公告管理'
  },
  { 
    id: 'announcement_publish', 
    name: '發布公告', 
    code: 'announcement:publish', 
    description: '允許發布公告給所有員工', 
    category: '公告管理'
  },
  
  // Account management permissions (新增帳號管理權限)
  { 
    id: 'account_email_manage', 
    name: '修改使用者電子郵件地址', 
    code: 'account:email:manage', 
    description: '允許此角色修改他人帳號的登入電子郵件地址', 
    category: '帳號設定管理'
  },
  { 
    id: 'account_password_manage', 
    name: '修改使用者登入密碼', 
    code: 'account:password:manage', 
    description: '允許此角色重設其他使用者的登入密碼', 
    category: '帳號設定管理'
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
