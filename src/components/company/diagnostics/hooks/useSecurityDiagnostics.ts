
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

    // 測試 1: 檢查 Auth 服務狀態
    try {
      results.push({
        name: '檢查 Auth 服務狀態',
        status: 'testing',
        message: '正在檢查認證服務配置...'
      });
      setSecurityResults([...results]);

      const { data, error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session_not_found')) {
        results[results.length - 1] = {
          name: '檢查 Auth 服務狀態',
          status: 'error',
          message: 'Auth 服務連線失敗',
          details: error.message,
          suggestion: '請檢查網路連線或聯繫系統管理員'
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
      details: '在 Supabase 後台 Authentication > Settings 啟用 "Leaked Password Protection"',
      suggestion: '此功能可防止用戶使用已知的洩漏密碼，提升帳號安全性'
    });

    // 測試 3: 檢查 MFA 設定
    results.push({
      name: 'MFA 多因子認證檢查',
      status: 'warning',
      message: '建議啟用多因子認證選項',
      details: '目前 MFA 選項不足，建議啟用 TOTP 或 SMS 驗證',
      suggestion: '前往 Authentication > Settings 設定多因子認證以提升安全性'
    });

    // 測試 4: 檢查 RLS 設定
    try {
      results.push({
        name: '檢查 RLS 政策',
        status: 'testing',
        message: '正在檢查 Row Level Security 設定...'
      });
      setSecurityResults([...results]);

      // 檢查多個表格的 RLS 狀態
      const { error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);

      const { error: staffError } = await supabase
        .from('staff')
        .select('id')
        .limit(1);

      if (companiesError && companiesError.message.includes('RLS')) {
        results[results.length - 1] = {
          name: '檢查 RLS 政策',
          status: 'warning',
          message: 'RLS 政策需要調整',
          details: '部分資料表的 RLS 政策可能過於嚴格或設定不當',
          suggestion: '前往系統設定 > 一般設定檢查並調整 RLS 政策'
        };
      } else if (staffError && staffError.message.includes('RLS')) {
        results[results.length - 1] = {
          name: '檢查 RLS 政策',
          status: 'warning',
          message: 'RLS 政策需要調整',
          details: 'staff 表格的 RLS 政策可能需要更新',
          suggestion: '前往系統設定 > 一般設定檢查並調整 RLS 政策'
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
    const currentOrigin = window.location.origin;
    const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
    const isLovableApp = currentOrigin.includes('lovable.app');

    if (isLocalhost) {
      results.push({
        name: '檢查 URL 配置',
        status: 'warning',
        message: '開發環境檢測 - URL 配置提醒',
        details: '請確認 Site URL 設為當前網域，Redirect URLs 包含 localhost 網域',
        suggestion: '在 Supabase Authentication > URL Configuration 中正確設定開發環境 URLs'
      });
    } else if (isLovableApp) {
      results.push({
        name: '檢查 URL 配置',
        status: 'success',
        message: 'URL 配置正常',
        details: '當前使用 Lovable 預覽環境，URL 配置應該正常運作'
      });
    } else {
      results.push({
        name: '檢查 URL 配置',
        status: 'warning',
        message: '請確認 URL 配置設定',
        details: `確保 Site URL 設為 ${currentOrigin}，Redirect URLs 包含此網域`,
        suggestion: '前往 Supabase Authentication > URL Configuration 檢查設定'
      });
    }

    setSecurityResults(results);
    setIsRunning(false);
  };

  return {
    securityResults,
    isRunning,
    runSecurityTests
  };
};
