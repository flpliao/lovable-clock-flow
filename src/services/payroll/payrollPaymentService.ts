
import { supabase } from '@/integrations/supabase/client';

export class PayrollPaymentService {
  // 標記薪資為已發放
  static async markAsPaid(
    payrollId: string, 
    paidBy: string, 
    paidByName: string, 
    paymentData: {
      paymentMethod: string;
      paymentReference?: string;
      comment?: string;
    }
  ) {
    console.log('💰 標記薪資為已發放:', payrollId);

    try {
      // 先獲取薪資記錄的淨薪資
      const { data: payroll, error: fetchError } = await supabase
        .from('payrolls')
        .select('net_salary')
        .eq('id', payrollId)
        .single();

      if (fetchError) {
        console.error('❌ 獲取薪資記錄失敗:', fetchError);
        throw fetchError;
      }

      // 更新薪資記錄狀態
      const { data: updatedPayroll, error: updateError } = await supabase
        .from('payrolls')
        .update({
          status: 'paid',
          paid_by: paidBy,
          paid_date: new Date().toISOString(),
          payment_method: paymentData.paymentMethod,
          payment_reference: paymentData.paymentReference,
          payment_comment: paymentData.comment
        })
        .eq('id', payrollId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ 更新薪資記錄狀態失敗:', updateError);
        throw updateError;
      }

      // 記錄發放歷史
      const { error: historyError } = await supabase
        .from('payroll_payments')
        .insert({
          payroll_id: payrollId,
          paid_by: paidBy,
          paid_by_name: paidByName,
          payment_method: paymentData.paymentMethod,
          payment_reference: paymentData.paymentReference,
          amount: payroll.net_salary,
          comment: paymentData.comment
        });

      if (historyError) {
        console.error('❌ 新增發放歷史失敗:', historyError);
        throw historyError;
      }

      console.log('✅ 薪資發放成功');
      return updatedPayroll;
    } catch (error) {
      console.error('❌ 薪資發放失敗:', error);
      throw error;
    }
  }

  // 獲取發放歷史
  static async getPaymentHistory(payrollId: string) {
    console.log('📋 獲取發放歷史:', payrollId);

    const { data, error } = await supabase
      .from('payroll_payments')
      .select('*')
      .eq('payroll_id', payrollId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 獲取發放歷史失敗:', error);
      throw error;
    }

    console.log('✅ 發放歷史獲取成功:', data?.length);
    return data;
  }

  // 獲取所有發放記錄（用於統計）
  static async getAllPayments() {
    console.log('📊 獲取所有發放記錄...');

    const { data, error } = await supabase
      .from('payroll_payments')
      .select(`
        *,
        payroll:payroll_id (
          staff:staff_id (
            name,
            department
          )
        )
      `)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('❌ 獲取發放記錄失敗:', error);
      throw error;
    }

    console.log('✅ 發放記錄獲取成功:', data?.length);
    return data;
  }
}
