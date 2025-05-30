
import React from 'react';
import { DiagnosticResult } from '../types';
import { DiagnosticResultItem } from './DiagnosticResultItem';

interface DiagnosticResultsProps {
  results: DiagnosticResult[];
}

export const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">診斷結果</h3>
      <div className="space-y-2">
        {results.map((result, index) => (
          <DiagnosticResultItem key={index} result={result} />
        ))}
      </div>
    </div>
  );
};
