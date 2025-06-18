
import { supabase } from '@/integrations/supabase/client';
import { Department, NewDepartment } from '../types';
import { toast } from '@/hooks/use-toast';
import { DepartmentValidationService } from './departmentValidationService';

export class DepartmentCreateService {
  static async createDepartment(department: NewDepartment): Promise<Department | null> {
    try {
      console.log('➕ 開始新增部門:', department);
      
      // 驗證資料
      const validationError = DepartmentValidationService.validateNewDepartment(department);
      if (validationError) {
        throw new Error(validationError);
      }
      
      // 檢查用戶身份
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('❌ 身份驗證錯誤:', authError);
        // 在模擬環境中繼續執行
      }
      console.log('👤 執行新增的用戶ID:', user?.id);
      
      const insertData = DepartmentValidationService.prepareInsertData(department);
      console.log('📝 即將插入的資料:', insertData);
      
      // 直接嘗試插入，讓 RLS 政策處理權限檢查
      const { data, error } = await supabase
        .from('departments')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ 新增部門錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ 新增部門成功:', data);
      toast({
        title: "新增成功",
        description: `部門 "${data.name}" 已成功新增`,
      });
      
      return {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store'
      };
    } catch (error: any) {
      console.error('💥 新增部門失敗完整錯誤:', error);
      
      let errorMessage = "無法新增部門到資料庫";
      
      if (error.message) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          errorMessage = "系統權限設定問題，請重新整理頁面後再試";
        } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
          errorMessage = "部門名稱已存在，請使用不同的名稱";
        } else if (error.message.includes('violates') || error.message.includes('constraint')) {
          errorMessage = "資料格式錯誤，請檢查輸入內容";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "新增失敗",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  }
}
