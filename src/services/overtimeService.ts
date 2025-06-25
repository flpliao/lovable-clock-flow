
import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    console.log('🔍 開始獲取加班類型...');
    
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('❌ 獲取加班類型失敗:', error);
      throw error;
    }
    
    console.log('✅ 成功獲取加班類型:', data?.length || 0, '筆');
    
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

  // 驗證用戶認證狀態
  async validateUserAuth(): Promise<{ userId: string; isAuthenticated: boolean }> {
    console.log('🔐 驗證用戶認證狀態...');
    
    try {
      // 檢查 Supabase session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ 獲取 session 失敗:', sessionError);
        return { userId: '', isAuthenticated: false };
      }

      const session = sessionData?.session;
      const userId = session?.user?.id;
      
      console.log('📋 Session 狀態:', {
        hasSession: !!session,
        userId: userId || 'undefined',
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
      });

      if (!session || !userId) {
        console.warn('⚠️ 用戶未登入或 session 無效');
        return { userId: '', isAuthenticated: false };
      }

      // 驗證用戶是否存在於 staff 表格中
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role, department')
        .eq('id', userId)
        .maybeSingle();

      if (staffError) {
        console.error('❌ 查詢員工資料失敗:', staffError);
        throw new Error(`查詢員工資料失敗: ${staffError.message}`);
      }

      if (!staffData) {
        console.error('❌ 找不到對應的員工資料，用戶ID:', userId);
        throw new Error('找不到對應的員工資料，請聯絡系統管理員');
      }

      console.log('✅ 用戶認證成功:', {
        userId,
        name: staffData.name,
        role: staffData.role,
        department: staffData.department
      });

      return { userId, isAuthenticated: true };
    } catch (error) {
      console.error('❌ 用戶認證驗證失敗:', error);
      throw error;
    }
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    console.log('📝 開始提交加班申請...');
    console.log('📋 表單資料:', formData);

    try {
      // 驗證用戶認證
      const { userId, isAuthenticated } = await this.validateUserAuth();
      
      if (!isAuthenticated) {
        throw new Error('用戶未登入，請重新登入後再試');
      }

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
        user_id: userId, // 同時設定兩個欄位以確保相容性
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
        console.error('❌ 錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
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

  // 獲取用戶的加班申請
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    console.log('📋 開始獲取用戶加班申請...');
    
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { userId: authUserId, isAuthenticated } = await this.validateUserAuth();
        if (!isAuthenticated) {
          throw new Error('用戶未登入');
        }
        targetUserId = authUserId;
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
      
      // 添加類型轉換確保類型安全
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
      }));
    } catch (error) {
      console.error('❌ 獲取用戶加班申請失敗:', error);
      throw error;
    }
  },

  // 獲取待審核的加班申請
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    console.log('📋 開始獲取待審核加班申請...');
    
    try {
      const { userId, isAuthenticated } = await this.validateUserAuth();
      
      if (!isAuthenticated) {
        throw new Error('用戶未登入');
      }

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
        .or(`current_approver.eq.${userId},staff_id.in.(select id from staff where supervisor_id = '${userId}')`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢待審核加班申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 成功獲取待審核加班申請:', data?.length || 0, '筆');
      
      // 添加類型轉換確保類型安全
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
      }));
    } catch (error) {
      console.error('❌ 獲取待審核加班申請失敗:', error);
      throw error;
    }
  },

  // 審核加班申請
  async approveOvertimeRequest(requestId: string, action: 'approve' | 'reject', comment?: string): Promise<void> {
    console.log('📋 開始審核加班申請:', { requestId, action, comment });
    
    try {
      const { userId, isAuthenticated } = await this.validateUserAuth();
      
      if (!isAuthenticated) {
        throw new Error('用戶未登入');
      }

      const status = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('overtime_requests')
        .update({ 
          status,
          rejection_reason: action === 'reject' ? comment : null
        })
        .eq('id', requestId);

      if (error) {
        console.error('❌ 審核加班申請失敗:', error);
        throw error;
      }

      // 創建審核記錄
      await supabase
        .from('overtime_approval_records')
        .insert({
          overtime_request_id: requestId,
          approver_id: userId,
          approver_name: '審核人', // 實際應該從用戶資料獲取
          level: 1,
          status: action === 'approve' ? 'approved' : 'rejected',
          approval_date: new Date().toISOString(),
          comment
        });

      // 發送通知
      const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
      await this.createOvertimeNotification(requestId, '加班申請審核結果', message);
      
      console.log('✅ 加班申請審核完成');
    } catch (error) {
      console.error('❌ 審核加班申請失敗:', error);
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
