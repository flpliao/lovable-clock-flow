
import { StaffRole } from '../types';
import { availablePermissions } from './permissions';

// Define default system roles
export const defaultSystemRoles: StaffRole[] = [
  {
    id: 'admin',
    name: '系統管理員',
    description: '完整系統管理權限',
    permissions: availablePermissions, // 系統管理員擁有所有權限，包括新的假日管理權限
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
      p.code === 'leave:create' ||
      p.code === 'announcement:view' ||
      p.code === 'holiday:view' // 一般使用者可以查看假日設定
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
      p.category === '公告管理' ||
      p.category === '假日管理' || // 人資主管擁有完整假日管理權限
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
      p.code === 'leave:approve' ||
      p.code === 'announcement:view' ||
      p.code === 'announcement:create' ||
      p.code === 'holiday:view' || // 部門主管可以查看假日設定
      p.code === 'holiday:analytics' // 部門主管可以查看工時分析
    ),
    is_system_role: true
  }
];
