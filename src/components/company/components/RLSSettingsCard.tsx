
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Settings, Check, X } from 'lucide-react';
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
      <CardHeader className="pb-2 px-3">
        <CardTitle className="flex items-center text-sm">
          <Shield className="h-4 w-4 mr-2" />
          資料庫安全 (RLS)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 px-3 pb-3">
        {/* 全域設定 */}
        <div className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-2" />
            <span className="text-xs font-medium">全域政策</span>
            {isGlobalRLSEnabled ? (
              <Check className="h-3 w-3 ml-2 text-green-500" />
            ) : (
              <X className="h-3 w-3 ml-2 text-red-500" />
            )}
          </div>
          <Switch
            checked={isGlobalRLSEnabled}
            onCheckedChange={toggleGlobalRLS}
            disabled={loading}
          />
        </div>

        {/* 表格設定 */}
        <div className="space-y-1">
          {tableRLSStatus.map((table) => (
            <div key={table.tableName} className="flex items-center justify-between p-2 border rounded text-xs">
              <div className="flex items-center min-w-0 flex-1">
                <span className="truncate">{table.displayName}</span>
                {table.enabled ? (
                  <Check className="h-3 w-3 ml-2 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-3 w-3 ml-2 text-gray-400 flex-shrink-0" />
                )}
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

        {/* 狀態提示 */}
        {!isGlobalRLSEnabled && (
          <Alert className="py-2">
            <X className="h-3 w-3" />
            <AlertDescription className="text-xs">
              開發模式：安全政策已關閉
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
