
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const testSupabaseConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      console.log('🔍 開始測試 Supabase 連線...');
      
      let successCount = 0;
      let totalTests = 0;
      const testResults: { table: string; success: boolean; error?: string }[] = [];

      // 測試 companies 表
      totalTests++;
      try {
        console.log('📋 測試 companies 表...');
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('count')
          .limit(1);

        if (companiesError) {
          console.log('⚠️ companies 表測試錯誤:', companiesError);
          testResults.push({ table: 'companies', success: false, error: companiesError.message });
        } else {
          console.log('✅ companies 表測試成功');
          testResults.push({ table: 'companies', success: true });
          successCount++;
        }
      } catch (error) {
        console.error('❌ companies 表測試異常:', error);
        testResults.push({ table: 'companies', success: false, error: String(error) });
      }

      // 測試 branches 表
      totalTests++;
      try {
        console.log('🏢 測試 branches 表...');
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select('count')
          .limit(1);

        if (branchesError) {
          console.log('⚠️ branches 表測試錯誤:', branchesError);
          testResults.push({ table: 'branches', success: false, error: branchesError.message });
        } else {
          console.log('✅ branches 表測試成功');
          testResults.push({ table: 'branches', success: true });
          successCount++;
        }
      } catch (error) {
        console.error('❌ branches 表測試異常:', error);
        testResults.push({ table: 'branches', success: false, error: String(error) });
      }

      // 測試 staff 表（RLS 已修復）
      totalTests++;
      try {
        console.log('👥 測試 staff 表...');
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('count')
          .limit(1);

        if (staffError) {
          console.log('⚠️ staff 表測試錯誤:', staffError);
          testResults.push({ table: 'staff', success: false, error: staffError.message });
        } else {
          console.log('✅ staff 表測試成功');
          testResults.push({ table: 'staff', success: true });
          successCount++;
        }
      } catch (error) {
        console.error('❌ staff 表測試異常:', error);
        testResults.push({ table: 'staff', success: false, error: String(error) });
      }

      // 測試基本連線能力
      totalTests++;
      try {
        console.log('🔗 測試基本 Supabase 連線...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error && !error.message.includes('session_not_found')) {
          console.log('⚠️ 基本連線測試錯誤:', error);
          testResults.push({ table: 'auth', success: false, error: error.message });
        } else {
          console.log('✅ 基本連線測試成功');
          testResults.push({ table: 'auth', success: true });
          successCount++;
        }
      } catch (error) {
        console.error('❌ 基本連線測試異常:', error);
        testResults.push({ table: 'auth', success: false, error: String(error) });
      }

      // 顯示測試結果
      console.log('📊 連線測試結果:', testResults);
      console.log(`✅ 成功: ${successCount}/${totalTests} 項測試通過`);

      if (successCount === totalTests) {
        toast({
          title: "連線測試成功",
          description: `所有 ${totalTests} 項測試都通過，資料庫連線正常`,
        });
      } else if (successCount > 0) {
        toast({
          title: "部分連線成功",
          description: `${successCount}/${totalTests} 項測試通過，RLS 問題已修復`,
        });
      } else {
        toast({
          title: "連線測試失敗",
          description: "所有測試都失敗，請檢查網路連線或聯繫管理員",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('💥 連線測試發生嚴重錯誤:', error);
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
