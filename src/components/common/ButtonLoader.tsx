import { Loader2 } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ButtonLoaderProps {
  children?: ReactNode;
  defaultContent: ReactNode;
  loading?: boolean;
  loadingText?: string;
}

/**
 * 處理按鈕內容顯示邏輯，支援 loading 狀態
 * @param children 自定義內容
 * @param defaultContent 預設內容
 * @param loading 是否正在載入
 * @param loadingText 載入時的文字
 */
export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  children,
  defaultContent,
  loading = false,
  loadingText,
}) => {
  if (loading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || '處理中...'}
      </>
    );
  }

  return <>{children ? children : defaultContent}</>;
};
