
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  Loader2,
  Wifi,
  Database,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'testing' | 'warning';
  message: string;
  details?: string;
  suggestion?: string;
}

export const ConnectionDiagnostics: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateResults = (newResult: DiagnosticResult) => {
    setResults(prev => [...prev, newResult]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // 1. 測試 Supabase 基本連線
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

    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. 測試資料庫存取權限
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

    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. 測試查詢依美琦公司資料
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

    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. 測試寫入權限
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

    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. 測試更新權限
    try {
      console.log('🔍 診斷：測試更新權限...');
      // 先創建測試資料
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
        // 嘗試更新
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

    await new Promise(resolve => setTimeout(resolve, 500));

    // 6. 測試營業處資料表連線
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

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  const getOverallStatus = () => {
    if (results.length === 0) return null;
    
    const hasErrors = results.some(r => r.status === 'error');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    if (hasErrors) {
      return {
        type: 'error',
        message: '❌ 發現連線問題，已修復 RLS 政策，請重新測試'
      };
    } else if (hasWarnings) {
      return {
        type: 'warning',
        message: '⚠️ 部分功能可能受限，建議檢查警告項目'
      };
    } else {
      return {
        type: 'success',
        message: '✅ 所有連線測試通過！系統運作正常'
      };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          後台連線診斷工具
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              這個工具會全面測試前台與後台資料庫的連線狀況，包括基本連線、權限檢查、資料查詢和寫入測試
            </AlertDescription>
          </Alert>

          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                正在診斷連線狀況...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                開始全面連線診斷
              </>
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">診斷結果：</h3>
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                    {result.details && (
                      <div className="text-xs text-gray-500 mt-1 break-words">
                        <strong>詳細資訊：</strong> {result.details}
                      </div>
                    )}
                    {result.suggestion && (
                      <div className="text-xs text-blue-600 mt-1 break-words">
                        <strong>建議：</strong> {result.suggestion}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {overallStatus && !isRunning && (
            <Alert className={
              overallStatus.type === 'success' 
                ? 'bg-green-50 border-green-200' 
                : overallStatus.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }>
              <AlertDescription>
                {overallStatus.message}
                {overallStatus.type === 'error' && (
                  <div className="mt-2 text-sm">
                    如果問題持續，請聯繫技術支援協助解決
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
