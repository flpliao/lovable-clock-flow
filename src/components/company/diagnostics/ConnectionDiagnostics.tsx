
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wifi, Database, Settings } from 'lucide-react';
import { useDiagnosticTests } from './hooks/useDiagnosticTests';
import { DiagnosticResults } from './components/DiagnosticResults';
import { DiagnosticOverallStatus } from './components/DiagnosticOverallStatus';

export const ConnectionDiagnostics: React.FC = () => {
  const { results, isRunning, runAllTests } = useDiagnosticTests();

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
            onClick={runAllTests}
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

          <DiagnosticResults results={results} />

          <DiagnosticOverallStatus results={results} isRunning={isRunning} />
        </div>
      </CardContent>
    </Card>
  );
};
