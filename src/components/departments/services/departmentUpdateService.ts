
import { supabase } from '@/integrations/supabase/client';
import { Department } from '../types';
import { toast } from '@/hooks/use-toast';
import { DepartmentValidationService } from './departmentValidationService';

export class DepartmentUpdateService {
  static async updateDepartment(department: Department): Promise<Department | null> {
    try {
      console.log('🔄 更新部門:', department.id);
      
      // 驗證資料
      const validationError = DepartmentValidationService.validateDepartment(department);
      if (validationError) {
        throw new Error(validationError);
      }

      const updateData = DepartmentValidationService.prepareUpdateData(department);
      console.log('📝 準備更新的資料:', updateData);

      const { data, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', department.id)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新部門錯誤:', error);
        throw error;
      }

      console.log('✅ 成功更新部門:', data);
      
      toast({
        title: "更新成功",
        description: `部門 "${data.name}" 已成功更新`,
      });

      return {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store' | 'department',
        gps_status: (data.gps_status as 'not_converted' | 'converted' | 'failed') || 'not_converted'
      };
    } catch (error: any) {
      console.error('💥 更新部門失敗:', error);
      
      let errorMessage = "無法更新部門到資料庫";
      if (error.message) {
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
}
