import { NewStaff, Staff } from '@/components/staff/types';
import { supabase } from '@/integrations/supabase/client';

export class staffService {
  static async loadStaffList(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*, branch:branch_id(name), staff_role:role_id(name)')
      .order('name');

    if (error) {
      throw new Error(`載入員工列表失敗: ${error.message}`);
    }

    // 將 branch.name 與 role.name 寫入對應欄位
    const staffList = (data || []).map(staff => ({
      ...staff,
      branch_name: staff.branch?.name || '',
      role_name: staff.staff_role?.name || '',
    }));

    return staffList;
  }

  static async addStaff(staffData: NewStaff): Promise<Staff> {
    console.log('📝 StaffApiService: 準備新增員工', staffData);

    if (
      !staffData.branch_id ||
      staffData.branch_id === 'placeholder-value' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(staffData.branch_id)
    ) {
      throw new Error('單位 ID 格式無效，請重新選擇單位');
    }

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

        if (error.message.includes('invalid input syntax for type uuid')) {
          throw new Error('單位資料格式錯誤，請重新選擇單位');
        } else if (error.message.includes('foreign key')) {
          throw new Error('選擇的單位不存在，請重新選擇');
        } else if (error.message.includes('not null')) {
          throw new Error('必填欄位不能為空，請檢查所有必要資訊');
        }

        throw new Error(`新增員工失敗: ${error.message}`);
      }

      console.log('✅ StaffApiService: 員工新增成功', data);
      // 補齊型別需要但查詢不會帶回的欄位
      return {
        ...data,
        branch_name: data.branch_name || '',
        role_name: '',
      };
    } catch (error) {
      console.error('❌ StaffApiService: 系統錯誤:', error);
      throw error;
    }
  }

  static async updateStaff(id: string, updateData: Partial<Staff>): Promise<Staff> {
    // 過濾掉關聯欄位
    const {
      branch: _branch,
      staff_role: _staff_role,
      role_name: _role_name,
      supervisor_name: _supervisor_name,
      ...pureUpdateData
    } = updateData;

    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          ...pureUpdateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`更新員工失敗: ${error.message}`);
      }

      return {
        ...data,
        branch_name: data.branch_name || '',
        role_name: '',
      };
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
