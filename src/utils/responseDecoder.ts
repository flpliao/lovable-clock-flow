import { ApiResponse, DecodedResponse, DecodeOptions } from '@/types/api';

function flattenData(data: unknown) {
  while (data && typeof data === 'object' && 'data' in data) {
    data = data.data;
  }
  return data;
}

export function decodeApiResponse(
  response: ApiResponse,
  options: DecodeOptions = {}
): DecodedResponse {
  const {
    requiredFields = [],
    allowNullData = false,
    expectDataType = 'object', // 可為 'any'、'object'、'array'、'string'、'number'
  } = options;

  if (!response?.data) throw new Error('API 回應為空');

  const { status, message, data } = response.data as ApiResponse<unknown>;
  if (status !== 'success') throw new Error(message || '操作失敗');

  if (data === null && !allowNullData) {
    throw new Error('data 為 null，但此 API 不允許');
  }

  if (expectDataType !== 'any' && typeof data !== expectDataType && !Array.isArray(data)) {
    throw new Error(`預期 data 為 ${expectDataType}，實際為 ${typeof data}`);
  }

  for (const field of requiredFields) {
    if (!data || typeof data !== 'object' || !(field in data)) {
      throw new Error(`缺少必要欄位：${field}`);
    }
  }

  return {
    status,
    message,
    data: flattenData(data),
  };
}
