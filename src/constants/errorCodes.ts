// HTTP 狀態碼常數
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 驗證相關錯誤
export const AUTH_ERROR_CODES = [HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN];

// 檢查是否為驗證錯誤
export const isAuthError = status => {
  return AUTH_ERROR_CODES.includes(status);
};
