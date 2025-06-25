
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
