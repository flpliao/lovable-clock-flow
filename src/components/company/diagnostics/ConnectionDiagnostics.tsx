
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
  Settings
} from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'testing';
  message: string;
  details?: string;
}

export const ConnectionDiagnostics: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // 1. 測試 Supabase 基本連線
    try {
      console.log('🔍 診斷：測試 Supabase 基本連線...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error && !error.message.includes('session_not_found')) {
        diagnostics.push({
          name: 'Supabase 基本連線',
          status: 'error',
          message: '連線失敗',
          details: error.message
        });
      } else {
        diagnostics.push({
          name: 'Supabase 基本連線',
          status: 'success',
          message: '連線正常'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'Supabase 基本連線',
        status: 'error',
        message: '連線異常',
        details: error instanceof Error ? error.message : '未知錯誤'
      });
    }

    setResults([...diagnostics]);

    // 2. 測試 companies 表存取
    try {
      console.log('🔍 診斷：測試 companies 表存取...');
      const { data, error } = await supabase
        .from('companies')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        diagnostics.push({
          name: 'Companies 表存取',
          status: 'error',
          message: '無法存取',
          details: error.message
        });
      } else {
        diagnostics.push({
          name: 'Companies 表存取',
          status: 'success',
          message: '存取正常'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'Companies 表存取',
        status: 'error',
        message: '存取異常',
        details: error instanceof Error ? error.message : '未知錯誤'
      });
    }

    setResults([...diagnostics]);

    // 3. 測試查詢依美琦公司資料
    try {
      console.log('🔍 診斷：測試查詢依美琦公司資料...');
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', '53907735')
        .maybeSingle();
      
      if (error) {
        diagnostics.push({
          name: '依美琦公司資料查詢',
          status: 'error',
          message: '查詢失敗',
          details: error.message
        });
      } else if (data) {
        diagnostics.push({
          name: '依美琦公司資料查詢',
          status: 'success',
          message: `找到公司資料: ${data.name}`
        });
      } else {
        diagnostics.push({
          name: '依美琦公司資料查詢',
          status: 'error',
          message: '未找到依美琦公司資料',
          details: '資料庫中沒有統一編號 53907735 的公司記錄'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: '依美琦公司資料查詢',
        status: 'error',
        message: '查詢異常',
        details: error instanceof Error ? error.message : '未知錯誤'
      });
    }

    setResults([...diagnostics]);

    // 4. 測試寫入權限
    try {
      console.log('🔍 診斷：測試寫入權限...');
      const testData = {
        name: '測試公司',
        registration_number: 'TEST123456',
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
        diagnostics.push({
          name: '資料寫入權限測試',
          status: 'error',
          message: '寫入失敗',
          details: error.message
        });
      } else {
        // 立即刪除測試資料
        await supabase
          .from('companies')
          .delete()
          .eq('id', data.id);
        
        diagnostics.push({
          name: '資料寫入權限測試',
          status: 'success',
          message: '寫入權限正常'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: '資料寫入權限測試',
        status: 'error',
        message: '測試異常',
        details: error instanceof Error ? error.message : '未知錯誤'
      });
    }

    setResults([...diagnostics]);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          後台連線診斷
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              這個工具會測試前台與後台資料庫的連線狀況，檢查公司資料表的存取權限
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
                正在診斷...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                開始連線診斷
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
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && !isRunning && (
            <Alert className={
              results.every(r => r.status === 'success') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }>
              <AlertDescription>
                {results.every(r => r.status === 'success')
                  ? '✅ 所有連線測試通過！後台與前台同步正常'
                  : '❌ 發現連線問題，請檢查失敗的項目並聯繫技術支援'
                }
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
