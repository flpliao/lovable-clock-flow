
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';

interface ValidationResultsSectionProps {
  validationResult: {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  };
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

  // Don't show anything if no validation results
  if (validationResult.warnings.length === 0 && validationResult.errors.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">驗證結果</h3>
      <div className="space-y-3">
        {validationResult.errors.map((error, index) => (
          <Alert key={`error-${index}`} variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ))}
        
        {validationResult.warnings.map((warning, index) => (
          <Alert key={`warning-${index}`}>
            <Info className="h-4 w-4" />
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
