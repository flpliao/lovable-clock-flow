import { ReactNode } from 'react';

/**
 * 根據 children 是否存在來決定顯示內容
 * @param children 自定義內容
 * @param defaultContent 預設內容
 * @param loading 是否正在載入
 * @param loadingText 載入時的文字
 * @returns 要顯示的內容
 */
export const getButtonContent = (
  children: ReactNode | undefined,
  defaultContent: ReactNode,
  loading: boolean = false,
  loadingText?: string
): ReactNode => {
  if (loading) {
    return loadingText || '處理中...';
  }

  return children ? children : defaultContent;
};
