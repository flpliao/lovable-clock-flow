
// 加班權限設定 - 仿照 leavePermissions.ts
export const OVERTIME_PERMISSIONS = {
  // 查看權限
  VIEW_OWN_OVERTIME: 'overtime:view_own',
  VIEW_ALL_OVERTIME: 'overtime:view_all',
  VIEW_TEAM_OVERTIME: 'overtime:view_team',
  
  // 申請權限
  CREATE_OVERTIME: 'overtime:create',
  EDIT_OWN_OVERTIME: 'overtime:edit_own',
  DELETE_OWN_OVERTIME: 'overtime:delete_own',
  
  // 審核權限 - 更新為使用資料庫中的權限代碼
  APPROVE_OVERTIME_LEVEL_1: 'overtime:approve',
  APPROVE_OVERTIME_LEVEL_2: 'overtime:approve_level_2',
  REJECT_OVERTIME: 'overtime:reject',
  
  // 管理權限
  MANAGE_OVERTIME_TYPES: 'overtime:manage_types',
  EXPORT_OVERTIME_RECORDS: 'overtime:export_records',
  VIEW_OVERTIME_STATISTICS: 'overtime:view_statistics',
  
  // 系統管理權限
  SYSTEM_MANAGE_OVERTIME: 'overtime:system_manage'
} as const;

export const OVERTIME_PERMISSION_DEFINITIONS = [
  {
    id: OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME,
    code: OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME,
    name: '查看自己的加班記錄',
    description: '可以查看自己提交的加班申請記錄',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME,
    code: OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME,
    name: '查看所有加班記錄', 
    description: '可以查看系統中所有的加班申請記錄',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_TEAM_OVERTIME,
    code: OVERTIME_PERMISSIONS.VIEW_TEAM_OVERTIME,
    name: '查看團隊加班記錄',
    description: '可以查看所管理團隊的加班申請記錄',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.CREATE_OVERTIME,
    code: OVERTIME_PERMISSIONS.CREATE_OVERTIME,
    name: '提交加班申請',
    description: '可以提交新的加班申請',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.EDIT_OWN_OVERTIME,
    code: OVERTIME_PERMISSIONS.EDIT_OWN_OVERTIME,
    name: '編輯自己的加班申請',
    description: '可以編輯自己提交的待審核加班申請',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.DELETE_OWN_OVERTIME,
    code: OVERTIME_PERMISSIONS.DELETE_OWN_OVERTIME,
    name: '刪除自己的加班申請',
    description: '可以刪除自己提交的待審核加班申請',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_1,
    code: OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_1,
    name: '審核加班申請',
    description: '可以審核和批准加班申請',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_2,
    code: OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_2,
    name: '二級主管審核加班',
    description: '可以作為二級主管審核加班申請',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.REJECT_OVERTIME,
    code: OVERTIME_PERMISSIONS.REJECT_OVERTIME,
    name: '拒絕加班申請',
    description: '可以拒絕加班申請並提供拒絕理由',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.MANAGE_OVERTIME_TYPES,
    code: OVERTIME_PERMISSIONS.MANAGE_OVERTIME_TYPES,
    name: '管理加班類型',
    description: '可以新增、編輯、刪除加班類型',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.EXPORT_OVERTIME_RECORDS,
    code: OVERTIME_PERMISSIONS.EXPORT_OVERTIME_RECORDS,
    name: '匯出加班記錄',
    description: '可以匯出加班記錄為Excel檔案',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_OVERTIME_STATISTICS,
    code: OVERTIME_PERMISSIONS.VIEW_OVERTIME_STATISTICS,
    name: '查看加班統計',
    description: '可以查看加班統計報表和分析數據',
    category: 'overtime'
  },
  {
    id: OVERTIME_PERMISSIONS.SYSTEM_MANAGE_OVERTIME,
    code: OVERTIME_PERMISSIONS.SYSTEM_MANAGE_OVERTIME,
    name: '系統管理加班',
    description: '具有加班系統的完整管理權限',
    category: 'overtime'
  }
] as const;
