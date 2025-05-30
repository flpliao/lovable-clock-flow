
export interface DiagnosticResult {
  name: string;
  status: 'success' | 'warning' | 'error' | 'testing';
  message: string;
  details?: string;
  suggestion?: string;
}
