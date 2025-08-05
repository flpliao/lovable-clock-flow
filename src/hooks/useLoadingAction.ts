import { useState } from 'react';

/**
 * 通用的 loading 狀態管理 hook
 * @param action 要包裝的異步函數
 * @returns 包含 wrappedAction 和 isLoading 的對象
 */
function useLoadingAction<T extends (...args: never[]) => Promise<unknown>>(action: T) {
  const [isLoading, setIsLoading] = useState(false);

  const wrappedAction = async (...args: Parameters<T>): Promise<void> => {
    setIsLoading(true);
    try {
      await action(...args);
    } finally {
      setIsLoading(false);
    }
  };

  return { wrappedAction, isLoading };
}

export default useLoadingAction;
