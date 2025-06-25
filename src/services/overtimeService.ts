import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeService = {
  // 檢查並確保用戶認證狀態有效
  async ensureValidSession(): Promise<{ isValid: boolean; userId: string | null; error?: string }> {
    try {
      console.log('🔐 檢查 Supabase session 有效性...');
      
      // 獲取當前 session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session 檢查失敗:', sessionError);
        return { isValid: false, userId: null, error: `Session 檢查失敗: ${sessionError.message}` };
      }

      const userId = session?.user?.id;
      const isExpired = session?.expires_at ? (session.expires_at * 1000) < Date.now() : true;
      
      console.log('📋 Session 狀態檢查:', {
        hasSession: !!session,
        userId: userId || 'null',
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A',
        isExpired,
        currentTime: new Date().toLocaleString()
      });

      if (!session || !userId || isExpired) {
        const reason = !session ? '無 session' : !userId ? '無 user ID' : '已過期';
        console.warn(`⚠️ Session 無效: ${reason}`);
        return { isValid: false, userId: null, error: `登入狀態無效: ${reason}，請重新登入` };
      }

      // 驗證用戶在 staff 表中是否存在
      console.log('🔍 驗證員工資料存在性...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role, department')
        .eq('id', userId)
        .maybeSingle();

      if (staffError) {
        console.error('❌ 員工資料查詢失敗:', staffError);
        return { isValid: false, userId: null, error: `員工資料查詢失敗: ${staffError.message}` };
      }

      if (!staffData) {
        console.error('❌ 找不到對應的員工資料');
        return { isValid: false, userId: null, error: '找不到對應的員工資料，請聯絡系統管理員' };
      }

      console.log('✅ Session 和員工資料驗證通過:', staffData);
      return { isValid: true, userId, error: undefined };
      
    } catch (error: any) {
      console.error('❌ Session 驗證過程異常:', error);
      return { isValid: false, userId: null, error: `Session 驗證異常: ${error.message}` };
    }
  },

  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    console.log('🔍 開始獲取加班類型...');
    
    // 先檢查 session 有效性
    const sessionCheck = await this.ensureValidSession();
    if (!sessionCheck.isValid) {
      throw new Error(sessionCheck.error || '登入狀態無效');
    }
    
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('❌ 獲取加班類型失敗:', error);
      throw new Error(`獲取加班類型失敗: ${error.message}`);
    }
    
    console.log('✅ 成功獲取加班類型:', data?.length || 0, '筆');
    
    return (data || []).map(item => ({
      ...item,
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time',
      description: item.description || undefined,
      special_rules: (typeof item.special_rules === 'object' && item.special_rules !== null) 
        ? item.special_rules as Record<string, any>
        : {} as Record<string, any>
    }));
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    console.log('📝 開始提交加班申請...');
    console.log('📋 表單資料:', formData);

    try {
      // 驗證 session 有效性
      const sessionCheck = await this.ensureValidSession();
      if (!sessionCheck.isValid) {
        throw new Error(sessionCheck.error || '登入狀態無效，請重新登入');
      }

      const userId = sessionCheck.userId!;
      console.log('👤 使用認證用戶ID:', userId);

      // 驗證必填欄位
      const requiredFields = ['overtime_type', 'overtime_date', 'start_time', 'end_time', 'reason'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof OvertimeFormData]);
      
      if (missingFields.length > 0) {
        throw new Error(`必填欄位缺失: ${missingFields.join(', ')}`);
      }

      // 計算加班時數
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (hours <= 0) {
        throw new Error('結束時間必須晚於開始時間');
      }

      console.log('⏰ 計算加班時數:', hours, '小時');

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

      console.log('📤 準備插入的資料:', requestData);

      const { data, error } = await supabase
        .from('overtime_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('❌ 插入加班申請失敗:', error);
        throw new Error(`提交加班申請失敗: ${error.message}`);
      }

      console.log('✅ 加班申請提交成功:', data);

      // 創建通知
      try {
        await this.createOvertimeNotification(data.id, '加班申請已提交', '您的加班申請已提交，等待審核');
        console.log('✅ 通知創建成功');
      } catch (notificationError) {
        console.warn('⚠️ 通知創建失敗，但申請已成功提交:', notificationError);
      }

      return data.id;
    } catch (error) {
      console.error('❌ 提交加班申請過程中發生錯誤:', error);
      throw error;
    }
  },

  // 獲取用戶加班申請記錄
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    console.log('📋 開始獲取用戶加班申請...');
    
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const sessionCheck = await this.ensureValidSession();
        if (!sessionCheck.isValid) {
          throw new Error(sessionCheck.error || '登入狀態無效');
        }
        targetUserId = sessionCheck.userId!;
      }

      console.log('🔍 查詢用戶ID:', targetUserId);

      const { data, error } = await supabase
        .from('overtime_requests')
        .select('*')
        .or(`staff_id.eq.${targetUserId},user_id.eq.${targetUserId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢加班申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 成功獲取加班申請:', data?.length || 0, '筆');
      
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
      }));
    } catch (error) {
      console.error('❌ 獲取用戶加班申請失敗:', error);
      throw error;
    }
  },

  // 獲取待審核的加班申請 (新增方法)
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    console.log('🔍 開始獲取待審核加班申請...');
    
    try {
      // 驗證 session 有效性
      const sessionCheck = await this.ensureValidSession();
      if (!sessionCheck.isValid) {
        throw new Error(sessionCheck.error || '登入狀態無效');
      }

      console.log('🔍 查詢待審核加班申請...');

      const { data, error } = await supabase
        .from('overtime_requests')
        .select(`
          *,
          staff:staff_id(name, department)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢待審核加班申請失敗:', error);
        throw new Error(`查詢待審核加班申請失敗: ${error.message}`);
      }
      
      console.log('✅ 成功獲取待審核加班申請:', data?.length || 0, '筆');
      
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
      }));
    } catch (error) {
      console.error('❌ 獲取待審核加班申請失敗:', error);
      throw error;
    }
  },

  // 審核加班申請 (新增方法)
  async approveOvertimeRequest(
    requestId: string, 
    action: 'approve' | 'reject', 
    comment?: string
  ): Promise<void> {
    console.log(`📝 開始審核加班申請: ${action}`, { requestId, comment });

    try {
      // 驗證 session 有效性
      const sessionCheck = await this.ensureValidSession();
      if (!sessionCheck.isValid) {
        throw new Error(sessionCheck.error || '登入狀態無效，請重新登入');
      }

      const userId = sessionCheck.userId!;
      const status = action === 'approve' ? 'approved' : 'rejected';
      
      // 更新加班申請狀態
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (action === 'reject' && comment) {
        updateData.rejection_reason = comment;
      }

      const { data, error } = await supabase
        .from('overtime_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新加班申請狀態失敗:', error);
        throw new Error(`審核加班申請失敗: ${error.message}`);
      }

      console.log('✅ 加班申請狀態更新成功:', data);

      // 創建審核記錄
      try {
        const { error: recordError } = await supabase
          .from('overtime_approval_records')
          .insert({
            overtime_request_id: requestId,
            approver_id: userId,
            approver_name: '審核者', // 這裡可以從 staff 表獲取真實姓名
            level: 1,
            status: status === 'approved' ? 'approved' : 'rejected',
            approval_date: new Date().toISOString(),
            comment: comment || null
          });

        if (recordError) {
          console.warn('⚠️ 創建審核記錄失敗:', recordError);
        } else {
          console.log('✅ 審核記錄創建成功');
        }
      } catch (recordError) {
        console.warn('⚠️ 創建審核記錄過程異常:', recordError);
      }

      // 創建通知
      try {
        const notificationTitle = action === 'approve' ? '加班申請已核准' : '加班申請已拒絕';
        const notificationMessage = action === 'approve' 
          ? '您的加班申請已經核准' 
          : `您的加班申請已被拒絕${comment ? `：${comment}` : ''}`;

        await this.createOvertimeNotification(requestId, notificationTitle, notificationMessage);
        console.log('✅ 審核通知創建成功');
      } catch (notificationError) {
        console.warn('⚠️ 審核通知創建失敗:', notificationError);
      }

    } catch (error) {
      console.error('❌ 審核加班申請過程中發生錯誤:', error);
      throw error;
    }
  },

  // 創建通知
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
