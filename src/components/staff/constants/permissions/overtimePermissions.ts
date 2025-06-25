
export const OVERTIME_PERMISSIONS = {
  // 基本權限
  VIEW_OWN_OVERTIME: 'overtime:view_own',
  CREATE_OVERTIME: 'overtime:create',
  UPDATE_OWN_OVERTIME: 'overtime:update_own',
  DELETE_OWN_OVERTIME: 'overtime:delete_own',
  
  // 審核權限
  APPROVE_OVERTIME: 'overtime:approve',
  VIEW_SUBORDINATE_OVERTIME: 'overtime:view_subordinate',
  
  // 管理權限
  VIEW_ALL_OVERTIME: 'overtime:view_all',
  MANAGE_OVERTIME: 'overtime:manage',
  EXPORT_OVERTIME: 'overtime:export',
  
  // 報表權限
  VIEW_OVERTIME_REPORTS: 'overtime:view_reports',
  MANAGE_OVERTIME_REPORTS: 'overtime:manage_reports'
} as const;

export type OvertimePermission = typeof OVERTIME_PERMISSIONS[keyof typeof OVERTIME_PERMISSIONS];

// 添加權限定義，對齊其他權限文件的結構
export const OVERTIME_PERMISSION_DEFINITIONS = [
  {
    id: OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME,
    name: '查看自己的加班記錄',
    category: 'overtime',
    description: '允許查看自己的加班申請和記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.CREATE_OVERTIME,
    name: '申請加班',
    category: 'overtime',
    description: '允許建立加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.UPDATE_OWN_OVERTIME,
    name: '修改自己的加班申請',
    category: 'overtime',
    description: '允許修改自己待審核的加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.DELETE_OWN_OVERTIME,
    name: '取消自己的加班申請',
    category: 'overtime',
    description: '允許取消自己待審核的加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.APPROVE_OVERTIME,
    name: '審核加班申請',
    category: 'overtime',
    description: '允許審核下屬的加班申請'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_SUBORDINATE_OVERTIME,
    name: '查看下屬加班記錄',
    category: 'overtime',
    description: '允許查看直屬下屬的加班記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME,
    name: '查看所有加班記錄',
    category: 'overtime',
    description: '允許查看所有員工的加班記錄'
  },
  {
    id: OVERTIME_PERMISSIONS.MANAGE_OVERTIME,
    name: '管理加班申請',
    category: 'overtime',
    description: '允許管理所有加班申請和設定'
  },
  {
    id: OVERTIME_PERMISSIONS.EXPORT_OVERTIME,
    name: '匯出加班資料',
    category: 'overtime',
    description: '允許匯出加班記錄和統計資料'
  },
  {
    id: OVERTIME_PERMISSIONS.VIEW_OVERTIME_REPORTS,
    name: '查看加班報表',
    category: 'overtime',
    description: '允許查看加班統計報表'
  },
  {
    id: OVERTIME_PERMISSIONS.MANAGE_OVERTIME_REPORTS,
    name: '管理加班報表',
    category: 'overtime',
    description: '允許管理和設定加班報表'
  }
] as const;
