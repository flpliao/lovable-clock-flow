import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    console.log('🔍 開始獲取加班類型');
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('❌ 獲取加班類型失敗:', error);
      throw error;
    }
    
    console.log('✅ 獲取加班類型成功:', data);
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time',
      description: item.description || undefined,
      special_rules: (typeof item.special_rules === 'object' && item.special_rules !== null) 
        ? item.special_rules as Record<string, any>
        : {} as Record<string, any>
    }));
  },

  // 檢查用戶認證狀態
  async checkUserAuthentication(): Promise<{ isAuthenticated: boolean; user: any; session: any }> {
    console.log('🔐 檢查用戶認證狀態...');
    
    try {
      // 檢查 session 狀態
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ 獲取 session 失敗:', sessionError);
        return { isAuthenticated: false, user: null, session: null };
      }
      
      console.log('📋 Session 狀態:', {
        hasSession: !!sessionData?.session,
        hasUser: !!sessionData?.session?.user,
        userId: sessionData?.session?.user?.id,
        sessionExpiry: sessionData?.session?.expires_at
      });
      
      // 檢查 user 狀態
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ 獲取用戶資料失敗:', userError);
        return { isAuthenticated: false, user: null, session: sessionData?.session };
      }
      
      const isAuthenticated = !!(sessionData?.session && userData?.user);
      
      console.log('🔐 認證檢查結果:', {
        isAuthenticated,
        sessionExists: !!sessionData?.session,
        userExists: !!userData?.user,
        userId: userData?.user?.id
      });
      
      return {
        isAuthenticated,
        user: userData?.user,
        session: sessionData?.session
      };
    } catch (error) {
      console.error('❌ 認證檢查過程中發生錯誤:', error);
      return { isAuthenticated: false, user: null, session: null };
    }
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    console.log('🔍 開始提交加班申請，表單數據:', formData);
    
    // 首先檢查用戶認證狀態
    const authStatus = await this.checkUserAuthentication();
    
    if (!authStatus.isAuthenticated) {
      console.error('❌ 用戶未正確登入或 session 已過期');
      console.error('認證狀態詳情:', authStatus);
      throw new Error('用戶未登入或登入狀態已過期，請重新登入');
    }
    
    const userId = authStatus.user.id;
    console.log('✅ 用戶認證通過，用戶ID:', userId);

    // 驗證必要欄位
    const validationErrors = [];
    if (!formData.overtime_type) validationErrors.push('加班類型');
    if (!formData.overtime_date) validationErrors.push('加班日期');
    if (!formData.start_time) validationErrors.push('開始時間');
    if (!formData.end_time) validationErrors.push('結束時間');
    if (!formData.reason?.trim()) validationErrors.push('加班原因');

    if (validationErrors.length > 0) {
      const errorMessage = `請填寫以下必填欄位: ${validationErrors.join('、')}`;
      console.error('❌ 表單驗證失敗:', errorMessage);
      throw new Error(errorMessage);
    }

    // 計算加班時數
    const startTime = new Date(`2000-01-01T${formData.start_time}`);
    const endTime = new Date(`2000-01-01T${formData.end_time}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (hours <= 0) {
      console.error('❌ 結束時間必須大於開始時間');
      throw new Error('結束時間必須大於開始時間');
    }

    console.log('✅ 計算加班時數:', hours);

    const requestData = {
      staff_id: userId,
      user_id: userId,
      overtime_type: formData.overtime_type,
      overtime_date: formData.overtime_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours,
      reason: formData.reason,
      status: 'pending' as const,
      approval_level: 1
    };

    console.log('🚀 準備插入資料庫的數據:', requestData);
    console.log('🔐 當前認證狀態:', {
      userId,
      sessionValid: !!authStatus.session,
      userValid: !!authStatus.user
    });

    try {
      const { data, error } = await supabase
        .from('overtime_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('❌ 插入資料庫失敗:', error);
        console.error('錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // 特別處理 RLS 相關錯誤
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          throw new Error('權限不足：無法創建加班申請。請確認您已正確登入且具備相關權限。');
        }
        
        throw new Error(`加班申請提交失敗: ${error.message}`);
      }

      console.log('✅ 資料庫插入成功:', data);

      // 創建通知
      try {
        await this.createOvertimeNotification(data.id, '加班申請已提交', '您的加班申請已提交，等待審核');
        console.log('✅ 通知創建成功');
      } catch (notificationError) {
        console.warn('⚠️ 通知創建失敗，但加班申請已成功提交:', notificationError);
      }

      return data.id;
    } catch (dbError) {
      console.error('❌ 資料庫操作失敗:', dbError);
      throw dbError;
    }
  },

  async getUserOvertimeRequests(userId: string): Promise<OvertimeRequest[]> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .select('*')
      .or(`staff_id.eq.${userId},user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('用戶未登入');

    const { data, error } = await supabase
      .from('overtime_requests')
      .select(`
        *,
        staff:staff_id (
          name,
          department,
          position
        )
      `)
      .eq('status', 'pending')
      .or(`current_approver.eq.${userData.user.id},staff_id.in.(select id from staff where supervisor_id = '${userData.user.id}')`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  async approveOvertimeRequest(requestId: string, action: 'approve' | 'reject', comment?: string): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('用戶未登入');

    const status = action === 'approve' ? 'approved' : 'rejected';
    
    const { error } = await supabase
      .from('overtime_requests')
      .update({ 
        status,
        rejection_reason: action === 'reject' ? comment : null
      })
      .eq('id', requestId);

    if (error) throw error;

    await supabase
      .from('overtime_approval_records')
      .insert({
        overtime_request_id: requestId,
        approver_id: userData.user.id,
        approver_name: '審核人',
        level: 1,
        status: action === 'approve' ? 'approved' : 'rejected',
        approval_date: new Date().toISOString(),
        comment
      });

    const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
    await this.createOvertimeNotification(requestId, '加班申請審核結果', message);
  },

  async createOvertimeNotification(requestId: string, title: string, message: string): Promise<void> {
    try {
      const { data: request } = await supabase
        .from('overtime_requests')
        .select('staff_id, user_id')
        .eq('id', requestId)
        .single();

      if (request) {
        const userId = request.staff_id || request.user_id;
        if (userId) {
          await supabase.rpc('create_overtime_notification', {
            p_user_id: userId,
            p_title: title,
            p_message: message,
            p_overtime_request_id: requestId
          });
        }
      }
    } catch (error) {
      console.error('創建通知失敗:', error);
    }
  }
};
