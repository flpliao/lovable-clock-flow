import { supabase } from '@/integrations/supabase/client';

export const overtimeNotificationService = {
  // 創建加班通知
  async createOvertimeNotification(
    requestId: string, 
    title: string, 
    message: string,
    userId?: string
  ): Promise<void> {
    try {
      console.log('📢 創建加班通知:', { requestId, title, message, userId });
      
      // 如果沒有指定用戶ID，獲取當前用戶ID
      let targetUserId = userId;
      if (!targetUserId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('❌ 無法獲取當前用戶:', authError);
          return;
        }
        targetUserId = user.id;
      }

      const { error } = await supabase.rpc('create_notification', {
        p_user_id: targetUserId,
        p_title: title,
        p_message: message,
        p_type: 'overtime_status',
        p_action_required: false
      });

      if (error) {
        console.error('❌ 創建加班通知失敗:', error);
        throw error;
      }
      
      console.log('✅ 加班通知創建成功');
    } catch (error) {
      console.error('❌ createOvertimeNotification 失敗:', error);
      // 不拋出錯誤，避免影響主要流程
    }
  }
};
