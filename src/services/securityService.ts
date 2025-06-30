
/**
 * 統一安全服務
 * 處理身份驗證、授權和安全檢查
 */
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export class SecurityService {
  private static instance: SecurityService;
  private readonly SUPER_ADMIN_ID = '0765138a-6f11-45f4-be07-dab965116a2d';

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  /**
   * 檢查當前用戶是否為超級管理員
   */
  async isSuperAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id === this.SUPER_ADMIN_ID;
    } catch (error) {
      console.error('檢查超級管理員權限失敗:', error);
      return false;
    }
  }

  /**
   * 檢查當前用戶是否為管理員
   */
  async isAdmin(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_current_user_admin_safe');
      
      if (error) {
        console.error('檢查管理員權限失敗:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('檢查管理員權限系統錯誤:', error);
      return false;
    }
  }

  /**
   * 檢查當前用戶是否為主管
   */
  async isManager(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_current_user_manager');
      
      if (error) {
        console.error('檢查主管權限失敗:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('檢查主管權限系統錯誤:', error);
      return false;
    }
  }

  /**
   * 驗證用戶身份
   */
  async validateUser(): Promise<{
    isValid: boolean;
    user: any;
    role: string;
  }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { isValid: false, user: null, role: 'guest' };
      }

      // 獲取用戶角色
      const { data: userData } = await supabase
        .from('staff')
        .select('role, name, department')
        .eq('user_id', user.id)
        .single();

      return {
        isValid: true,
        user: userData,
        role: userData?.role || 'user'
      };
    } catch (error) {
      console.error('驗證用戶身份失敗:', error);
      return { isValid: false, user: null, role: 'guest' };
    }
  }

  /**
   * 檢查資料存取權限
   */
  async checkDataAccess(resource: string, action: string): Promise<boolean> {
    try {
      const validation = await this.validateUser();
      
      if (!validation.isValid) {
        return false;
      }

      // 超級管理員擁有所有權限
      if (await this.isSuperAdmin()) {
        return true;
      }

      // 管理員權限檢查
      if (validation.role === 'admin') {
        return true;
      }

      // 基於資源和操作的權限檢查
      return this.checkResourcePermission(resource, action, validation.role);
    } catch (error) {
      console.error('檢查資料存取權限失敗:', error);
      return false;
    }
  }

  /**
   * 檢查資源權限
   */
  private checkResourcePermission(resource: string, action: string, role: string): boolean {
    const permissions = {
      'staff': {
        'view': ['admin', 'manager', 'user'],
        'create': ['admin'],
        'edit': ['admin', 'manager'],
        'delete': ['admin']
      },
      'leave': {
        'view': ['admin', 'manager', 'user'],
        'create': ['admin', 'manager', 'user'],
        'approve': ['admin', 'manager'],
        'edit': ['admin']
      },
      'overtime': {
        'view': ['admin', 'manager', 'user'],
        'create': ['admin', 'manager', 'user'],
        'approve': ['admin', 'manager'],
        'edit': ['admin']
      },
      'announcement': {
        'view': ['admin', 'manager', 'user'],
        'create': ['admin'],
        'edit': ['admin'],
        'delete': ['admin']
      }
    };

    const resourcePermissions = permissions[resource as keyof typeof permissions];
    if (!resourcePermissions) {
      return false;
    }

    const actionPermissions = resourcePermissions[action as keyof typeof resourcePermissions];
    return actionPermissions ? actionPermissions.includes(role) : false;
  }

  /**
   * 輸入驗證
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // 移除潛在的 HTML 標籤
      .replace(/javascript:/gi, '') // 移除 JavaScript 協議
      .replace(/on\w+=/gi, '') // 移除事件處理器
      .substring(0, 1000); // 限制長度
  }

  /**
   * 檢查 SQL 注入模式
   */
  checkSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|")/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * 生成安全日誌
   */
  async logSecurityEvent(event: string, details?: any): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log(`🔒 安全事件: ${event}`, {
        user_id: user?.id,
        timestamp: new Date().toISOString(),
        details
      });

      // 這裡可以將安全事件記錄到資料庫
      // 暫時只記錄到 console
    } catch (error) {
      console.error('記錄安全事件失敗:', error);
    }
  }
}

export const securityService = SecurityService.getInstance();
