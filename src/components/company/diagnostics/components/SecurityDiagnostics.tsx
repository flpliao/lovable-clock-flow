
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, ExternalLink } from 'lucide-react';
import { useSecurityDiagnostics } from '../hooks/useSecurityDiagnostics';
import { DiagnosticResults } from './DiagnosticResults';
import { DiagnosticOverallStatus } from './DiagnosticOverallStatus';

export const SecurityDiagnostics: React.FC = () => {
  const { securityResults, isRunning, runSecurityTests } = useSecurityDiagnostics();

  return (
    <Card>
      <CardHeader className="pb-2 px-3">
        <CardTitle className="flex items-center text-sm">
          <Shield className="h-4 w-4 mr-2" />
          安全性診斷工具
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 px-3 pb-3">
        <div className="flex gap-2">
          <Button
            onClick={runSecurityTests}
            disabled={isRunning}
            className="flex-1 text-xs h-8"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                檢查中...
              </>
            ) : (
              <>
                <Shield className="h-3 w-3 mr-2" />
                開始檢查
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open('https://supabase.com/dashboard/project/skfdbxhlbqnoflbczlfu/settings/auth', '_blank')}
            className="text-xs h-8"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            設定
          </Button>
        </div>

        <DiagnosticResults results={securityResults} />

        <DiagnosticOverallStatus results={securityResults} isRunning={isRunning} />

        {securityResults.length > 0 && (
          <Alert className="bg-blue-50 border-blue-200 py-2">
            <AlertDescription className="text-xs">
              <div className="space-y-1">
                <p className="font-medium">建議改進項目：</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>啟用密碼洩漏保護</li>
                  <li>設定多因子認證</li>
                  <li>檢查 URL 設定</li>
                  <li>檢查 RLS 政策</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
