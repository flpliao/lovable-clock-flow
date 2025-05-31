
import { supabase } from '@/integrations/supabase/client';

export class PayrollApprovalService {
  // 核准薪資記錄
  static async approvePayroll(payrollId: string, approverId: string, approverName: string, comment?: string) {
    console.log('✅ 核准薪資記錄:', payrollId);

    try {
      // 開始事務
      const { data: payroll, error: updateError } = await supabase
        .from('payrolls')
        .update({
          status: 'approved',
          approved_by: approverId,
          approval_date: new Date().toISOString(),
          approval_comment: comment
        })
        .eq('id', payrollId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ 更新薪資記錄狀態失敗:', updateError);
        throw updateError;
      }

      // 記錄核准歷史
      const { error: historyError } = await supabase
        .from('payroll_approvals')
        .insert({
          payroll_id: payrollId,
          approver_id: approverId,
          approver_name: approverName,
          action: 'approve',
          comment: comment
        });

      if (historyError) {
        console.error('❌ 新增核准歷史失敗:', historyError);
        throw historyError;
      }

      console.log('✅ 薪資記錄核准成功');
      return payroll;
    } catch (error) {
      console.error('❌ 核准薪資記錄失敗:', error);
      throw error;
    }
  }

  // 拒絕薪資記錄
  static async rejectPayroll(payrollId: string, approverId: string, approverName: string, comment: string) {
    console.log('❌ 拒絕薪資記錄:', payrollId);

    try {
      // 更新薪資記錄狀態
      const { data: payroll, error: updateError } = await supabase
        .from('payrolls')
        .update({
          status: 'rejected',
          approved_by: approverId,
          approval_date: new Date().toISOString(),
          approval_comment: comment
        })
        .eq('id', payrollId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ 更新薪資記錄狀態失敗:', updateError);
        throw updateError;
      }

      // 記錄拒絕歷史
      const { error: historyError } = await supabase
        .from('payroll_approvals')
        .insert({
          payroll_id: payrollId,
          approver_id: approverId,
          approver_name: approverName,
          action: 'reject',
          comment: comment
        });

      if (historyError) {
        console.error('❌ 新增拒絕歷史失敗:', historyError);
        throw historyError;
      }

      console.log('✅ 薪資記錄拒絕成功');
      return payroll;
    } catch (error) {
      console.error('❌ 拒絕薪資記錄失敗:', error);
      throw error;
    }
  }

  // 獲取核准歷史
  static async getApprovalHistory(payrollId: string) {
    console.log('📋 獲取核准歷史:', payrollId);

    const { data, error } = await supabase
      .from('payroll_approvals')
      .select('*')
      .eq('payroll_id', payrollId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 獲取核准歷史失敗:', error);
      throw error;
    }

    console.log('✅ 核准歷史獲取成功:', data?.length);
    return data;
  }
}
