// API 回應相關的類型定義

export interface DecodeOptions {
  requiredFields?: string[];
  allowNullData?: boolean;
  expectDataType?: 'any' | 'object' | 'array' | 'string' | 'number';
}

export interface ApiResponse {
  data: {
    status: 'success' | 'error';
    message?: string;
    data: unknown | { data: unknown; [key: string]: unknown };
  };
}

export interface DecodedResponse {
  status: 'success' | 'error';
  message?: string;
  data?: unknown;
}

export interface CallApiOptions {
  onError?: (error: unknown, errorMessage: string) => void;
  showErrorAlert?: boolean;
  requiredFields?: string[];
  allowNullData?: boolean;
  expectDataType?: 'any' | 'object' | 'array' | 'string' | 'number';
}
