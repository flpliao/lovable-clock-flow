import { EmployeeRole } from '@/constants/employee';
import useEmployeeStore from '@/stores/employeeStore';

/**
 * 權限控制 hook
 * 提供用戶角色檢查和路由權限驗證功能
 * 使用 employee 的 roles 欄位進行權限控制
 */
export const useAuth = () => {
  const { employee, isAuthenticated } = useEmployeeStore();

  /**
   * 檢查用戶是否有指定角色
   */
  const hasRole = (requiredRoles: EmployeeRole[]): boolean => {
    if (!employee || !employee.roles || employee.roles.length === 0) return false;
    return requiredRoles.some(role => employee.roles!.includes(role));
  };

  /**
   * 檢查用戶是否有任一指定角色
   */
  const hasAnyRole = (requiredRoles: EmployeeRole[]): boolean => {
    return hasRole(requiredRoles);
  };

  /**
   * 檢查用戶是否有所有指定角色（通常用於多角色組合）
   */
  const hasAllRoles = (requiredRoles: EmployeeRole[]): boolean => {
    if (!employee || !employee.roles || employee.roles.length === 0) return false;
    return requiredRoles.every(role => employee.roles!.includes(role));
  };

  /**
   * 檢查用戶是否可以訪問指定路由
   */
  const canAccessRoute = (routeRoles?: EmployeeRole[]): boolean => {
    // 如果路由沒有設定角色限制，則所有已登入用戶都可訪問
    if (!routeRoles || routeRoles.length === 0) return true;

    return hasRole(routeRoles);
  };

  /**
   * 獲取用戶當前角色列表
   */
  const getUserRoles = (): EmployeeRole[] => {
    return (employee?.roles as EmployeeRole[]) || [];
  };

  /**
   * 檢查是否為管理員
   */
  const isAdmin = (): boolean => {
    return hasRole([EmployeeRole.ADMIN]);
  };

  /**
   * 檢查是否為 HR（等同於管理員權限）
   */
  const isHR = (): boolean => {
    return hasRole([EmployeeRole.ADMIN]);
  };

  /**
   * 檢查是否為管理層（管理員、經理）
   */
  const isManager = (): boolean => {
    return hasRole([EmployeeRole.ADMIN, EmployeeRole.MANAGER]);
  };

  return {
    employee,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccessRoute,
    getUserRoles,
    isAdmin,
    isHR,
    isManager,
  };
};
