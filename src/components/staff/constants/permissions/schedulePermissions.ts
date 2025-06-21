
export const SCHEDULE_PERMISSIONS = {
  VIEW_ALL_SCHEDULES: 'schedule:view_all',
  VIEW_OWN_SCHEDULE: 'schedule:view_own',
  CREATE_SCHEDULE: 'schedule:create',
  EDIT_SCHEDULE: 'schedule:edit',
  DELETE_SCHEDULE: 'schedule:delete',
  MANAGE_SCHEDULE: 'schedule:manage'
} as const;

export const SCHEDULE_PERMISSION_DEFINITIONS = [
  {
    id: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
    name: '查看所有排班',
    code: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
    category: 'schedule',
    description: '可以查看所有員工的排班記錄'
  },
  {
    id: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
    name: '查看自己排班',
    code: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
    category: 'schedule',
    description: '可以查看自己的排班記錄'
  },
  {
    id: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
    name: '創建排班',
    code: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
    category: 'schedule',
    description: '可以為員工創建新的排班'
  },
  {
    id: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
    name: '編輯排班',
    code: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
    category: 'schedule',
    description: '可以編輯排班記錄'
  },
  {
    id: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
    name: '刪除排班',
    code: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
    category: 'schedule',
    description: '可以刪除排班記錄'
  },
  {
    id: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE,
    name: '完整排班管理',
    code: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE,
    category: 'schedule',
    description: '具備完整的排班管理權限'
  }
] as const;
