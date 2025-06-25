
import { supabase } from '@/integrations/supabase/client';
import { overtimeApiService } from './overtimeApiService';

export const overtimeValidationService = {
  // 獲取當前用戶ID
  async getCurrentUserId(): Promise<string> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ 無法獲取當前用戶:', authError);
      // 如果無法獲取當前用戶，使用預設ID作為後備方案
      const fallbackUserId = '550e8400-e29b-41d4-a716-446655440001';
      console.log('⚠️ 使用預設用戶ID作為後備方案:', fallbackUserId);
      return fallbackUserId;
    } else {
      console.log('✅ 使用實際登入用戶ID:', user.id);
      return user.id;
    }
  },

  // 檢查用戶是否可以自動核准
  async checkAutoApprovalEligibility(userId: string): Promise<boolean> {
    console.log('🔍 開始檢查加班申請自動核准條件...');
    console.log('👤 當前用戶ID:', userId);
    
    // 只有廖俊雄（系統最高管理員）才能自動核准
    const isSystemAdmin = userId === '550e8400-e29b-41d4-a716-446655440001';
    
    if (!isSystemAdmin) {
      console.log('❌ 非系統最高管理員，無法自動核准');
      return false;
    }
    
    // 檢查當前用戶的詳細資訊
    const currentUser = await overtimeApiService.getStaffInfo(userId);
    
    console.log('👤 用戶詳細資訊:', {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
      role_id: currentUser.role_id,
      department: currentUser.department,
      position: currentUser.position
    });

    const isManagerRole = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager');
    console.log('🔐 角色權限檢查:', {
      role: currentUser?.role,
      isManagerRole: isManagerRole,
      判定結果: isManagerRole ? '✅ 符合管理者角色' : '❌ 非管理者角色'
    });

    // 如果是管理者角色，再檢查是否有實際下屬
    let hasSubordinates = false;
    let subordinatesList = [];
    
    if (isManagerRole) {
      console.log('🔍 檢查下屬關係...');
      subordinatesList = await overtimeApiService.getSubordinates(userId);
      hasSubordinates = subordinatesList.length > 0;
      
      console.log('👥 下屬關係檢查:', {
        下屬數量: subordinatesList.length,
        hasSubordinates: hasSubordinates,
        判定結果: hasSubordinates ? '✅ 有下屬' : '❌ 無下屬'
      });
      
      if (subordinatesList.length > 0) {
        console.log('📋 下屬名單:', subordinatesList.map(s => ({
          姓名: s.name,
          職位: s.position,
          部門: s.department
        })));
      }
    } else {
      console.log('⏭️ 非管理者角色，跳過下屬檢查');
    }

    // 只有系統最高管理員且同時滿足管理者角色且有下屬的用戶才能自動核准
    const canAutoApprove = isSystemAdmin && isManagerRole && hasSubordinates;

    console.log('📊 最終審核結果判定:', {
      userId: userId,
      userName: currentUser?.name,
      role: currentUser?.role,
      isSystemAdmin: isSystemAdmin,
      isManagerRole: isManagerRole,
      hasSubordinates: hasSubordinates,
      canAutoApprove: canAutoApprove,
      結論: canAutoApprove ? '🎉 自動核准' : '⏳ 需要審核'
    });

    return canAutoApprove;
  },

  // 計算加班時數
  calculateOvertimeHours(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
};
