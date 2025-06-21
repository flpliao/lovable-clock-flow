
export const STAFF_PERMISSIONS = {
  VIEW: 'staff:view',
  CREATE: 'staff:create',
  EDIT: 'staff:edit',
  DELETE: 'staff:delete',
  MANAGE: 'staff:manage'
} as const;

export const LEAVE_PERMISSIONS = {
  REQUEST: 'leave:request',
  APPROVE: 'leave:approve',
  VIEW: 'leave:view',
  MANAGE: 'leave:manage'
} as const;

export const ANNOUNCEMENT_PERMISSIONS = {
  VIEW: 'announcement:view',
  CREATE: 'announcement:create',
  EDIT: 'announcement:edit',
  DELETE: 'announcement:delete',
  PUBLISH: 'announcement:publish',
  MANAGE: 'announcement:manage'
} as const;

export const HOLIDAY_PERMISSIONS = {
  VIEW: 'holiday:view',
  CREATE: 'holiday:create',
  EDIT: 'holiday:edit',
  DELETE: 'holiday:delete',
  MANAGE: 'holiday:manage'
} as const;

export const DEPARTMENT_PERMISSIONS = {
    VIEW_DEPARTMENTS: 'department:view',
    CREATE_DEPARTMENT: 'department:create',
    EDIT_DEPARTMENT: 'department:edit',
    DELETE_DEPARTMENT: 'department:delete',
    MANAGE_DEPARTMENTS: 'department:manage'
} as const;

// 排班管理權限
export const SCHEDULE_PERMISSIONS = {
  VIEW_ALL_SCHEDULES: 'schedule:view_all',
  VIEW_OWN_SCHEDULE: 'schedule:view_own',
  CREATE_SCHEDULE: 'schedule:create',
  EDIT_SCHEDULE: 'schedule:edit',
  DELETE_SCHEDULE: 'schedule:delete',
  MANAGE_SCHEDULE: 'schedule:manage'
} as const;

export const ALL_PERMISSIONS = [
  {
    id: STAFF_PERMISSIONS.VIEW,
    name: '查看員工',
    code: STAFF_PERMISSIONS.VIEW,
    category: 'staff',
    description: '可以查看員工列表和詳細信息'
  },
  {
    id: STAFF_PERMISSIONS.CREATE,
    name: '新增員工',
    code: STAFF_PERMISSIONS.CREATE,
    category: 'staff',
    description: '可以新增員工'
  },
  {
    id: STAFF_PERMISSIONS.EDIT,
    name: '編輯員工',
    code: STAFF_PERMISSIONS.EDIT,
    category: 'staff',
    description: '可以編輯員工信息'
  },
  {
    id: STAFF_PERMISSIONS.DELETE,
    name: '刪除員工',
    code: STAFF_PERMISSIONS.DELETE,
    category: 'staff',
    description: '可以刪除員工'
  },
  {
    id: STAFF_PERMISSIONS.MANAGE,
    name: '完整員工管理',
    code: STAFF_PERMISSIONS.MANAGE,
    category: 'staff',
    description: '具備完整的員工管理權限'
  },
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
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.VIEW,
    name: '查看公告',
    code: ANNOUNCEMENT_PERMISSIONS.VIEW,
    category: 'announcement',
    description: '可以查看公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.CREATE,
    name: '新增公告',
    code: ANNOUNCEMENT_PERMISSIONS.CREATE,
    category: 'announcement',
    description: '可以新增公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.EDIT,
    name: '編輯公告',
    code: ANNOUNCEMENT_PERMISSIONS.EDIT,
    category: 'announcement',
    description: '可以編輯公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.DELETE,
    name: '刪除公告',
    code: ANNOUNCEMENT_PERMISSIONS.DELETE,
    category: 'announcement',
    description: '可以刪除公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
    name: '發布公告',
    code: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
    category: 'announcement',
    description: '可以發布公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.MANAGE,
    name: '完整公告管理',
    code: ANNOUNCEMENT_PERMISSIONS.MANAGE,
    category: 'announcement',
    description: '具備完整的公告管理權限'
  },
  {
    id: HOLIDAY_PERMISSIONS.VIEW,
    name: '查看節假日',
    code: HOLIDAY_PERMISSIONS.VIEW,
    category: 'holiday',
    description: '可以查看公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.CREATE,
    name: '新增節假日',
    code: HOLIDAY_PERMISSIONS.CREATE,
    category: 'holiday',
    description: '可以新增公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.EDIT,
    name: '編輯節假日',
    code: HOLIDAY_PERMISSIONS.EDIT,
    category: 'holiday',
    description: '可以編輯公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.DELETE,
    name: '刪除節假日',
    code: HOLIDAY_PERMISSIONS.DELETE,
    category: 'holiday',
    description: '可以刪除公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.MANAGE,
    name: '完整節假日管理',
    code: HOLIDAY_PERMISSIONS.MANAGE,
    category: 'holiday',
    description: '具備完整的節假日管理權限'
  },
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
  },
  
  // 排班管理權限
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
