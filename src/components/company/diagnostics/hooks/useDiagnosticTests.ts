
import { useState } from 'react';
import { DiagnosticResult } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useDiagnosticTests = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    const testResults: DiagnosticResult[] = [];

    // 測試 1: 基本連線測試
    try {
      testResults.push({
        name: '基本連線測試',
        status: 'testing',
        message: '正在測試 Supabase 連線...'
      });
      setResults([...testResults]);

      const { error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session_not_found')) {
        testResults[testResults.length - 1] = {
          name: '基本連線測試',
          status: 'error',
          message: 'Supabase 連線失敗',
          details: error.message,
          suggestion: '請檢查網路連線或 Supabase 設定'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '基本連線測試',
          status: 'success',
          message: 'Supabase 連線正常'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '基本連線測試',
        status: 'error',
        message: '連線測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    // 測試 2: 資料庫查詢測試
    try {
      testResults.push({
        name: '資料庫查詢測試',
        status: 'testing',
        message: '正在測試資料庫查詢能力...'
      });
      setResults([...testResults]);

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('count', { count: 'exact', head: true });

      if (companiesError) {
        testResults[testResults.length - 1] = {
          name: '資料庫查詢測試',
          status: 'error',
          message: '資料庫查詢失敗',
          details: companiesError.message,
          suggestion: '檢查資料表是否存在以及權限設定'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '資料庫查詢測試',
          status: 'success',
          message: '資料庫查詢正常'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '資料庫查詢測試',
        status: 'error',
        message: '查詢測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    // 測試 3: 員工資料表權限測試
    try {
      testResults.push({
        name: '員工資料表權限測試',
        status: 'testing',
        message: '正在測試員工資料表存取權限...'
      });
      setResults([...testResults]);

      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('count', { count: 'exact', head: true });

      if (staffError) {
        if (staffError.message.includes('RLS')) {
          testResults[testResults.length - 1] = {
            name: '員工資料表權限測試',
            status: 'warning',
            message: 'RLS 政策限制存取',
            details: staffError.message,
            suggestion: '這是正常的，RLS 政策正在保護資料'
          };
        } else {
          testResults[testResults.length - 1] = {
            name: '員工資料表權限測試',
            status: 'error',
            message: '員工資料表存取失敗',
            details: staffError.message,
            suggestion: '檢查 staff 資料表是否存在'
          };
        }
      } else {
        testResults[testResults.length - 1] = {
          name: '員工資料表權限測試',
          status: 'success',
          message: '員工資料表存取正常'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '員工資料表權限測試',
        status: 'error',
        message: '權限測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    // 測試 4: 營業處資料表測試
    try {
      testResults.push({
        name: '營業處資料表測試',
        status: 'testing',
        message: '正在測試營業處資料表...'
      });
      setResults([...testResults]);

      const { data: branches, error: branchesError } = await supabase
        .from('branches')
        .select('count', { count: 'exact', head: true });

      if (branchesError) {
        testResults[testResults.length - 1] = {
          name: '營業處資料表測試',
          status: 'error',
          message: '營業處資料表存取失敗',
          details: branchesError.message,
          suggestion: '檢查 branches 資料表設定'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '營業處資料表測試',
          status: 'success',
          message: '營業處資料表正常'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '營業處資料表測試',
        status: 'error',
        message: '營業處測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    setResults(testResults);
    setIsRunning(false);
  };

  return {
    results,
    isRunning,
    runAllTests
  };
};
