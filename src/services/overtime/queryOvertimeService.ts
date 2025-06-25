
import { supabase } from '@/integrations/supabase/client';

export const queryOvertimeService = {
  async getOvertimeRequestsByCurrentUser(currentUserId: string) {
    console.log('🔍 查詢當前用戶加班記錄（僅限自己）:', currentUserId);
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position,
          supervisor_id
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at,
          updated_at
        )
      `)
      .eq('staff_id', currentUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢當前用戶加班記錄失敗:', error);
      return [];
    }

    console.log('✅ 查詢當前用戶加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  async getPendingOvertimeRequestsByCurrentUser(currentUserId: string) {
    console.log('🔍 查詢當前用戶待審核加班記錄:', currentUserId);
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position,
          supervisor_id
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at,
          updated_at
        )
      `)
      .eq('staff_id', currentUserId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 查詢待審核加班記錄失敗:', error);
      return [];
    }

    console.log('✅ 查詢待審核加班記錄成功:', data?.length, '筆記錄');
    return data || [];
  },

  async getOvertimeRequestById(overtimeId: string, currentUserId: string) {
    console.log('🔍 查詢特定加班申請:', { overtimeId, currentUserId });
    
    const { data, error } = await supabase
      .from('overtimes')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position,
          supervisor_id
        ),
        overtime_approval_records (
          id,
          approver_id,
          approver_name,
          level,
          status,
          approval_date,
          comment,
          created_at,
          updated_at
        )
      `)
      .eq('id', overtimeId)
      .single();

    if (error) {
      console.error('❌ 查詢加班申請失敗:', error);
      throw error;
    }

    // 檢查權限：只能查看自己的申請或自己需要審核的申請
    if (data.staff_id !== currentUserId && data.current_approver !== currentUserId) {
      // 檢查是否為管理員或特殊帳號
      const { data: staffData } = await supabase
        .from('staff')
        .select('role')
        .eq('id', currentUserId)
        .single();
        
      if (!staffData || 
          (staffData.role !== 'admin' && 
           currentUserId !== '550e8400-e29b-41d4-a716-446655440001')) {
        throw new Error('無權限查詢此加班申請');
      }
    }

    console.log('✅ 查詢加班申請成功:', data.id);
    return data;
  },

  async getOvertimeStatistics(currentUserId: string, year?: number) {
    console.log('📊 查詢加班統計資料:', { currentUserId, year });
    
    const currentYear = year || new Date().getFullYear();
    
    const { data, error } = await supabase
      .from('overtimes')
      .select('status, hours, overtime_type, compensation_type, created_at')
      .eq('staff_id', currentUserId)
      .gte('overtime_date', `${currentYear}-01-01`)
      .lte('overtime_date', `${currentYear}-12-31`);

    if (error) {
      console.error('❌ 查詢加班統計失敗:', error);
      return {
        totalHours: 0,
        approvedHours: 0,
        pendingCount: 0,
        rejectedCount: 0,
        monthlyData: []
      };
    }

    // 計算統計資料
    const totalHours = data.reduce((sum, record) => sum + (record.hours || 0), 0);
    const approvedHours = data
      .filter(record => record.status === 'approved')
      .reduce((sum, record) => sum + (record.hours || 0), 0);
    const pendingCount = data.filter(record => record.status === 'pending').length;
    const rejectedCount = data.filter(record => record.status === 'rejected').length;

    // 按月份統計
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthRecords = data.filter(record => {
        const recordMonth = new Date(record.created_at).getMonth() + 1;
        return recordMonth === month;
      });
      
      return {
        month,
        hours: monthRecords.reduce((sum, record) => sum + (record.hours || 0), 0),
        count: monthRecords.length
      };
    });

    console.log('✅ 加班統計查詢成功');
    return {
      totalHours,
      approvedHours,
      pendingCount,
      rejectedCount,
      monthlyData
    };
  }
};
