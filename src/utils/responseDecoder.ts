import { ApiResponseStatus } from '@/constants/api';
import { ApiResponse, DecodedResponse, DecodeOptions, PaginatedResponse } from '@/types/api';

/**
 * 遞歸展平巢狀的 data 結構
 */
function flattenData<T>(data: T): T {
  let current = data;
  while (current && typeof current === 'object' && 'data' in current) {
    current = (current as Record<string, unknown>).data as T;
  }
  return current;
}

/**
 * 驗證 data 類型是否符合預期
 */
function validateDataType(data: unknown, expectDataType: string): void {
  if (expectDataType === 'any') return;

  const actualType = typeof data;
  if (actualType !== expectDataType) {
    throw new Error(`預期 data 為 ${expectDataType}，實際為 ${actualType}`);
  }
}

/**
 * 驗證必要欄位是否存在
 */
function validateRequiredFields(data: unknown, requiredFields: string[]): void {
  if (!requiredFields.length) return;

  if (!data || typeof data !== 'object') {
    throw new Error(`資料類型錯誤，無法驗證必要欄位`);
  }

  for (const field of requiredFields) {
    if (!(field in (data as object))) {
      throw new Error(`缺少必要欄位：${field}`);
    }
  }
}

/**
 * 處理 null/undefined 的 data
 */
function handleNullData(
  data: unknown,
  allowNullData: boolean,
  status: ApiResponseStatus,
  message: string
): DecodedResponse | null {
  if (data !== null && data !== undefined) return null;

  if (!allowNullData) {
    throw new Error('data 為 null 或 undefined，但此 API 不允許');
  }

  return { status, message, data: null };
}

/**
 * 提取分頁相關資訊（如果存在）
 */
function extractPaginationData(
  response: ApiResponse<unknown> | PaginatedResponse<unknown>
): Partial<DecodedResponse> {
  // 檢查是否為分頁回應
  if (!('current_page' in response)) {
    return {};
  }

  const {
    current_page,
    first_page_url,
    from,
    last_page,
    last_page_url,
    links,
    next_page_url,
    path,
    per_page,
    prev_page_url,
    to,
    total,
  } = response as PaginatedResponse<unknown>;

  return {
    current_page,
    first_page_url,
    from,
    last_page,
    last_page_url,
    links,
    next_page_url,
    path,
    per_page,
    prev_page_url,
    to,
    total,
  };
}

/**
 * 解碼 API 回應
 */
export function decodeApiResponse<T = unknown>(
  response: { data?: ApiResponse<T> | PaginatedResponse<T> },
  options: DecodeOptions = {}
): DecodedResponse {
  const { requiredFields = [], allowNullData = true, expectDataType = 'object' } = options;

  // 檢查回應是否存在
  if (!response?.data) {
    throw new Error('API 回應為空');
  }

  const { status, message, data } = response.data as ApiResponse<T>;

  // 檢查狀態
  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(message || '操作失敗');
  }

  // 處理 null data 情況
  const nullResult = handleNullData(data, allowNullData, status, message);
  if (nullResult) return nullResult;

  // 驗證資料類型和必要欄位
  validateDataType(data, expectDataType);
  validateRequiredFields(data, requiredFields);

  // 統一處理回應，自動包含分頁資訊（如果存在）
  return {
    status,
    message,
    data: flattenData(data),
    ...extractPaginationData(response.data),
  };
}
