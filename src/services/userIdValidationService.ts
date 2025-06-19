
export class UserIdValidationService {
  /**
   * 驗證並標準化用戶 ID
   * @param userId 輸入的用戶 ID
   * @returns 標準化的 UUID 格式用戶 ID
   */
  static validateUserId(userId: string): string {
    console.log('🔍 驗證用戶 ID:', userId);
    
    // 檢查是否為有效的 UUID 格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(userId)) {
      console.log('✅ 用戶 ID 格式有效:', userId);
      return userId;
    }
    
    // 如果不是有效的 UUID，生成一個新的
    console.warn('⚠️ 用戶 ID 格式無效，生成新的 UUID');
    return this.generateValidUUID();
  }
  
  /**
   * 生成有效的 UUID
   * @returns 新的 UUID 字符串
   */
  private static generateValidUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * 檢查用戶是否為管理員
   * @param userId 用戶 ID
   * @returns 是否為管理員
   */
  static isAdminUser(userId: string): boolean {
    // 廖俊雄的管理員 ID
    const adminId = '550e8400-e29b-41d4-a716-446655440001';
    return userId === adminId;
  }
}
