
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { useSecurityDiagnostics } from '../hooks/useSecurityDiagnostics';
import { DiagnosticResults } from './DiagnosticResults';
import { DiagnosticOverallStatus } from './DiagnosticOverallStatus';

export const SecurityDiagnostics: React.FC = () => {
  const { securityResults, isRunning, runSecurityTests } = useSecurityDiagnostics();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          安全性診斷工具
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              這個工具會檢查應用程式的安全性設定，包括認證服務、密碼政策、MFA 設定等
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              onClick={runSecurityTests}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  正在進行安全性檢查...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  開始安全性診斷
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/skfdbxhlbqnoflbczlfu/settings/auth', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Supabase 設定
            </Button>
          </div>

          <DiagnosticResults results={securityResults} />

          <DiagnosticOverallStatus results={securityResults} isRunning={isRunning} />

          {securityResults.length > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">建議的安全性改進措施：</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>在 Supabase 後台啟用 "Leaked Password Protection"</li>
                    <li>設定 TOTP 或 SMS 多因子認證</li>
                    <li>檢查並更新 Site URL 和 Redirect URLs</li>
                    <li>定期檢查 RLS 政策的安全性</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
