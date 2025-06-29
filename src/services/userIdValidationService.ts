
/**
 * 用戶 ID 驗證服務 - 更新為使用正確的 UUID
 */
export class UserIdValidationService {
  private static readonly SUPER_ADMIN_UUID = '0765138a-6f11-45f4-be07-dab965116a2d';
  
  /**
   * 驗證用戶 ID 是否有效
   */
  static validateUserId(userId: string): string | null {
    if (!userId) {
      console.warn('⚠️ 用戶 ID 為空');
      return null;
    }

    // 驗證 UUID 格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.warn('⚠️ 無效的 UUID 格式:', userId);
      return null;
    }

    console.log('✅ 用戶 ID 驗證通過:', userId);
    return userId;
  }

  /**
   * 檢查是否為超級管理員
   */
  static isSuperAdmin(userId: string): boolean {
    return userId === this.SUPER_ADMIN_UUID;
  }

  /**
   * 獲取超級管理員 UUID
   */
  static getSuperAdminUUID(): string {
    return this.SUPER_ADMIN_UUID;
  }
}
