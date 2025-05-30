
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { DiagnosticResult } from '../types';

interface DiagnosticResultItemProps {
  result: DiagnosticResult;
}

export const DiagnosticResultItem: React.FC<DiagnosticResultItemProps> = ({ result }) => {
  const getIcon = () => {
    switch (result.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (result.status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'testing':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className={getBackgroundColor()}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">{result.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            {result.details && (
              <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
                {result.details}
              </p>
            )}
            {result.suggestion && (
              <p className="text-xs text-blue-600 mt-2">
                建議：{result.suggestion}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
