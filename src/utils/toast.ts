import type { ToastActionElement } from '@/components/ui/toast';
import { toast as baseToast } from '@/hooks/useToast';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: ToastActionElement;
}

/**
 * 通用 Toast 工具類
 * 提供多種 toast 提示樣式和功能
 */
export class Toast {
  /**
   * 顯示成功提示
   */
  static success(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { description: options } : options;

    return baseToast({
      variant: 'default',
      title: config.title || '成功',
      description: config.description || '操作已完成',
      duration: config.duration || 3000,
      action: config.action,
      className: 'bg-green-50 border-green-200 text-green-800',
    });
  }

  /**
   * 顯示錯誤提示
   */
  static error(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { description: options } : options;

    return baseToast({
      variant: 'destructive',
      title: config.title || '錯誤',
      description: config.description || '發生未知錯誤',
      duration: config.duration || 5000,
      action: config.action,
    });
  }

  /**
   * 顯示警告提示
   */
  static warning(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { description: options } : options;

    return baseToast({
      variant: 'default',
      title: config.title || '警告',
      description: config.description || '請注意以下問題',
      duration: config.duration || 4000,
      action: config.action,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    });
  }

  /**
   * 顯示資訊提示
   */
  static info(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { description: options } : options;

    return baseToast({
      variant: 'default',
      title: config.title || '資訊',
      description: config.description || '請查看以下資訊',
      duration: config.duration || 3000,
      action: config.action,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
    });
  }

  /**
   * 顯示網路錯誤提示
   */
  static networkError(options?: Omit<ToastOptions, 'title'>) {
    return this.error({
      title: '網路連線錯誤',
      description: options?.description || '無法連接到伺服器，請檢查網路連線',
      duration: options?.duration || 6000,
      action: options?.action,
    });
  }

  /**
   * 顯示權限錯誤提示
   */
  static permissionError(options?: Omit<ToastOptions, 'title'>) {
    return this.error({
      title: '權限不足',
      description: options?.description || '您沒有執行此操作的權限',
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * 顯示驗證錯誤提示
   */
  static validationError(options?: Omit<ToastOptions, 'title'>) {
    return this.warning({
      title: '資料驗證錯誤',
      description: options?.description || '請檢查輸入的資料是否正確',
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }

  /**
   * 顯示 API 錯誤提示
   */
  static apiError(error: unknown, options?: Omit<ToastOptions, 'title' | 'description'>) {
    let errorMessage = 'API 請求失敗';

    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { data?: { message?: string } } }).response;
      if (response?.data?.message) {
        errorMessage = response.data.message;
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as { message: unknown }).message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return this.error({
      title: 'API 錯誤',
      description: errorMessage,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * 顯示資料載入錯誤提示
   */
  static loadError(resource: string, options?: Omit<ToastOptions, 'title' | 'description'>) {
    return this.error({
      title: '載入失敗',
      description: `無法載入${resource}，請稍後重試`,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * 顯示儲存錯誤提示
   */
  static saveError(resource: string, options?: Omit<ToastOptions, 'title' | 'description'>) {
    return this.error({
      title: '儲存失敗',
      description: `無法儲存${resource}，請稍後重試`,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * 顯示刪除錯誤提示
   */
  static deleteError(resource: string, options?: Omit<ToastOptions, 'title' | 'description'>) {
    return this.error({
      title: '刪除失敗',
      description: `無法刪除${resource}，請稍後重試`,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * 顯示自訂錯誤提示（帶重試按鈕）
   */
  static withRetry(options: ToastOptions, _retryFn: () => void, _retryLabel: string = '重試') {
    // 注意：這裡需要傳入 React 組件，不能在純 TypeScript 中使用
    // 建議在 React 組件中使用 toast 直接創建帶重試按鈕的 toast
    return this.error({
      ...options,
      description: `${options.description}\n\n點擊重試按鈕重新執行操作`,
    });
  }

  /**
   * 顯示錯誤提示（帶詳細資訊）
   * 注意：此方法將詳細資訊直接顯示在描述中，不支援展開/收合功能
   * 如果需要互動式詳細資訊，請在 React 組件中自訂實現
   */
  static withDetails(
    title: string,
    shortDescription: string,
    fullDescription: string,
    options?: Omit<ToastOptions, 'title' | 'description'>
  ) {
    return this.error({
      title,
      description: `${shortDescription}\n\n詳細資訊：${fullDescription}`,
      duration: options?.duration || 8000,
      action: options?.action,
    });
  }
}

/**
 * 簡化的 Toast 函數
 */
export const showSuccess = (message: string, title?: string) => {
  return Toast.success({
    title: title || '成功',
    description: message,
  });
};

export const showError = (message: string, title?: string) => {
  return Toast.error({
    title: title || '錯誤',
    description: message,
  });
};

export const showWarning = (message: string, title?: string) => {
  return Toast.warning({
    title: title || '警告',
    description: message,
  });
};

export const showInfo = (message: string, title?: string) => {
  return Toast.info({
    title: title || '資訊',
    description: message,
  });
};

export const showApiError = (error: unknown) => {
  return Toast.apiError(error);
};

export const showNetworkError = () => {
  return Toast.networkError();
};

export const showPermissionError = () => {
  return Toast.permissionError();
};

export const showValidationError = (message?: string) => {
  return Toast.validationError({
    description: message || '請檢查輸入的資料是否正確',
  });
};

export default Toast;
