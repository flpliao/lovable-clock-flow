
export const OVERTIME_PERMISSIONS = {
  VIEW_OWN_OVERTIME: 'overtime:view_own',
  VIEW_ALL_OVERTIME: 'overtime:view_all',
  CREATE_OVERTIME: 'overtime:create',
  APPROVE_OVERTIME: 'overtime:approve',
  MANAGE_OVERTIME: 'overtime:manage'
} as const;

export const OVERTIME_PERMISSION_DEFINITIONS = [
  {
    id: OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME,
    name: '查看自己加班記錄',
    code: OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME,
    category: 'overtime',
    description: '可以查看自己的加班申請和記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME,
    name: '查看所有加班記錄',
    code: OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME,
    category: 'overtime',
    description: '可以查看所有員工的加班記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.CREATE_OVERTIME,
    name: '申請加班',
    code: OVERTIME_PERMISSIONS.CREATE_OVERTIME,
    category: 'overtime',
    description: '可以提交加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.APPROVE_OVERTIME,
    name: '審核加班',
    code: OVERTIME_PERMISSIONS.APPROVE_OVERTIME,
    category: 'overtime',
    description: '可以審核員工的加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.MANAGE_OVERTIME,
    name: '完整加班管理',
    code: OVERTIME_PERMISSIONS.MANAGE_OVERTIME,
    category: 'overtime',
    description: '具備完整的加班管理權限'
  }
] as const;
