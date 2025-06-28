
import { User } from '@/contexts/user/types';
import { Staff } from '@/components/staff/types';
import { UnifiedPermissionContext } from './types';

export class PermissionChecker {
  /**
   * 內部權限檢查邏輯 - 基於 role 欄位
   */
  checkPermissionInternal(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const { currentUser, staffData, roles } = context;
    
    if (!currentUser) {
      console.log('🔐 權限檢查: 用戶未登入');
      return false;
    }

    // 廖俊雄擁有所有權限（特殊用戶例外）- 使用正確的 Supabase Auth UID
    if (this.isLiaoJunxiong(currentUser)) {
      console.log('🔐 廖俊雄權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 基本用戶權限：所有用戶都能查看自己的記錄和申請
    if (this.isBasicUserPermission(permission)) {
      console.log('🔐 基本用戶權限檢查:', currentUser.name, permission, '✅ 允許');
      return true;
    }

    // 檢查員工基於 role 的權限 (改回使用 role)
    if (staffData && this.checkStaffRolePermission(staffData, permission)) {
      console.log('🔐 員工 role 權限檢查:', staffData.name, 'role:', staffData.role, permission, '✅ 允許');
      return true;
    }

    // 檢查直接員工權限
    if (staffData?.permissions?.includes(permission)) {
      console.log('🔐 員工直接權限檢查:', staffData.name, permission, '✅ 允許');
      return true;
    }

    // 如果沒有員工資料，但是系統管理員，給予基本管理權限
    if (!staffData && this.isSystemAdmin(currentUser)) {
      console.log('🔐 系統管理員基本權限檢查:', currentUser.name, permission, '✅ 允許');
      return this.checkBasicAdminPermissions(permission);
    }

    console.log('🔐 權限檢查失敗:', currentUser.name, permission, '❌ 拒絕');
    return false;
  }

  /**
   * 檢查是否為廖俊雄 - 使用正確的 Supabase Auth UID
   */
  private isLiaoJunxiong(user: User): boolean {
    return (user.name === '廖俊雄' && 
            user.id === '0765138a-6f11-45f4-be07-dab965116a2d') ||
           user?.email === 'flpliao@gmail.com';
  }

  /**
   * 檢查是否為系統管理員
   */
  private isSystemAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * 檢查基本用戶權限（參照請假申請邏輯）
   */
  private isBasicUserPermission(permission: string): boolean {
    const basicPermissions = [
      // 加班基本權限
      'overtime:view_own',
      'overtime:create',
      // 忘記打卡基本權限
      'missed_checkin:view_own',
      'missed_checkin:create',
      // 請假基本權限
      'leave:view_own',
      'leave:create'
    ];
    
    return basicPermissions.includes(permission);
  }

  /**
   * 檢查員工基於 role 的權限（改回使用 role 而非 role_id）
   */
  private checkStaffRolePermission(
    staff: Staff, 
    permission: string
  ): boolean {
    if (!staff.role) {
      console.log('🔐 員工無 role:', staff.name);
      return false;
    }
    
    // 直接基於 role 字串進行權限檢查
    const hasPermission = this.checkRoleBasedPermissions(staff.role, permission);
    
    console.log('🔐 Role 權限檢查:', {
      staff: staff.name,
      role: staff.role,
      permission,
      hasPermission
    });
    
    return hasPermission;
  }

  /**
   * 基於 role 字串的權限檢查
   */
  private checkRoleBasedPermissions(role: string, permission: string): boolean {
    console.log('🔐 檢查 role 權限:', role, permission);
    
    // 管理員擁有所有權限
    if (role === 'admin') {
      return true;
    }
    
    // 管理者權限
    if (role === 'manager') {
      const managerPermissions = [
        // 基本權限
        'overtime:view_own', 'overtime:create',
        'missed_checkin:view_own', 'missed_checkin:create',
        'leave:view_own', 'leave:create',
        // 管理權限
        'overtime:view_all', 'overtime:approve',
        'missed_checkin:view_all', 'missed_checkin:approve',
        'leave:view_all', 'leave:approve',
        'staff:view'
      ];
      return managerPermissions.includes(permission);
    }
    
    // 一般用戶只有基本權限
    if (role === 'user') {
      const userPermissions = [
        'overtime:view_own', 'overtime:create',
        'missed_checkin:view_own', 'missed_checkin:create',
        'leave:view_own', 'leave:create'
      ];
      return userPermissions.includes(permission);
    }
    
    return false;
  }

  /**
   * 基本管理員權限檢查（當無員工資料時的後備方案）
   */
  private checkBasicAdminPermissions(permission: string): boolean {
    // 按照請假申請邏輯，給予完整的管理權限
    const basicAdminPermissions = [
      'system:manage',
      'system:settings_view',
      'system:settings_edit',
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:delete',
      // 加班管理權限
      'overtime:view_all',
      'overtime:view_own',
      'overtime:create',
      'overtime:approve',
      'overtime:manage',
      // 忘記打卡管理權限
      'missed_checkin:view_all',
      'missed_checkin:view_own',
      'missed_checkin:create',
      'missed_checkin:approve',
      'missed_checkin:manage',
      // 請假管理權限
      'leave:view_all',
      'leave:view_own',
      'leave:create',
      'leave:approve',
      'leave:manage'
    ];
    
    return basicAdminPermissions.includes(permission);
  }
}
