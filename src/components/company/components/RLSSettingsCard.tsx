
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { useRLSSettings } from '../hooks/useRLSSettings';

export const RLSSettingsCard: React.FC = () => {
  const { isRLSEnabled, loading, toggleRLS } = useRLSSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          資料庫安全設定 (RLS)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className={isRLSEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
          {isRLSEnabled ? (
            <Shield className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          <AlertDescription className={isRLSEnabled ? "text-green-700" : "text-yellow-700"}>
            {isRLSEnabled 
              ? "Row Level Security (RLS) 已啟用，資料存取受到安全政策保護"
              : "Row Level Security (RLS) 已關閉，開發階段模式"
            }
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">RLS 安全政策</h4>
            <p className="text-sm text-gray-500">
              控制資料庫的行級安全政策
            </p>
          </div>
          <Switch
            checked={isRLSEnabled}
            onCheckedChange={toggleRLS}
            disabled={loading}
          />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>開發建議：</strong>
            <br />
            • <strong>開發階段</strong>：建議關閉 RLS 以便於測試和調試
            <br />
            • <strong>正式環境</strong>：必須開啟 RLS 以確保資料安全
            <br />
            • 切換設定後可能需要重新整理頁面
          </AlertDescription>
        </Alert>

        {!isRLSEnabled && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700">
              <strong>注意：</strong>RLS 已關閉，所有用戶都可以存取所有資料。
              請確保只在開發環境中使用此設定。
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
