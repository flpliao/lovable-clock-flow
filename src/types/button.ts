import { ButtonProps } from '@/components/ui/button';
import { ReactNode } from 'react';

// 基礎按鈕屬性接口
export interface BaseButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

// 可點擊的按鈕屬性接口
export interface ClickableButtonProps extends BaseButtonProps {
  onClick?: () => void;
}

// 提交按鈕屬性接口
export interface SubmitButtonProps extends BaseButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

// 可點擊且可載入的按鈕屬性接口
export interface ClickableLoadingButtonProps extends ClickableButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

// 新增按鈕屬性接口
export interface AddButtonProps extends ClickableLoadingButtonProps {
  buttonText?: string;
}
