// 角色 ID 對照表，請全面改用此常數，不要再用 staff.role
export const ROLE_ID_MAP: Record<string, string> = {
  admin: '系統管理員',
  manager: '部門主管',
  hr_manager: 'HR主管',
  department_manager: '部門主管',
  user: '一般員工',
  staff: '一般員工',
  sales_manager: '營業主管',
  store_manager: '店長',
  // 其他自訂角色可依需求補上
}; 