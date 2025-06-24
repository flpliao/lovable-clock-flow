
export const MISSED_CHECKIN_PERMISSIONS = {
  VIEW_OWN_MISSED_CHECKIN: 'missed_checkin:view_own',
  VIEW_ALL_MISSED_CHECKIN: 'missed_checkin:view_all',
  CREATE_MISSED_CHECKIN: 'missed_checkin:create',
  APPROVE_MISSED_CHECKIN: 'missed_checkin:approve',
  MANAGE_MISSED_CHECKIN: 'missed_checkin:manage'
} as const;

export const MISSED_CHECKIN_PERMISSION_DEFINITIONS = [
  {
    id: MISSED_CHECKIN_PERMISSIONS.VIEW_OWN_MISSED_CHECKIN,
    name: '查看自己忘記打卡記錄',
    code: MISSED_CHECKIN_PERMISSIONS.VIEW_OWN_MISSED_CHECKIN,
    category: 'missed_checkin',
    description: '可以查看自己的忘記打卡申請和記錄'
  },
  {
    id: MISSED_CHECKIN_PERMISSIONS.VIEW_ALL_MISSED_CHECKIN,
    name: '查看所有忘記打卡記錄',
    code: MISSED_CHECKIN_PERMISSIONS.VIEW_ALL_MISSED_CHECKIN,
    category: 'missed_checkin',
    description: '可以查看所有員工的忘記打卡記錄'
  },
  {
    id: MISSED_CHECKIN_PERMISSIONS.CREATE_MISSED_CHECKIN,
    name: '申請忘記打卡',
    code: MISSED_CHECKIN_PERMISSIONS.CREATE_MISSED_CHECKIN,
    category: 'missed_checkin',
    description: '可以提交忘記打卡申請'
  },
  {
    id: MISSED_CHECKIN_PERMISSIONS.APPROVE_MISSED_CHECKIN,
    name: '審核忘記打卡',
    code: MISSED_CHECKIN_PERMISSIONS.APPROVE_MISSED_CHECKIN,
    category: 'missed_checkin',
    description: '可以審核員工的忘記打卡申請'
  },
  {
    id: MISSED_CHECKIN_PERMISSIONS.MANAGE_MISSED_CHECKIN,
    name: '完整忘記打卡管理',
    code: MISSED_CHECKIN_PERMISSIONS.MANAGE_MISSED_CHECKIN,
    category: 'missed_checkin',
    description: '具備完整的忘記打卡管理權限'
  }
] as const;
