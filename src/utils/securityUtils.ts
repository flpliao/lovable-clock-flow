
/**
 * 安全工具函數
 */
import { securityService } from '@/services/securityService';

/**
 * 輸入驗證和清理
 */
export const validateInput = {
  /**
   * 清理用戶輸入
   */
  sanitize: (input: string): string => {
    return securityService.sanitizeInput(input);
  },

  /**
   * 檢查 SQL 注入
   */
  checkSQLInjection: (input: string): boolean => {
    return securityService.checkSQLInjection(input);
  },

  /**
   * 驗證電子郵件
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  /**
   * 驗證密碼強度
   */
  password: (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: '密碼至少需要 8 個字元' };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: '密碼需包含大小寫字母和數字' };
    }
    
    return { isValid: true, message: '密碼符合要求' };
  },

  /**
   * 驗證手機號碼
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 驗證統一編號
   */
  businessId: (id: string): boolean => {
    const businessIdRegex = /^\d{8}$/;
    return businessIdRegex.test(id);
  }
};

/**
 * 安全檢查工具
 */
export const securityCheck = {
  /**
   * 檢查是否為安全的 URL
   */
  isSecureUrl: (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.hostname === 'localhost';
    } catch {
      return false;
    }
  },

  /**
   * 檢查檔案類型是否允許
   */
  isAllowedFileType: (filename: string, allowedTypes: string[]): boolean => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  },

  /**
   * 檢查檔案大小是否符合限制
   */
  isAllowedFileSize: (fileSize: number, maxSize: number): boolean => {
    return fileSize <= maxSize;
  },

  /**
   * 生成安全的隨機字串
   */
  generateSecureToken: (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

/**
 * 資料掩碼工具
 */
export const dataMask = {
  /**
   * 掩碼電子郵件
   */
  email: (email: string): string => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    
    const maskedLocal = local.substring(0, 2) + '*'.repeat(local.length - 2);
    return `${maskedLocal}@${domain}`;
  },

  /**
   * 掩碼手機號碼
   */
  phone: (phone: string): string => {
    if (phone.length < 4) return phone;
    
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 3);
    const middle = '*'.repeat(phone.length - 6);
    
    return `${start}${middle}${end}`;
  },

  /**
   * 掩碼身分證字號
   */
  idCard: (id: string): string => {
    if (id.length < 4) return id;
    
    const start = id.substring(0, 2);
    const end = id.substring(id.length - 2);
    const middle = '*'.repeat(id.length - 4);
    
    return `${start}${middle}${end}`;
  }
};

/**
 * 日誌工具
 */
export const securityLog = {
  /**
   * 記錄登入嘗試
   */
  loginAttempt: async (success: boolean, details?: any) => {
    await securityService.logSecurityEvent(
      success ? 'login_success' : 'login_failed',
      details
    );
  },

  /**
   * 記錄權限檢查
   */
  permissionCheck: async (permission: string, granted: boolean, details?: any) => {
    await securityService.logSecurityEvent(
      granted ? 'permission_granted' : 'permission_denied',
      { permission, ...details }
    );
  },

  /**
   * 記錄資料存取
   */
  dataAccess: async (resource: string, action: string, success: boolean, details?: any) => {
    await securityService.logSecurityEvent(
      success ? 'data_access_success' : 'data_access_failed',
      { resource, action, ...details }
    );
  }
};
