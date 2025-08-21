// API 回應相關的類型定義
import { ApiResponseStatus } from '@/constants/api';

export type ApiResponse<T = unknown> = {
  data: T;
  message: string;
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

export interface DecodeOptions {
  requiredFields?: string[];
  allowNullData?: boolean;
  expectDataType?: 'any' | 'object' | 'array' | 'string' | 'number';
}
