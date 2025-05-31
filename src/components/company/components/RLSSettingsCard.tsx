
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
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          資料庫安全設定 (RLS)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 px-3 sm:px-6 pb-4">
        {/* 全域 RLS 設定 */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center text-sm sm:text-base">
            <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            全域 RLS 政策
          </h4>
          
          <Alert className={`${isGlobalRLSEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"} py-2`}>
            {isGlobalRLSEnabled ? (
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            )}
            <AlertDescription className={`${isGlobalRLSEnabled ? "text-green-700" : "text-yellow-700"} text-xs sm:text-sm`}>
              {isGlobalRLSEnabled 
                ? "RLS 已啟用，資料存取受到安全政策保護"
                : "RLS 已關閉，開發階段模式"
              }
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <h5 className="font-medium text-sm">全域 RLS 安全政策</h5>
              <p className="text-xs text-gray-500">
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
        <div className="space-y-3">
          <h4 className="font-medium text-sm sm:text-base">表格級別 RLS 控制</h4>
          
          <div className="grid gap-2">
            {tableRLSStatus.map((table) => (
              <div key={table.tableName} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center">
                    <h5 className="font-medium text-xs sm:text-sm truncate">{table.displayName}</h5>
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded flex-shrink-0 ${
                      table.enabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {table.enabled ? '已啟用' : '已關閉'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{table.description}</p>
                </div>
                <Switch
                  checked={table.enabled}
                  onCheckedChange={() => toggleTableRLS(table.tableName)}
                  disabled={loading}
                  className="ml-2 flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 簡化說明資訊 */}
        <Alert className="py-2">
          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertDescription className="text-xs sm:text-sm">
            <strong>使用說明：</strong>
            開發階段建議關閉 RLS 以便測試，正式環境必須開啟以確保資料安全。
          </AlertDescription>
        </Alert>

        {tableRLSStatus.some(table => !table.enabled) && (
          <Alert className="bg-orange-50 border-orange-200 py-2">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            <AlertDescription className="text-orange-700 text-xs sm:text-sm">
              <strong>注意：</strong>部分表格的 RLS 已關閉，請確保只在開發環境中使用。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
