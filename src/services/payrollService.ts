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

  static async createPayroll(payrollData: any) {
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

    const insertData = {
      staff_id: payrollData.staff_id,
      salary_structure_id: payrollData.salary_structure_id,
      pay_period_start: payrollData.pay_period_start,
      pay_period_end: payrollData.pay_period_end,
      base_salary: Number(payrollData.base_salary) || 0,
      overtime_hours: Number(payrollData.overtime_hours) || 0,
      overtime_pay: Number(payrollData.overtime_pay) || 0,
      holiday_hours: Number(payrollData.holiday_hours) || 0,
      holiday_pay: Number(payrollData.holiday_pay) || 0,
      allowances: Number(payrollData.allowances) || 0,
      deductions: Number(payrollData.deductions) || 0,
      tax: Number(payrollData.tax) || 0,
      labor_insurance: Number(payrollData.labor_insurance) || 0,
      health_insurance: Number(payrollData.health_insurance) || 0,
      gross_salary: grossSalary,
      net_salary: netSalary,
      status: payrollData.status || 'draft'
    };

    const { data, error } = await supabase
      .from('payrolls')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建薪資記錄失敗:', error);
      throw error;
    }

    console.log('✅ 薪資記錄創建成功');
    return data;
  }

  static async updatePayroll(id: string, updates: any) {
    console.log('📝 更新薪資記錄:', id, updates);

    // 確保數值欄位是數字類型並重新計算薪資
    const numericUpdates = {
      ...updates,
      base_salary: updates.base_salary !== undefined ? Number(updates.base_salary) : undefined,
      overtime_hours: updates.overtime_hours !== undefined ? Number(updates.overtime_hours) : undefined,
      overtime_pay: updates.overtime_pay !== undefined ? Number(updates.overtime_pay) : undefined,
      holiday_hours: updates.holiday_hours !== undefined ? Number(updates.holiday_hours) : undefined,
      holiday_pay: updates.holiday_pay !== undefined ? Number(updates.holiday_pay) : undefined,
      allowances: updates.allowances !== undefined ? Number(updates.allowances) : undefined,
      deductions: updates.deductions !== undefined ? Number(updates.deductions) : undefined,
      tax: updates.tax !== undefined ? Number(updates.tax) : undefined,
      labor_insurance: updates.labor_insurance !== undefined ? Number(updates.labor_insurance) : undefined,
      health_insurance: updates.health_insurance !== undefined ? Number(updates.health_insurance) : undefined
    };

    // 如果有薪資相關欄位更新，重新計算總薪資
    if (numericUpdates.base_salary !== undefined || numericUpdates.overtime_pay !== undefined || 
        numericUpdates.holiday_pay !== undefined || numericUpdates.allowances !== undefined ||
        numericUpdates.deductions !== undefined || numericUpdates.tax !== undefined ||
        numericUpdates.labor_insurance !== undefined || numericUpdates.health_insurance !== undefined) {
      
      // 先獲取現有資料
      const { data: currentData } = await supabase
        .from('payrolls')
        .select('*')
        .eq('id', id)
        .single();

      if (currentData) {
        const grossSalary = (numericUpdates.base_salary ?? currentData.base_salary) + 
                           (numericUpdates.overtime_pay ?? currentData.overtime_pay) + 
                           (numericUpdates.holiday_pay ?? currentData.holiday_pay) + 
                           (numericUpdates.allowances ?? currentData.allowances);
        
        const netSalary = grossSalary - 
                         (numericUpdates.deductions ?? currentData.deductions) - 
                         (numericUpdates.tax ?? currentData.tax) - 
                         (numericUpdates.labor_insurance ?? currentData.labor_insurance) - 
                         (numericUpdates.health_insurance ?? currentData.health_insurance);

        numericUpdates.gross_salary = grossSalary;
        numericUpdates.net_salary = netSalary;
      }
    }

    const { data, error } = await supabase
      .from('payrolls')
      .update(numericUpdates)
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

  static async createSalaryStructure(structureData: any) {
    console.log('📝 創建薪資結構:', structureData);

    const insertData = {
      position: structureData.position,
      department: structureData.department,
      level: structureData.level || 1,
      base_salary: structureData.base_salary || 0,
      overtime_rate: structureData.overtime_rate || 1.34,
      holiday_rate: structureData.holiday_rate || 2.0,
      allowances: structureData.allowances || {},
      benefits: structureData.benefits || {},
      is_active: structureData.is_active !== undefined ? structureData.is_active : true,
      effective_date: structureData.effective_date || new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('salary_structures')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建薪資結構失敗:', error);
      throw error;
    }

    console.log('✅ 薪資結構創建成功');
    return data;
  }

  static async updateSalaryStructure(id: string, updates: any) {
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

  static async createLeaveType(leaveTypeData: any) {
    console.log('📝 創建請假類型:', leaveTypeData);

    const insertData = {
      code: leaveTypeData.code,
      name_zh: leaveTypeData.name_zh,
      name_en: leaveTypeData.name_en,
      is_paid: leaveTypeData.is_paid || false,
      annual_reset: leaveTypeData.annual_reset !== undefined ? leaveTypeData.annual_reset : true,
      max_days_per_year: leaveTypeData.max_days_per_year,
      requires_attachment: leaveTypeData.requires_attachment || false,
      description: leaveTypeData.description,
      is_active: leaveTypeData.is_active !== undefined ? leaveTypeData.is_active : true,
      sort_order: leaveTypeData.sort_order || 0
    };

    const { data, error } = await supabase
      .from('leave_types')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('❌ 創建請假類型失敗:', error);
      throw error;
    }

    console.log('✅ 請假類型創建成功');
    return data;
  }

  static async updateLeaveType(id: string, updates: any) {
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
