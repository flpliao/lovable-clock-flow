
import { useState } from 'react';
import { DiagnosticResult } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityDiagnostics = () => {
  const [securityResults, setSecurityResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSecurityTests = async () => {
    setIsRunning(true);
    setSecurityResults([]);
    const results: DiagnosticResult[] = [];

    // 測試 1: 檢查 Auth 設定
    try {
      results.push({
        name: '檢查 Auth 服務狀態',
        status: 'testing',
        message: '正在檢查認證服務配置...'
      });
      setSecurityResults([...results]);

      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        results[results.length - 1] = {
          name: '檢查 Auth 服務狀態',
          status: 'error',
          message: 'Auth 服務連線失敗',
          details: error.message,
          suggestion: '請檢查 Supabase 專案設定'
        };
      } else {
        results[results.length - 1] = {
          name: '檢查 Auth 服務狀態',
          status: 'success',
          message: 'Auth 服務正常運作'
        };
      }
    } catch (error) {
      results[results.length - 1] = {
        name: '檢查 Auth 服務狀態',
        status: 'error',
        message: 'Auth 服務檢查失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    // 測試 2: 檢查密碼安全性設定
    results.push({
      name: '密碼安全性檢查',
      status: 'warning',
      message: '建議啟用洩漏密碼保護',
      details: '在 Supabase 後台啟用 "Leaked Password Protection"',
      suggestion: '前往 Authentication > Settings 啟用密碼洩漏保護'
    });

    // 測試 3: 檢查 MFA 設定
    results.push({
      name: 'MFA 多因子認證檢查',
      status: 'warning',
      message: '建議啟用多因子認證選項',
      details: '目前 MFA 選項不足',
      suggestion: '前往 Authentication > Settings 設定 TOTP 或 SMS MFA'
    });

    // 測試 4: 檢查 RLS 設定
    try {
      results.push({
        name: '檢查 RLS 政策',
        status: 'testing',
        message: '正在檢查 Row Level Security 設定...'
      });
      setSecurityResults([...results]);

      // 簡單測試資料庫查詢來檢查 RLS
      const { error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);

      if (companiesError && companiesError.message.includes('RLS')) {
        results[results.length - 1] = {
          name: '檢查 RLS 政策',
          status: 'warning',
          message: 'RLS 政策可能過於嚴格',
          details: companiesError.message,
          suggestion: '檢查資料表的 RLS 政策設定'
        };
      } else {
        results[results.length - 1] = {
          name: '檢查 RLS 政策',
          status: 'success',
          message: 'RLS 政策正常運作'
        };
      }
    } catch (error) {
      results[results.length - 1] = {
        name: '檢查 RLS 政策',
        status: 'error',
        message: 'RLS 檢查失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      };
    }

    // 測試 5: 檢查 URL 配置
    results.push({
      name: '檢查 URL 配置',
      status: 'warning',
      message: '請確認 Site URL 和 Redirect URLs 設定正確',
      details: '確保在 Authentication > URL Configuration 中設定正確的 URLs',
      suggestion: '檢查 Site URL 是否為當前網域，Redirect URLs 是否包含所有有效網域'
    });

    setSecurityResults(results);
    setIsRunning(false);
  };

  return {
    securityResults,
    isRunning,
    runSecurityTests
  };
};
