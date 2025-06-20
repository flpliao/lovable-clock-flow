
import { supabase } from '@/integrations/supabase/client';
import { Department, NewDepartment } from '../types';
import { toast } from '@/hooks/use-toast';
import { DepartmentValidationService } from './departmentValidationService';

export class DepartmentCreateService {
  static async createDepartment(department: NewDepartment): Promise<Department | null> {
    try {
      console.log('➕ 開始新增部門 - 廖俊雄管理員操作:', department);
      
      // 驗證資料
      const validationError = DepartmentValidationService.validateNewDepartment(department);
      if (validationError) {
        throw new Error(validationError);
      }
      
      const insertData = DepartmentValidationService.prepareInsertData(department);
      console.log('📝 即將插入的資料:', insertData);
      console.log('🔐 操作者: 廖俊雄 (最高管理員)');
      
      // 廖俊雄的管理員 ID
      const adminUserId = '550e8400-e29b-41d4-a716-446655440001';
      console.log('👤 廖俊雄管理員 ID:', adminUserId);
      
      // 直接使用 Supabase 插入，信任資料庫 RLS 政策
      console.log('🚀 使用最高權限插入部門資料...');
      
      const { data, error } = await supabase
        .from('departments')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ 部門新增錯誤:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          administrator: '廖俊雄',
          adminId: adminUserId
        });
        
        // 簡化錯誤處理
        let errorMessage = '部門新增失敗';
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          errorMessage = '系統權限設定問題，請聯繫系統管理員';
        } else if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
          errorMessage = '部門名稱已存在，請使用不同的名稱';
        } else {
          errorMessage = `新增失敗: ${error.message}`;
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ 廖俊雄管理員新增部門成功:', data);
      
      toast({
        title: "新增成功",
        description: `部門 "${data.name}" 已成功新增`,
      });
      
      return {
        ...data,
        type: data.type as 'headquarters' | 'branch' | 'store' | 'department',
        gps_status: (data.gps_status as 'not_converted' | 'converted' | 'failed') || 'not_converted'
      };
      
    } catch (error: any) {
      console.error('💥 廖俊雄管理員新增部門失敗:', error);
      
      toast({
        title: "新增失敗",
        description: error.message || "系統發生錯誤，請稍後再試",
        variant: "destructive",
      });
      
      return null;
    }
  }
}
