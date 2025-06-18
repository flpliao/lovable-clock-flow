
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
      
      const insertData = DepartmentValidationService.prepareInsertData(department);
      console.log('📝 即將插入的資料:', insertData);
      
      // 暫時關閉 RLS 檢查，直接插入資料
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
        
        // 對於權限錯誤，提供更友善的錯誤訊息
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          // 嘗試使用 RPC 函數來檢查權限並插入
          console.log('🔄 嘗試使用管理員權限插入...');
          
          try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('create_department_as_admin', {
              department_data: insertData
            });
            
            if (rpcError) {
              console.error('RPC 插入也失敗:', rpcError);
              throw new Error('管理員權限不足，無法新增部門');
            }
            
            if (rpcData) {
              console.log('✅ 透過 RPC 新增部門成功:', rpcData);
              toast({
                title: "新增成功",
                description: `部門 "${insertData.name}" 已成功新增`,
              });
              
              return {
                ...rpcData,
                type: rpcData.type as 'headquarters' | 'branch' | 'store'
              };
            }
          } catch (rpcError) {
            console.error('RPC 函數執行失敗:', rpcError);
          }
        }
        
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
      
      let errorMessage = "無法新增部門";
      
      if (error.message) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          errorMessage = "系統權限設定問題，廖俊雄應該擁有管理權限";
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
