
export const DEPARTMENT_PERMISSIONS = {
  VIEW_DEPARTMENTS: 'department:view',
  CREATE_DEPARTMENT: 'department:create',
  EDIT_DEPARTMENT: 'department:edit',
  DELETE_DEPARTMENT: 'department:delete',
  MANAGE_DEPARTMENTS: 'department:manage'
} as const;

export const DEPARTMENT_PERMISSION_DEFINITIONS = [
  {
    id: DEPARTMENT_PERMISSIONS.VIEW_DEPARTMENTS,
    name: '查看部門',
    code: DEPARTMENT_PERMISSIONS.VIEW_DEPARTMENTS,
    category: 'department',
    description: '可以查看部門列表'
  },
  {
    id: DEPARTMENT_PERMISSIONS.CREATE_DEPARTMENT,
    name: '新增部門',
    code: DEPARTMENT_PERMISSIONS.CREATE_DEPARTMENT,
    category: 'department',
    description: '可以新增部門'
  },
  {
    id: DEPARTMENT_PERMISSIONS.EDIT_DEPARTMENT,
    name: '編輯部門',
    code: DEPARTMENT_PERMISSIONS.EDIT_DEPARTMENT,
    category: 'department',
    description: '可以編輯部門信息'
  },
  {
    id: DEPARTMENT_PERMISSIONS.DELETE_DEPARTMENT,
    name: '刪除部門',
    code: DEPARTMENT_PERMISSIONS.DELETE_DEPARTMENT,
    category: 'department',
    description: '可以刪除部門'
  },
  {
    id: DEPARTMENT_PERMISSIONS.MANAGE_DEPARTMENTS,
    name: '完整部門管理',
    code: DEPARTMENT_PERMISSIONS.MANAGE_DEPARTMENTS,
    category: 'department',
    description: '具備完整的部門管理權限'
  }
] as const;
