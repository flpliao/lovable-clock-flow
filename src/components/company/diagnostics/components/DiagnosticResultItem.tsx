
import React from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { DiagnosticResult } from '../types';

interface DiagnosticResultItemProps {
  result: DiagnosticResult;
}

export const DiagnosticResultItem: React.FC<DiagnosticResultItemProps> = ({ result }) => {
  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg">
      {getStatusIcon(result.status)}
      <div className="flex-1 min-w-0">
        <div className="font-medium">{result.name}</div>
        <div className="text-sm text-gray-600">{result.message}</div>
        {result.details && (
          <div className="text-xs text-gray-500 mt-1 break-words">
            <strong>詳細資訊：</strong> {result.details}
          </div>
        )}
        {result.suggestion && (
          <div className="text-xs text-blue-600 mt-1 break-words">
            <strong>建議：</strong> {result.suggestion}
          </div>
        )}
      </div>
    </div>
  );
};
