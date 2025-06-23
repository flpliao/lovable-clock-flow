
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

interface ValidationResultsSectionProps {
  validationResult: {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  };
}

export function ValidationResultsSection({ validationResult }: ValidationResultsSectionProps) {
  if (validationResult.warnings.length === 0 && validationResult.errors.length === 0) {
    return null;
  }

  return (
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
  );
}
