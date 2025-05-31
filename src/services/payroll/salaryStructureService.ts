
import { supabase } from '@/integrations/supabase/client';

export class SalaryStructureService {
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
}
