import { ButtonProps } from '@/components/ui/button';
import { ReactNode } from 'react';

// 基礎按鈕屬性接口
export interface BaseButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  children?: ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
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

// 編輯按鈕屬性接口
export interface EditButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 複製按鈕屬性接口
export interface DuplicateButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 刪除按鈕屬性接口
export interface DeleteButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 確認刪除按鈕屬性接口
export interface DeleteConfirmButtonProps extends ClickableLoadingButtonProps {
  buttonText?: string;
}

// 儲存按鈕屬性接口
export interface SaveButtonProps extends ClickableLoadingButtonProps {
  buttonText?: string;
}

// 取消按鈕屬性接口
export interface CancelButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 審核按鈕屬性接口
export interface ApprovalButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

// 審核按鈕組屬性接口
export interface ApprovalButtonsProps {
  onViewDetail?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

// 匯出按鈕屬性接口
export interface ExportButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 匯入按鈕屬性接口
export interface ImportButtonProps extends ClickableButtonProps {
  buttonText?: string;
}

// 通用按鈕屬性接口 - 適用於所有按鈕

// 按鈕變體類型
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

// 按鈕尺寸類型
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// 按鈕狀態類型
export type ButtonState = 'idle' | 'loading' | 'disabled' | 'success' | 'error';

// 按鈕主題類型
export type ButtonTheme = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
