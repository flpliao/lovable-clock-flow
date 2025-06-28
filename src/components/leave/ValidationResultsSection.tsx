
import React from 'react';
import { AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  hasHireDate?: boolean;
  userStaffData?: any;
}

interface ValidationResultsSectionProps {
  isValidating?: boolean;
  validationResult: ValidationResult;
}

export function ValidationResultsSection({ 
  isValidating = false, 
  validationResult 
}: ValidationResultsSectionProps) {
  
  if (isValidating) {
    return (
      <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-300 animate-spin" />
          <div>
            <h4 className="text-blue-100 font-semibold">驗證中...</h4>
            <p className="text-blue-200 text-sm mt-1">正在檢查請假申請資料</p>
          </div>
        </div>
      </div>
    );
  }

  const { errors = [], warnings = [], isValid } = validationResult;

  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 錯誤訊息 */}
      {errors.length > 0 && (
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-red-100 font-semibold">申請驗證失敗</h4>
              <div className="space-y-1 mt-2">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-200 text-sm">• {error}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 警告訊息 */}
      {warnings.length > 0 && (
        <div className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-yellow-100 font-semibold">請注意</h4>
              <div className="space-y-1 mt-2">
                {warnings.map((warning, index) => (
                  <p key={index} className="text-yellow-200 text-sm">• {warning}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 驗證通過 */}
      {isValid && warnings.length > 0 && (
        <div className="backdrop-blur-xl bg-green-500/20 border border-green-300/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-300" />
            <div>
              <h4 className="text-green-100 font-semibold">申請資料驗證通過</h4>
              <p className="text-green-200 text-sm mt-1">請確認以上注意事項後提交申請</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
