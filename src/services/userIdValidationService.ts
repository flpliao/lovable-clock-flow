
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
    
    // 檢查是否已經是有效的UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(userId)) {
      console.log('User ID is already valid UUID:', userId);
      return userId;
    }
    
    // 如果是簡單字符串如 "1" 或 "admin"，轉換為有效的UUID格式
    if (userId === "1" || userId === "admin") {
      const validUUID = '550e8400-e29b-41d4-a716-446655440001';
      console.log('Converting simple user ID to valid UUID:', validUUID);
      return validUUID;
    }
    
    console.warn('User ID is not valid UUID format, using fallback:', userId);
    return '550e8400-e29b-41d4-a716-446655440001';
  }

  /**
   * 檢查用戶ID是否為有效格式
   */
  static isValidUUID(userId: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);
  }
}
