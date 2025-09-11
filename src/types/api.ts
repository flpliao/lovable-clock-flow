// API 回應相關的類型定義
import { ApiResponseStatus } from '@/constants/api';

export interface PaginatedResponse<T> extends ApiResponse<T> {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string;
    label: string;
    active: boolean;
  }[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: ApiResponseStatus;
}

export interface DecodedResponse {
  status: ApiResponseStatus;
  message: string;
  data?: unknown;
  current_page?: number;
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: {
    url: string;
    label: string;
    active: boolean;
  }[];
  next_page_url?: string;
  path?: string;
  per_page?: number;
  prev_page_url?: string;
  to?: number;
  total?: number;
  summary?: unknown;
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
