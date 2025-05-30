
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DiagnosticResult, OverallStatus } from '../types';

interface DiagnosticOverallStatusProps {
  results: DiagnosticResult[];
  isRunning: boolean;
}

export const DiagnosticOverallStatus: React.FC<DiagnosticOverallStatusProps> = ({ 
  results, 
  isRunning 
}) => {
  const getOverallStatus = (): OverallStatus | null => {
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

  if (!overallStatus || isRunning) {
    return null;
  }

  return (
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
  );
};
