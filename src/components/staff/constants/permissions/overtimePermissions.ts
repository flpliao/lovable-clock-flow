
export const OVERTIME_PERMISSIONS = {
  REQUEST: 'overtime:request',
  APPROVE: 'overtime:approve',
  VIEW: 'overtime:view',
  MANAGE: 'overtime:manage'
} as const;

export const OVERTIME_PERMISSION_DEFINITIONS = [
  {
    id: OVERTIME_PERMISSIONS.REQUEST,
    name: '加班申請',
    code: OVERTIME_PERMISSIONS.REQUEST,
    category: 'overtime',
    description: '可以提交加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.APPROVE,
    name: '加班審核',
    code: OVERTIME_PERMISSIONS.APPROVE,
    category: 'overtime',
    description: '可以審核加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW,
    name: '查看加班',
    code: OVERTIME_PERMISSIONS.VIEW,
    category: 'overtime',
    description: '可以查看加班記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.MANAGE,
    name: '完整加班管理',
    code: OVERTIME_PERMISSIONS.MANAGE,
    category: 'overtime',
    description: '具備完整的加班管理權限'
  }
] as const;
