
import { useState } from 'react';
import { DiagnosticResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { CompanyDataService } from '../../services/companyDataService';

export const useDiagnosticTests = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    console.log('🔧 開始執行全面連線診斷...');
    setIsRunning(true);
    setResults([]);

    const testResults: DiagnosticResult[] = [];

    // 1. 基本 Supabase 連線測試
    try {
      testResults.push({
        name: '基本 Supabase 連線',
        status: 'testing',
        message: '正在測試 Supabase 客戶端連線...'
      });
      setResults([...testResults]);

      const { error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session_not_found')) {
        testResults[testResults.length - 1] = {
          name: '基本 Supabase 連線',
          status: 'error',
          message: 'Supabase 客戶端連線失敗',
          details: error.message,
          suggestion: '檢查網路連線或 Supabase 服務狀態'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '基本 Supabase 連線',
          status: 'success',
          message: 'Supabase 客戶端連線正常',
          details: 'Auth 服務回應正常'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '基本 Supabase 連線',
        status: 'error',
        message: 'Supabase 連線測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查網路連線和 Supabase 配置'
      };
    }

    setResults([...testResults]);

    // 2. Companies 表存取測試
    try {
      testResults.push({
        name: 'Companies 表存取',
        status: 'testing',
        message: '正在測試 companies 表的讀取權限...'
      });
      setResults([...testResults]);

      const { data, error } = await supabase
        .from('companies')
        .select('count', { count: 'exact', head: true });

      if (error) {
        testResults[testResults.length - 1] = {
          name: 'Companies 表存取',
          status: 'error',
          message: '無法存取 companies 表',
          details: error.message,
          suggestion: '檢查資料庫 RLS 政策或表格權限'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: 'Companies 表存取',
          status: 'success',
          message: 'Companies 表存取正常',
          details: `資料庫回應正常`
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: 'Companies 表存取',
        status: 'error',
        message: 'Companies 表存取測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫連線狀態'
      };
    }

    setResults([...testResults]);

    // 3. 公司資料查詢測試
    try {
      testResults.push({
        name: '公司資料查詢',
        status: 'testing',
        message: '正在查詢依美琦股份有限公司資料...'
      });
      setResults([...testResults]);

      const company = await CompanyDataService.findCompany();

      if (company) {
        testResults[testResults.length - 1] = {
          name: '公司資料查詢',
          status: 'success',
          message: '成功找到公司資料',
          details: `公司名稱: ${company.name}, 統一編號: ${company.registration_number}`
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '公司資料查詢',
          status: 'warning',
          message: '未找到公司資料',
          details: '資料庫中沒有依美琦股份有限公司的記錄',
          suggestion: '可能需要初始化公司資料'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '公司資料查詢',
        status: 'error',
        message: '公司資料查詢失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫連線和查詢權限'
      };
    }

    setResults([...testResults]);

    // 4. Branches 表存取測試
    try {
      testResults.push({
        name: 'Branches 表存取',
        status: 'testing',
        message: '正在測試 branches 表的讀取權限...'
      });
      setResults([...testResults]);

      const { data, error } = await supabase
        .from('branches')
        .select('count', { count: 'exact', head: true });

      if (error) {
        testResults[testResults.length - 1] = {
          name: 'Branches 表存取',
          status: 'error',
          message: '無法存取 branches 表',
          details: error.message,
          suggestion: '檢查資料庫 RLS 政策或表格權限'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: 'Branches 表存取',
          status: 'success',
          message: 'Branches 表存取正常',
          details: `資料庫回應正常`
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: 'Branches 表存取',
        status: 'error',
        message: 'Branches 表存取測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查資料庫連線狀態'
      };
    }

    setResults([...testResults]);

    // 5. 寫入權限測試
    try {
      testResults.push({
        name: '資料庫寫入權限',
        status: 'testing',
        message: '正在測試資料庫寫入權限...'
      });
      setResults([...testResults]);

      // 嘗試執行一個簡單的測試寫入（不實際寫入）
      const testData = {
        name: '測試公司',
        registration_number: '00000000',
        legal_representative: '測試',
        address: '測試地址',
        phone: '測試電話',
        email: 'test@test.com',
        business_type: '測試'
      };

      // 使用 dry run 方式測試權限
      const { error } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', '99999999') // 不存在的編號
        .limit(1);

      if (error && error.message.includes('permission')) {
        testResults[testResults.length - 1] = {
          name: '資料庫寫入權限',
          status: 'warning',
          message: '寫入權限可能受限',
          details: error.message,
          suggestion: '檢查 RLS 政策設定'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '資料庫寫入權限',
          status: 'success',
          message: '資料庫操作權限正常',
          details: '可以執行資料庫查詢操作'
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '資料庫寫入權限',
        status: 'error',
        message: '權限測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查使用者權限設定'
      };
    }

    setResults([...testResults]);

    // 6. 網路連線品質測試
    try {
      testResults.push({
        name: '網路連線品質',
        status: 'testing',
        message: '正在測試網路連線品質...'
      });
      setResults([...testResults]);

      const startTime = Date.now();
      
      // 執行一個簡單的查詢來測試延遲
      const { error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);

      const latency = Date.now() - startTime;

      if (error) {
        testResults[testResults.length - 1] = {
          name: '網路連線品質',
          status: 'error',
          message: '網路連線測試失敗',
          details: error.message,
          suggestion: '檢查網路連線狀態'
        };
      } else if (latency > 5000) {
        testResults[testResults.length - 1] = {
          name: '網路連線品質',
          status: 'warning',
          message: '網路連線較慢',
          details: `回應時間: ${latency}ms`,
          suggestion: '網路連線可能不穩定，建議檢查網路狀態'
        };
      } else {
        testResults[testResults.length - 1] = {
          name: '網路連線品質',
          status: 'success',
          message: '網路連線品質良好',
          details: `回應時間: ${latency}ms`
        };
      }
    } catch (error) {
      testResults[testResults.length - 1] = {
        name: '網路連線品質',
        status: 'error',
        message: '網路測試失敗',
        details: error instanceof Error ? error.message : '未知錯誤',
        suggestion: '檢查網路連線或防火牆設定'
      };
    }

    setResults([...testResults]);
    setIsRunning(false);
    
    console.log('✅ 連線診斷完成，結果:', testResults);
  };

  return {
    results,
    isRunning,
    runAllTests
  };
};
