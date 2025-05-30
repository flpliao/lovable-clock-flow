
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticResult } from '../types';

export const useDiagnosticTests = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResults = (newResult: DiagnosticResult) => {
    setResults(prev => [...prev, newResult]);
  };

  const testSupabaseConnection = async () => {
    try {
      console.log('🔍 診斷：測試 Supabase 基本連線...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session_not_found')) {
        updateResults({
          name: 'Supabase 基本連線',
          status: 'error',
          message: '連線失敗',
          details: error.message,
          suggestion: '檢查網路連線或 Supabase 服務狀態'
        });
      } else {
        updateResults({
          name: 'Supabase 基本連線',
          status: 'success',
          message: '連線正常'
        });
      }
    } catch (error) {
      updateResults({
        name: 'Supabase 基本連線',
        status: 'error',
        message: '連線異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查網路連線設定'
      });
    }
  };

  const testDatabaseAccess = async () => {
    try {
      console.log('🔍 診斷：測試資料庫存取權限...');
      const { data, error } = await supabase
        .from('companies')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        updateResults({
          name: '資料庫存取權限',
          status: 'error',
          message: '無法存取資料庫',
          details: error.message,
          suggestion: '檢查 RLS 政策或資料庫權限設定'
        });
      } else {
        updateResults({
          name: '資料庫存取權限',
          status: 'success',
          message: '資料庫存取正常'
        });
      }
    } catch (error) {
      updateResults({
        name: '資料庫存取權限',
        status: 'error',
        message: '存取異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫連線狀態'
      });
    }
  };

  const testCompanyDataQuery = async () => {
    try {
      console.log('🔍 診斷：測試查詢依美琦公司資料...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', '53907735')
        .maybeSingle();
      
      if (error) {
        updateResults({
          name: '依美琦公司資料查詢',
          status: 'error',
          message: '查詢失敗',
          details: error.message,
          suggestion: '檢查查詢語法或資料表結構'
        });
      } else if (data) {
        updateResults({
          name: '依美琦公司資料查詢',
          status: 'success',
          message: `找到公司資料: ${data.name}`
        });
      } else {
        updateResults({
          name: '依美琦公司資料查詢',
          status: 'warning',
          message: '未找到依美琦公司資料',
          details: '資料庫中沒有統一編號 53907735 的公司記錄',
          suggestion: '需要手動創建公司資料或執行資料初始化'
        });
      }
    } catch (error) {
      updateResults({
        name: '依美琦公司資料查詢',
        status: 'error',
        message: '查詢異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫連線或查詢權限'
      });
    }
  };

  const testWritePermissions = async () => {
    try {
      console.log('🔍 診斷：測試寫入權限...');
      const testData = {
        name: '測試公司_' + Date.now(),
        registration_number: 'TEST' + Date.now(),
        legal_representative: '測試代表人',
        address: '測試地址',
        phone: '02-1234-5678',
        email: 'test@example.com',
        business_type: '測試業務'
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(testData)
        .select()
        .single();
      
      if (error) {
        updateResults({
          name: '資料寫入權限測試',
          status: 'error',
          message: '寫入失敗',
          details: error.message,
          suggestion: '檢查寫入權限或 RLS 政策設定'
        });
      } else {
        // 立即刪除測試資料
        await supabase
          .from('companies')
          .delete()
          .eq('id', data.id);
        
        updateResults({
          name: '資料寫入權限測試',
          status: 'success',
          message: '寫入權限正常'
        });
      }
    } catch (error) {
      updateResults({
        name: '資料寫入權限測試',
        status: 'error',
        message: '測試異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫寫入權限'
      });
    }
  };

  const testUpdatePermissions = async () => {
    try {
      console.log('🔍 診斷：測試更新權限...');
      const testData = {
        name: '測試更新公司_' + Date.now(),
        registration_number: 'UPDATE_TEST' + Date.now(),
        legal_representative: '測試代表人',
        address: '測試地址',
        phone: '02-1234-5678',
        email: 'test@example.com',
        business_type: '測試業務'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('companies')
        .insert(testData)
        .select()
        .single();
      
      if (insertError) {
        updateResults({
          name: '資料更新權限測試',
          status: 'error',
          message: '無法創建測試資料',
          details: insertError.message,
          suggestion: '先解決寫入權限問題'
        });
      } else {
        const { error: updateError } = await supabase
          .from('companies')
          .update({ name: '已更新_' + insertData.name })
          .eq('id', insertData.id);

        if (updateError) {
          updateResults({
            name: '資料更新權限測試',
            status: 'error',
            message: '更新失敗',
            details: updateError.message,
            suggestion: '檢查更新權限或 RLS 政策設定'
          });
        } else {
          updateResults({
            name: '資料更新權限測試',
            status: 'success',
            message: '更新權限正常'
          });
        }

        // 清理測試資料
        await supabase
          .from('companies')
          .delete()
          .eq('id', insertData.id);
      }
    } catch (error) {
      updateResults({
        name: '資料更新權限測試',
        status: 'error',
        message: '測試異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫更新權限'
      });
    }
  };

  const testBranchesTable = async () => {
    try {
      console.log('🔍 診斷：測試營業處資料表連線...');
      const { data, error } = await supabase
        .from('branches')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        updateResults({
          name: '營業處資料表連線',
          status: 'error',
          message: '無法連線營業處資料表',
          details: error.message,
          suggestion: '檢查 branches 表權限或 RLS 政策'
        });
      } else {
        updateResults({
          name: '營業處資料表連線',
          status: 'success',
          message: '營業處資料表連線正常'
        });
      }
    } catch (error) {
      updateResults({
        name: '營業處資料表連線',
        status: 'error',
        message: '連線異常',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料表是否存在'
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    await testSupabaseConnection();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testDatabaseAccess();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testCompanyDataQuery();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testWritePermissions();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testUpdatePermissions();
    await new Promise(resolve => setTimeout(resolve, 500));

    await testBranchesTable();
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsRunning(false);
  };

  return {
    results,
    isRunning,
    runAllTests
  };
};
