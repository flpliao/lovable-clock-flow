import { Loader2 } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ButtonLoaderProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * 處理按鈕內容顯示邏輯，支援 loading 狀態
 * @param children 按鈕內容
 * @param isLoading 是否正在載入
 * @param loadingText 載入時的文字
 */
export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  children,
  isLoading = false,
  loadingText,
}) => {
  if (isLoading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || '處理中...'}
      </>
    );
  }

  return <>{children}</>;
};
