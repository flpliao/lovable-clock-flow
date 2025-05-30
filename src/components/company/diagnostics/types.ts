
export interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'testing' | 'warning';
  message: string;
  details?: string;
  suggestion?: string;
}

export interface OverallStatus {
  type: 'success' | 'error' | 'warning';
  message: string;
}
