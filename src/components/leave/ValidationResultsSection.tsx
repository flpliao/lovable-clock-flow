
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Loader2, CheckCircle } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

interface ValidationResultsSectionProps {
  validationResult: ValidationResult;
  isValidating?: boolean;
}

export function ValidationResultsSection({ validationResult, isValidating = false }: ValidationResultsSectionProps) {
  // Show loading state if validating
  if (isValidating) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center justify-center space-x-2 text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>驗證中...</span>
        </div>
      </div>
    );
  }

  // Don't show anything if no validation results and no errors/warnings
  if (validationResult.warnings.length === 0 && validationResult.errors.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">驗證結果</h3>
      
      <div className="space-y-3">
        {/* 錯誤訊息 */}
        {validationResult.errors.map((error, index) => (
          <Alert key={`error-${index}`} className="bg-red-500/20 border-red-300/30 backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4 text-red-300" />
            <AlertDescription className="text-red-100 font-medium">{error}</AlertDescription>
          </Alert>
        ))}
        
        {/* 警告訊息 */}
        {validationResult.warnings.map((warning, index) => (
          <Alert key={`warning-${index}`} className="bg-yellow-500/20 border-yellow-300/30 backdrop-blur-sm">
            <Info className="h-4 w-4 text-yellow-300" />
            <AlertDescription className="text-yellow-100 font-medium">{warning}</AlertDescription>
          </Alert>
        ))}

        {/* 驗證通過提示 */}
        {validationResult.isValid && validationResult.warnings.length === 0 && validationResult.errors.length === 0 && (
          <Alert className="bg-green-500/20 border-green-300/30 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-300" />
            <AlertDescription className="text-green-100 font-medium">
              申請資料驗證通過
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
