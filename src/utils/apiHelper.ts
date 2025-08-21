import { ApiResponseStatus } from '@/constants/api';
import { isAuthError } from '@/constants/errorCodes';
import { toast } from '@/hooks/useToast';
import { ApiResponse, CallApiOptions, DecodedResponse } from '@/types/api';
import { decodeApiResponse } from '@/utils/responseDecoder';

export async function callApiAndDecode(
  promise: Promise<unknown>,
  options: CallApiOptions = {}
): Promise<DecodedResponse> {
  const { onError, showErrorAlert = true, ...decodeOptions } = options;

  try {
    const response = await promise;
    return decodeApiResponse(response as ApiResponse, decodeOptions);
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    const isAuth = isAuthError(error.response?.status);

    // 如果是驗證錯誤，不顯示錯誤訊息（因為會自動跳轉到登入頁面）
    if (showErrorAlert && !isAuth) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    // 執行自定義錯誤處理
    if (onError) {
      onError(error, errorMessage);
    }

    return { status: ApiResponseStatus.ERROR, message: errorMessage };
  }
}

/**
 * 包裝資料為後端要求的格式
 * @param {any} data - 要包裝的資料
 * @returns {object} 包裝後的資料 { data: ... }
 */
export const wrapApiData = data => ({ data });
