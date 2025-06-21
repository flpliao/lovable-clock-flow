
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ValidationResult } from '@/services/leaveValidationService';

interface ValidationResultsSectionProps {
  isValidating: boolean;
  validationResult: ValidationResult | null;
}

export function ValidationResultsSection({ isValidating, validationResult }: ValidationResultsSectionProps) {
  if (!isValidating && !validationResult) {
    return null;
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">
        {isValidating ? '檢查中...' : '表單檢查'}
      </h3>
      
      {isValidating && (
        <div className="flex items-center space-x-2 text-white">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>正在驗證表單...</span>
        </div>
      )}

      {validationResult && (
        <>
          {/* 錯誤提示 */}
          {validationResult.errors.length > 0 && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 警告提示 */}
          {validationResult.warnings.length > 0 && (
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* 成功提示 */}
          {validationResult.isValid && validationResult.errors.length === 0 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                表單驗證通過，可以提交申請
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
