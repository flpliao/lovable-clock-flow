
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const testSupabaseConnection = async () => {
    setIsTestingConnection(true);
    console.log('=== 開始 Supabase 連線測試 ===');
    
    try {
      // 1. 測試基本連線
      console.log('1. 測試基本連線...');
      const { data: healthCheck, error: healthError } = await supabase
        .from('companies')
        .select('count')
        .limit(1);
      
      if (healthError) {
        console.error('基本連線失敗:', healthError);
        throw new Error(`連線失敗: ${healthError.message}`);
      }
      console.log('✅ 基本連線正常');

      // 2. 測試讀取權限
      console.log('2. 測試讀取權限...');
      const { data: readTest, error: readError } = await supabase
        .from('companies')
        .select('*')
        .limit(1);
      
      if (readError) {
        console.error('讀取權限測試失敗:', readError);
        console.log('讀取錯誤詳情:', {
          message: readError.message,
          code: readError.code,
          hint: readError.hint
        });
      } else {
        console.log('✅ 讀取權限正常, 資料:', readTest);
      }

      // 3. 測試寫入權限 (嘗試更新一筆不存在的記錄)
      console.log('3. 測試寫入權限...');
      const { data: writeTest, error: writeError } = await supabase
        .from('companies')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000000') // 不存在的ID
        .select();
      
      if (writeError) {
        console.error('寫入權限測試失敗:', writeError);
        console.log('寫入錯誤詳情:', {
          message: writeError.message,
          code: writeError.code,
          hint: writeError.hint
        });
      } else {
        console.log('✅ 寫入權限正常');
      }

      // 4. 測試 RLS 政策
      console.log('4. 測試 RLS 政策...');
      const { data: rlsTest, error: rlsError } = await supabase
        .from('staff')
        .select('id, name, role')
        .limit(1);
      
      if (rlsError) {
        console.error('RLS 政策測試失敗:', rlsError);
        if (rlsError.message.includes('infinite recursion')) {
          console.log('❌ 發現 RLS 政策無限遞迴問題');
          toast({
            title: "RLS 政策錯誤",
            description: "檢測到 staff 表的 RLS 政策有無限遞迴問題，這可能影響資料存取",
            variant: "destructive"
          });
        }
      } else {
        console.log('✅ RLS 政策正常, staff 資料:', rlsTest);
      }

      // 5. 測試當前用戶角色
      console.log('5. 測試當前用戶角色...');
      const { data: roleTest, error: roleError } = await supabase
        .rpc('get_user_role_safe', { user_uuid: '550e8400-e29b-41d4-a716-446655440001' });
      
      if (roleError) {
        console.error('角色測試失敗:', roleError);
      } else {
        console.log('✅ 用戶角色:', roleTest);
      }

      console.log('=== Supabase 連線測試完成 ===');
      
      toast({
        title: "連線測試完成",
        description: "請檢查控制台日誌查看詳細結果",
      });

    } catch (error) {
      console.error('Supabase 連線測試失敗:', error);
      toast({
        title: "連線測試失敗",
        description: error instanceof Error ? error.message : "未知錯誤",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return {
    testSupabaseConnection,
    isTestingConnection
  };
};
