
export const LEAVE_PERMISSIONS = {
  REQUEST: 'leave:request',
  APPROVE: 'leave:approve',
  VIEW: 'leave:view',
  MANAGE: 'leave:manage'
} as const;

export const LEAVE_PERMISSION_DEFINITIONS = [
  {
    id: LEAVE_PERMISSIONS.REQUEST,
    name: '請假申請',
    code: LEAVE_PERMISSIONS.REQUEST,
    category: 'leave',
    description: '可以提交請假申請'
  },
  {
    id: LEAVE_PERMISSIONS.APPROVE,
    name: '請假審核',
    code: LEAVE_PERMISSIONS.APPROVE,
    category: 'leave',
    description: '可以審核請假申請'
  },
  {
    id: LEAVE_PERMISSIONS.VIEW,
    name: '查看請假',
    code: LEAVE_PERMISSIONS.VIEW,
    category: 'leave',
    description: '可以查看請假記錄'
  },
  {
    id: LEAVE_PERMISSIONS.MANAGE,
    name: '完整請假管理',
    code: LEAVE_PERMISSIONS.MANAGE,
    category: 'leave',
    description: '具備完整的請假管理權限'
  }
] as const;
