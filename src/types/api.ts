// API 回應相關的類型定義

export enum ApiResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ApiResponse<T = unknown> = {
  data: T;
  status: ApiResponseStatus;
};

export interface DecodedResponse {
  status: ApiResponseStatus;
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
