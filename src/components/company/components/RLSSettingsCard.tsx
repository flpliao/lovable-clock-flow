
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Info, Database } from 'lucide-react';
import { useRLSSettings } from '../hooks/useRLSSettings';

export const RLSSettingsCard: React.FC = () => {
  const { 
    isGlobalRLSEnabled, 
    toggleGlobalRLS,
    tableRLSStatus,
    toggleTableRLS,
    loading 
  } = useRLSSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          資料庫安全設定 (RLS)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 全域 RLS 設定 */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center">
            <Database className="h-4 w-4 mr-2" />
            全域 RLS 政策
          </h4>
          
          <Alert className={isGlobalRLSEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
            {isGlobalRLSEnabled ? (
              <Shield className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <AlertDescription className={isGlobalRLSEnabled ? "text-green-700" : "text-yellow-700"}>
              {isGlobalRLSEnabled 
                ? "全域 Row Level Security (RLS) 已啟用，資料存取受到安全政策保護"
                : "全域 Row Level Security (RLS) 已關閉，開發階段模式"
              }
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h5 className="font-medium">全域 RLS 安全政策</h5>
              <p className="text-sm text-gray-500">
                控制所有資料庫表格的行級安全政策
              </p>
            </div>
            <Switch
              checked={isGlobalRLSEnabled}
              onCheckedChange={toggleGlobalRLS}
              disabled={loading}
            />
          </div>
        </div>

        {/* 表格級別 RLS 設定 */}
        <div className="space-y-4">
          <h4 className="font-medium">表格級別 RLS 控制</h4>
          
          <div className="grid gap-3">
            {tableRLSStatus.map((table) => (
              <div key={table.tableName} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h5 className="font-medium">{table.displayName}</h5>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      table.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {table.enabled ? '已啟用' : '已關閉'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{table.description}</p>
                </div>
                <Switch
                  checked={table.enabled}
                  onCheckedChange={() => toggleTableRLS(table.tableName)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 說明資訊 */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>開發建議：</strong>
            <br />
            • <strong>開發階段</strong>：建議關閉相關表格的 RLS 以便於測試和調試
            <br />
            • <strong>正式環境</strong>：必須開啟 RLS 以確保資料安全
            <br />
            • 表格級別的設定可以讓您精確控制哪些資料需要安全保護
            <br />
            • 切換設定後可能需要重新整理頁面
          </AlertDescription>
        </Alert>

        {tableRLSStatus.some(table => !table.enabled) && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700">
              <strong>注意：</strong>部分表格的 RLS 已關閉，這些表格的資料可能對所有用戶開放存取。
              請確保只在開發環境中使用此設定。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
