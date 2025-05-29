
/**
 * 統一的用戶ID驗證服務
 * 用於確保所有服務使用相同的驗證邏輯
 */
export class UserIdValidationService {
  /**
   * 驗證並格式化用戶ID，確保其為有效的UUID格式
   */
  static validateUserId(userId: string): string {
    console.log('Validating user ID:', userId);
    
    // 如果是空字符串或null/undefined，返回預設UUID
    if (!userId || userId.trim() === '') {
      console.log('Empty userId provided, using fallback UUID');
      return '550e8400-e29b-41d4-a716-446655440001';
    }
    
    // 檢查是否已經是有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(userId)) {
      console.log('User ID is already valid UUID:', userId);
      return userId;
    }
    
    // 如果是簡單字符串如 "1" 或 "admin"，轉換為對應的有效UUID
    if (userId === "1" || userId === "admin") {
      const validUUID = '550e8400-e29b-41d4-a716-446655440001';
      console.log('Converting simple user ID to admin UUID:', validUUID);
      return validUUID;
    }
    
    if (userId === "2" || userId === "flpliao") {
      const validUUID = '550e8400-e29b-41d4-a716-446655440002';
      console.log('Converting simple user ID to user UUID:', validUUID);
      return validUUID;
    }
    
    console.warn('User ID is not valid UUID format, using fallback:', userId);
    return '550e8400-e29b-41d4-a716-446655440001';
  }

  /**
   * 檢查用戶ID是否為有效格式
   */
  static isValidUUID(userId: string): boolean {
    if (!userId) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);
  }

  /**
   * 檢查是否為管理員用戶
   */
  static isAdminUser(userId: string): boolean {
    const validatedId = this.validateUserId(userId);
    return validatedId === '550e8400-e29b-41d4-a716-446655440001';
  }
}
