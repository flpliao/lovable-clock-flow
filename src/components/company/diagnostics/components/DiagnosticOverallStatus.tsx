
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { DiagnosticResult } from '../types';

interface DiagnosticOverallStatusProps {
  results: DiagnosticResult[];
  isRunning: boolean;
}

export const DiagnosticOverallStatus: React.FC<DiagnosticOverallStatusProps> = ({ 
  results, 
  isRunning 
}) => {
  if (isRunning || results.length === 0) {
    return null;
  }

  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const successCount = results.filter(r => r.status === 'success').length;

  const getOverallStatus = () => {
    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warning';
    return 'success';
  };

  const getIcon = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMessage = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'success':
        return `所有測試通過 (${successCount}/${results.length})`;
      case 'warning':
        return `測試完成，發現 ${warningCount} 個警告 (成功: ${successCount}, 警告: ${warningCount}, 錯誤: ${errorCount})`;
      case 'error':
        return `測試完成，發現 ${errorCount} 個錯誤 (成功: ${successCount}, 警告: ${warningCount}, 錯誤: ${errorCount})`;
      default:
        return '測試狀態未知';
    }
  };

  const getAlertVariant = () => {
    const status = getOverallStatus();
    return status === 'error' ? 'destructive' : 'default';
  };

  return (
    <Alert variant={getAlertVariant()}>
      {getIcon()}
      <AlertDescription>
        {getMessage()}
      </AlertDescription>
    </Alert>
  );
};
