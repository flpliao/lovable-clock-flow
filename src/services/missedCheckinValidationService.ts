import { supabase } from '@/integrations/supabase/client';

export interface MissedCheckinValidationResult {
  canSubmit: boolean;
  errorMessage?: string;
  existingRequest?: {
    id: string;
    status: string;
    created_at: string;
  };
}

/**
 * 檢查是否可以提交忘打卡申請
 * 防止重複提交：同一用戶在同一日期、同一類型的忘打卡申請
 * - 如果已有審核中(pending)或已核准(approved)的申請，則不允許重複提交
 * - 如果已拒絕(rejected)，則允許重新提交
 */
export class MissedCheckinValidationService {
  static async checkDuplicateRequest(
    staffId: string,
    requestDate: string,
    missedType: 'check_in' | 'check_out'
  ): Promise<MissedCheckinValidationResult> {
    try {
      console.log('🔍 檢查忘打卡重複申請:', {
        staffId,
        requestDate,
        missedType,
      });

      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select('id, status, created_at, missed_type')
        .eq('staff_id', staffId)
        .eq('request_date', requestDate)
        .eq('missed_type', missedType)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ 檢查忘打卡重複申請時發生錯誤:', error);
        throw error;
      }

      // 如果沒有找到任何記錄，可以提交
      if (!data || data.length === 0) {
        console.log('✅ 沒有找到重複申請，可以提交');
        return {
          canSubmit: true,
        };
      }

      const existingRequest = data[0];
      console.log('📋 找到現有申請:', existingRequest);

      // 檢查申請狀態
      switch (existingRequest.status) {
        case 'pending':
          return {
            canSubmit: false,
            errorMessage: `您在 ${requestDate} 已有審核中的${this.getMissedTypeText(missedType)}申請，請等待審核完成`,
            existingRequest: {
              id: existingRequest.id,
              status: existingRequest.status,
              created_at: existingRequest.created_at,
            },
          };

        case 'approved':
          return {
            canSubmit: false,
            errorMessage: `您在 ${requestDate} 已有核准的${this.getMissedTypeText(missedType)}申請，無法重複提交`,
            existingRequest: {
              id: existingRequest.id,
              status: existingRequest.status,
              created_at: existingRequest.created_at,
            },
          };

        case 'rejected':
          console.log('✅ 先前申請已被拒絕，可以重新提交');
          return {
            canSubmit: true,
          };

        default:
          console.log('⚠️ 未知申請狀態，允許提交');
          return {
            canSubmit: true,
          };
      }
    } catch (error) {
      console.error('💥 檢查忘打卡重複申請時發生錯誤:', error);
      return {
        canSubmit: false,
        errorMessage: '檢查申請狀態時發生錯誤，請稍後重試',
      };
    }
  }

  /**
   * 獲取忘打卡類型文字
   */
  private static getMissedTypeText(type: 'check_in' | 'check_out'): string {
    switch (type) {
      case 'check_in':
        return '忘記上班打卡';
      case 'check_out':
        return '忘記下班打卡';
      default:
        return type;
    }
  }

  /**
   * 批量檢查多個忘打卡申請
   * 用於在界面顯示哪些日期已有申請
   */
  static async checkMultipleRequests(
    staffId: string,
    requests: Array<{ requestDate: string; missedType: 'check_in' | 'check_out' }>
  ): Promise<Record<string, MissedCheckinValidationResult>> {
    const results: Record<string, MissedCheckinValidationResult> = {};

    for (const request of requests) {
      const key = `${request.requestDate}_${request.missedType}`;
      results[key] = await this.checkDuplicateRequest(
        staffId,
        request.requestDate,
        request.missedType
      );
    }

    return results;
  }
}
