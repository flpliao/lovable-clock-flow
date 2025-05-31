
import { supabase } from '@/integrations/supabase/client';
import type { Payroll, SalaryStructure, LeaveType } from '@/types/hr';

export class PayrollService {
  // 薪資發放記錄相關操作
  static async getPayrolls() {
    console.log('🔍 獲取薪資發放記錄...');
    
    const { data, error } = await supabase
      .from('payrolls')
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          position,
          department,
          contact
        ),
        salary_structure:salary_structure_id (
          position,
          department,
          level,
          base_salary
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 獲取薪資記錄失敗:', error);
      throw error;
    }

    console.log('✅ 薪資記錄獲取成功:', data?.length);
    return data;
  }

  static async createPayroll(payrollData: Partial<Payroll>) {
    console.log('📝 創建薪資記錄:', payrollData);

    // 計算總薪資
    const grossSalary = (payrollData.base_salary || 0) + 
                       (payrollData.overtime_pay || 0) + 
                       (payrollData.holiday_pay || 0) + 
                       (payrollData.allowances || 0);
    
    const netSalary = grossSalary - 
                     (payrollData.deductions || 0) - 
                     (payrollData.tax || 0) - 
                     (payrollData.labor_insurance || 0) - 
                     (payrollData.health_insurance || 0);

    const { data, error } = await supabase
      .from('payrolls')
      .insert({
        ...payrollData,
        gross_salary: grossSalary,
        net_salary: netSalary,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 創建薪資記錄失敗:', error);
      throw error;
    }

    console.log('✅ 薪資記錄創建成功');
    return data;
  }

  static async updatePayroll(id: string, updates: Partial<Payroll>) {
    console.log('📝 更新薪資記錄:', id, updates);

    // 重新計算薪資
    if (updates.base_salary !== undefined || updates.overtime_pay !== undefined || 
        updates.holiday_pay !== undefined || updates.allowances !== undefined ||
        updates.deductions !== undefined || updates.tax !== undefined ||
        updates.labor_insurance !== undefined || updates.health_insurance !== undefined) {
      
      const grossSalary = (updates.base_salary || 0) + 
                         (updates.overtime_pay || 0) + 
                         (updates.holiday_pay || 0) + 
                         (updates.allowances || 0);
      
      const netSalary = grossSalary - 
                       (updates.deductions || 0) - 
                       (updates.tax || 0) - 
                       (updates.labor_insurance || 0) - 
                       (updates.health_insurance || 0);

      updates.gross_salary = grossSalary;
      updates.net_salary = netSalary;
    }

    const { data, error } = await supabase
      .from('payrolls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ 更新薪資記錄失敗:', error);
      throw error;
    }

    console.log('✅ 薪資記錄更新成功');
    return data;
  }

  static async deletePayroll(id: string) {
    console.log('🗑️ 刪除薪資記錄:', id);

    const { error } = await supabase
      .from('payrolls')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ 刪除薪資記錄失敗:', error);
      throw error;
    }

    console.log('✅ 薪資記錄刪除成功');
  }

  // 薪資結構相關操作
  static async getSalaryStructures() {
    console.log('🔍 獲取薪資結構...');
    
    const { data, error } = await supabase
      .from('salary_structures')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('❌ 獲取薪資結構失敗:', error);
      throw error;
    }

    console.log('✅ 薪資結構獲取成功:', data?.length);
    return data;
  }

  static async createSalaryStructure(structureData: Partial<SalaryStructure>) {
    console.log('📝 創建薪資結構:', structureData);

    const { data, error } = await supabase
      .from('salary_structures')
      .insert(structureData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建薪資結構失敗:', error);
      throw error;
    }

    console.log('✅ 薪資結構創建成功');
    return data;
  }

  static async updateSalaryStructure(id: string, updates: Partial<SalaryStructure>) {
    console.log('📝 更新薪資結構:', id, updates);

    const { data, error } = await supabase
      .from('salary_structures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ 更新薪資結構失敗:', error);
      throw error;
    }

    console.log('✅ 薪資結構更新成功');
    return data;
  }

  static async deleteSalaryStructure(id: string) {
    console.log('🗑️ 刪除薪資結構:', id);

    const { error } = await supabase
      .from('salary_structures')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ 刪除薪資結構失敗:', error);
      throw error;
    }

    console.log('✅ 薪資結構刪除成功');
  }

  // 請假類型相關操作
  static async getLeaveTypes() {
    console.log('🔍 獲取請假類型...');
    
    const { data, error } = await supabase
      .from('leave_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 獲取請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型獲取成功:', data?.length);
    return data;
  }

  static async createLeaveType(leaveTypeData: Partial<LeaveType>) {
    console.log('📝 創建請假類型:', leaveTypeData);

    const { data, error } = await supabase
      .from('leave_types')
      .insert(leaveTypeData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型創建成功');
    return data;
  }

  static async updateLeaveType(id: string, updates: Partial<LeaveType>) {
    console.log('📝 更新請假類型:', id, updates);

    const { data, error } = await supabase
      .from('leave_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ 更新請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型更新成功');
    return data;
  }

  // 統計相關
  static async getPayrollStats() {
    console.log('📊 獲取薪資統計...');

    const { data, error } = await supabase
      .from('payrolls')
      .select('status, gross_salary, net_salary');

    if (error) {
      console.error('❌ 獲取薪資統計失敗:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(p => p.status === 'draft').length || 0,
      approved: data?.filter(p => p.status === 'approved').length || 0,
      paid: data?.filter(p => p.status === 'paid').length || 0,
      totalGross: data?.reduce((sum, p) => sum + (p.gross_salary || 0), 0) || 0,
      totalNet: data?.reduce((sum, p) => sum + (p.net_salary || 0), 0) || 0
    };

    console.log('✅ 薪資統計獲取成功:', stats);
    return stats;
  }
}
