
import { supabase } from '@/integrations/supabase/client';
import { Department, NewDepartment } from '../types';
import { toast } from '@/hooks/use-toast';

export class DepartmentApiService {
  static async getAllDepartments(): Promise<Department[]> {
    try {
      console.log('🔍 從 API 載入所有部門...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ API 載入部門錯誤:', error);
        throw error;
      }

      console.log('✅ API 成功載入部門:', data?.length, '個');
      return data ? data.map(item => ({
        ...item,
        type: item.type as 'headquarters' | 'branch' | 'store'
      })) : [];
    } catch (error) {
      console.error('💥 API 載入部門失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法從伺服器載入部門資料",
        variant: "destructive",
      });
      return [];
    }
  }

  static async createDepartment(department: NewDepartment): Promise<Department | null> {
    try {
      console.log('➕ API 新增部門:', department);
      
      const { data, error } = await supabase
        .from('departments')
        .insert([{
          name: department.name.trim(),
          type: department.type,
          location: department.location?.trim() || null,
          manager_name: department.manager_name?.trim() || null,
          manager_contact: department.manager_contact?.trim() || null,
          staff_count: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ API 新增部門錯誤:', error);
        throw error;
      }

      console.log('✅ API 成功新增部門:', data);
      return {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store'
      };
    } catch (error) {
      console.error('💥 API 新增部門失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增部門到伺服器",
        variant: "destructive",
      });
      return null;
    }
  }

  static async updateDepartment(department: Department): Promise<Department | null> {
    try {
      console.log('🔄 API 更新部門:', department.id);
      
      // 準備更新資料，移除空字串並轉為 null
      const updateData = {
        name: department.name.trim(),
        type: department.type,
        location: department.location?.trim() || null,
        manager_name: department.manager_name?.trim() || null,
        manager_contact: department.manager_contact?.trim() || null,
        staff_count: department.staff_count || 0,
        updated_at: new Date().toISOString()
      };

      console.log('📝 準備更新的資料:', updateData);

      const { data, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', department.id)
        .select()
        .single();

      if (error) {
        console.error('❌ API 更新部門錯誤:', error);
        throw error;
      }

      console.log('✅ API 成功更新部門:', data);
      
      toast({
        title: "更新成功",
        description: `部門 "${data.name}" 已成功更新`,
      });

      return {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store'
      };
    } catch (error: any) {
      console.error('💥 API 更新部門失敗:', error);
      
      let errorMessage = "無法更新部門到伺服器";
      if (error.code === 'PGRST301') {
        errorMessage = "找不到要更新的部門";
      } else if (error.code === 'PGRST116') {
        errorMessage = "沒有權限更新部門資料";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "更新失敗",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }

  static async deleteDepartment(id: string): Promise<boolean> {
    try {
      console.log('🗑️ API 刪除部門:', id);
      
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ API 刪除部門錯誤:', error);
        throw error;
      }

      console.log('✅ API 成功刪除部門');
      
      toast({
        title: "刪除成功",
        description: "部門已成功刪除",
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 API 刪除部門失敗:', error);
      
      let errorMessage = "無法從伺服器刪除部門";
      if (error.code === 'PGRST301') {
        errorMessage = "找不到要刪除的部門";
      } else if (error.code === 'PGRST116') {
        errorMessage = "沒有權限刪除部門資料";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "刪除失敗",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }
}
