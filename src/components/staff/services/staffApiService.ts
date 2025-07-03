import { supabase } from '@/integrations/supabase/client';
import { NewStaff, Staff } from '../types';

export class StaffApiService {
  static async loadStaffList(): Promise<Staff[]> {
    console.log('📝 StaffApiService: 載入員工列表');

    try {
      const { data, error } = await supabase.from('staff').select('*').order('name');

      if (error) {
        console.error('❌ StaffApiService: 載入失敗:', error);
        throw new Error(`載入員工列表失敗: ${error.message}`);
      }

      console.log(`✅ StaffApiService: 載入成功，共 ${data?.length} 筆資料`);
      return data || [];
    } catch (error) {
      console.error('❌ StaffApiService: 系統錯誤:', error);
      throw error;
    }
  }

  static async addStaff(staffData: NewStaff): Promise<Staff> {
    console.log('📝 StaffApiService: 準備新增員工', staffData);

    // 驗證營業處 ID 格式
    if (
      !staffData.branch_id ||
      staffData.branch_id === 'placeholder-value' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(staffData.branch_id)
    ) {
      throw new Error('營業處 ID 格式無效，請重新選擇營業處');
    }

    // 確保必要欄位都有值
    const insertData = {
      name: staffData.name,
      position: staffData.position,
      department: staffData.department,
      branch_id: staffData.branch_id,
      branch_name: staffData.branch_name,
      contact: staffData.contact,
      role_id: staffData.role_id || 'user',
      supervisor_id: staffData.supervisor_id || null,
      username: staffData.username || null,
      email: staffData.email || null,
    };

    console.log('📝 StaffApiService: 實際插入資料', insertData);

    try {
      const { data, error } = await supabase.from('staff').insert(insertData).select().single();

      if (error) {
        console.error('❌ StaffApiService: Supabase 新增錯誤:', error);

        // 特別處理 UUID 格式錯誤
        if (error.message.includes('invalid input syntax for type uuid')) {
          throw new Error('營業處資料格式錯誤，請重新選擇營業處');
        } else if (error.message.includes('foreign key')) {
          throw new Error('選擇的營業處不存在，請重新選擇');
        } else if (error.message.includes('not null')) {
          throw new Error('必填欄位不能為空，請檢查所有必要資訊');
        }

        throw new Error(`新增員工失敗: ${error.message}`);
      }

      console.log('✅ StaffApiService: 員工新增成功', data);
      return data;
    } catch (error) {
      console.error('❌ StaffApiService: 系統錯誤:', error);
      throw error;
    }
  }

  static async updateStaff(id: string, updateData: Partial<Staff>): Promise<Staff> {
    console.log('📝 StaffApiService: 準備更新員工', { id, updateData });

    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ StaffApiService: 更新錯誤:', error);
        throw new Error(`更新員工失敗: ${error.message}`);
      }

      console.log('✅ StaffApiService: 員工更新成功', data);
      return data;
    } catch (error) {
      console.error('❌ StaffApiService: 更新系統錯誤:', error);
      throw error;
    }
  }

  static async deleteStaff(id: string): Promise<void> {
    console.log('🗑️ StaffApiService: 刪除員工，ID:', id);

    try {
      const { error } = await supabase.from('staff').delete().eq('id', id);

      if (error) {
        console.error('❌ StaffApiService: 刪除失敗:', error);
        throw new Error(`刪除員工失敗: ${error.message}`);
      }

      console.log('✅ StaffApiService: 員工刪除成功');
    } catch (error) {
      console.error('❌ StaffApiService: 刪除系統錯誤:', error);
      throw error;
    }
  }
}
