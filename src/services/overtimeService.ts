import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
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

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    console.log('🔍 開始提交加班申請，原始表單資料:', formData);

    try {
      // 1️⃣ 嚴格驗證必填欄位
      const validationErrors: string[] = [];
      
      if (!formData.overtime_type || formData.overtime_type.trim() === '') {
        validationErrors.push('加班類型不能為空');
      }
      
      if (!formData.overtime_date) {
        validationErrors.push('加班日期不能為空');
      }
      
      if (!formData.start_time || formData.start_time.trim() === '') {
        validationErrors.push('開始時間不能為空');
      }
      
      if (!formData.end_time || formData.end_time.trim() === '') {
        validationErrors.push('結束時間不能為空');
      }
      
      if (!formData.reason || formData.reason.trim() === '') {
        validationErrors.push('加班原因不能為空');
      }

      if (validationErrors.length > 0) {
        console.error('❌ 表單驗證失敗:', validationErrors);
        throw new Error(`表單驗證失敗: ${validationErrors.join(', ')}`);
      }

      console.log('✅ 基本欄位驗證通過');

      // 2️⃣ 驗證時間格式和邏輯
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      
      if (!timePattern.test(formData.start_time)) {
        console.error('❌ 開始時間格式錯誤:', formData.start_time);
        throw new Error('開始時間格式錯誤，請使用 HH:MM 格式');
      }
      
      if (!timePattern.test(formData.end_time)) {
        console.error('❌ 結束時間格式錯誤:', formData.end_time);
        throw new Error('結束時間格式錯誤，請使用 HH:MM 格式');
      }

      // 創建用於比較的時間對象
      const startTime = new Date(`2000-01-01T${formData.start_time}:00`);
      const endTime = new Date(`2000-01-01T${formData.end_time}:00`);
      
      console.log('⏰ 時間驗證詳細信息:', {
        原始開始時間: formData.start_time,
        原始結束時間: formData.end_time,
        解析開始時間: startTime.toISOString(),
        解析結束時間: endTime.toISOString(),
        開始時間毫秒: startTime.getTime(),
        結束時間毫秒: endTime.getTime()
      });

      if (startTime >= endTime) {
        console.error('❌ 時間邏輯錯誤: 開始時間必須早於結束時間');
        throw new Error('開始時間必須早於結束時間');
      }

      // 計算加班時數
      const timeDiffMs = endTime.getTime() - startTime.getTime();
      const hours = timeDiffMs / (1000 * 60 * 60);
      
      console.log('📊 時數計算:', {
        時間差毫秒: timeDiffMs,
        計算小時數: hours,
        四捨五入小時數: Number(hours.toFixed(2))
      });

      if (hours <= 0) {
        console.error('❌ 計算出的加班時數無效:', hours);
        throw new Error('加班時數計算錯誤，請檢查時間設定');
      }

      if (hours > 12) {
        console.error('❌ 加班時數過長:', hours);
        throw new Error('單日加班時數不能超過12小時');
      }

      console.log('✅ 時間驗證和計算完成，加班時數:', hours);

      // 3️⃣ 準備插入資料
      const defaultUserId = '550e8400-e29b-41d4-a716-446655440001';
      
      // UUID 格式驗證
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(defaultUserId)) {
        console.error('❌ 預設用戶ID格式錯誤:', defaultUserId);
        throw new Error('系統用戶ID格式錯誤');
      }

      const requestData = {
        staff_id: defaultUserId,
        user_id: defaultUserId,
        overtime_type: formData.overtime_type.trim(),
        overtime_date: formData.overtime_date,
        start_time: formData.start_time.trim(),
        end_time: formData.end_time.trim(),
        hours: Number(hours.toFixed(2)),
        reason: formData.reason.trim(),
        status: 'pending' as const,
        approval_level: 1
      };

      console.log('📝 準備插入的完整資料:', requestData);
      console.log('📝 資料類型檢查:', {
        staff_id_type: typeof requestData.staff_id,
        user_id_type: typeof requestData.user_id,
        overtime_type_type: typeof requestData.overtime_type,
        overtime_date_type: typeof requestData.overtime_date,
        start_time_type: typeof requestData.start_time,
        end_time_type: typeof requestData.end_time,
        hours_type: typeof requestData.hours,
        hours_value: requestData.hours,
        reason_type: typeof requestData.reason,
        status_type: typeof requestData.status,
        approval_level_type: typeof requestData.approval_level
      });

      // 4️⃣ 執行資料庫插入
      console.log('💾 開始插入到 overtime_requests 表...');
      
      const { data, error } = await supabase
        .from('overtime_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('❌ 資料庫插入失敗，完整錯誤詳情:', {
          錯誤碼: error.code,
          錯誤訊息: error.message,
          錯誤詳情: error.details,
          錯誤提示: error.hint,
          插入資料: requestData,
          表格名稱: 'overtime_requests'
        });
        
        // 根據錯誤碼提供具體的錯誤訊息
        let errorMessage = '資料庫插入失敗';
        
        switch (error.code) {
          case '23502':
            errorMessage = `必填欄位缺失: ${error.message}`;
            break;
          case '23503':
            errorMessage = `外鍵約束錯誤: ${error.message}`;
            break;
          case '22P02':
            errorMessage = `資料格式錯誤: ${error.message}`;
            break;
          case '23514':
            errorMessage = `檢查約束失敗: ${error.message}`;
            break;
          case '42703':
            errorMessage = `欄位不存在: ${error.message}`;
            break;
          case '42P01':
            errorMessage = `表格不存在: ${error.message}`;
            break;
          default:
            errorMessage = `資料庫錯誤 (${error.code}): ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      if (!data) {
        console.error('❌ 資料庫插入成功但未返回資料');
        throw new Error('資料庫插入異常：未返回插入的資料');
      }

      console.log('✅ 加班申請插入成功:', data);

      // 5️⃣ 創建審核記錄
      try {
        console.log('📋 開始創建審核記錄...');
        
        const approvalRecordData = {
          overtime_request_id: data.id,
          approver_name: '系統管理員',
          level: 1,
          status: 'pending' as const,
          comment: '待審核'
        };

        console.log('📋 審核記錄資料:', approvalRecordData);

        const { error: approvalError } = await supabase
          .from('overtime_approval_records')
          .insert(approvalRecordData);

        if (approvalError) {
          console.error('⚠️ 創建審核記錄失敗，但主申請已成功:', approvalError);
          // 不拋出錯誤，因為主要申請已成功
        } else {
          console.log('✅ 審核記錄創建成功');
        }
      } catch (approvalRecordError) {
        console.error('⚠️ 審核記錄處理異常:', approvalRecordError);
        // 不影響主流程
      }

      // 6️⃣ 創建通知
      try {
        console.log('🔔 開始創建通知...');
        await this.createOvertimeNotification(data.id, '加班申請已提交', '您的加班申請已提交，等待審核');
        console.log('✅ 通知創建成功');
      } catch (notificationError) {
        console.error('⚠️ 通知創建失敗，但申請已提交:', notificationError);
        // 不影響主流程
      }

      console.log('🎉 加班申請流程完成！申請ID:', data.id);
      return data.id;

    } catch (error) {
      console.error('💥 提交加班申請時發生錯誤:', error);
      
      if (error instanceof Error) {
        console.error('💥 錯誤詳情:', {
          名稱: error.name,
          訊息: error.message,
          堆疊: error.stack
        });
        throw new Error(`提交加班申請失敗: ${error.message}`);
      } else {
        console.error('💥 未知錯誤類型:', typeof error, error);
        throw new Error('提交加班申請時發生未知錯誤');
      }
    }
  },

  // 獲取用戶的加班申請
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    let query = supabase
      .from('overtime_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`staff_id.eq.${userId},user_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 獲取待審核的加班申請
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
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
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 審核加班申請
  async approveOvertimeRequest(requestId: string, action: 'approve' | 'reject', comment?: string): Promise<void> {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    const { error } = await supabase
      .from('overtime_requests')
      .update({ 
        status,
        rejection_reason: action === 'reject' ? comment : null
      })
      .eq('id', requestId);

    if (error) throw error;

    // 創建審核記錄
    await supabase
      .from('overtime_approval_records')
      .insert({
        overtime_request_id: requestId,
        approver_name: '系統管理員', // 提供預設審核人名稱
        level: 1,
        status: action === 'approve' ? 'approved' : 'rejected',
        approval_date: new Date().toISOString(),
        comment
      });

    // 發送通知
    const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
    await this.createOvertimeNotification(requestId, '加班申請審核結果', message);
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
