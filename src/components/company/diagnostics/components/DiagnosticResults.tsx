
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
    <div className="space-y-3">
      <h3 className="font-medium">診斷結果：</h3>
      {results.map((result, index) => (
        <DiagnosticResultItem key={index} result={result} />
      ))}
    </div>
  );
};
