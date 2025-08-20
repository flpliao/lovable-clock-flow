import { Button } from '@/components/ui/button';
import { ApprovalButton, ApprovalButtonsProps } from '@/types/button';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import React from 'react';

const ApprovalButtons: React.FC<ApprovalButtonsProps> = ({
  onViewDetail,
  onApprove,
  onReject,
  className = '',
  size = 'sm',
  disabled = false,
}) => {
  const buttons: ApprovalButton[] = [];

  // 只有傳入對應的事件才添加按鈕
  if (onViewDetail) {
    buttons.push({
      label: '查看',
      onClick: onViewDetail,
      icon: <Eye className="h-4 w-4 mr-2" />,
      className: 'bg-blue-500 hover:bg-blue-600 text-white border-0',
      size,
      disabled,
    });
  }

  if (onApprove) {
    buttons.push({
      label: '核准',
      onClick: onApprove,
      icon: <CheckCircle className="h-4 w-4 mr-2" />,
      className: 'bg-green-500 hover:bg-green-600 text-white border-0',
      size,
      disabled,
    });
  }

  if (onReject) {
    buttons.push({
      label: '拒絕',
      onClick: onReject,
      icon: <XCircle className="h-4 w-4 mr-2" />,
      variant: 'destructive',
      size,
      disabled,
    });
  }

  // 如果沒有按鈕要顯示，返回 null
  if (buttons.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.variant || 'default'}
          size={button.size || 'default'}
          disabled={button.disabled}
          className={button.className}
        >
          {button.icon}
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default ApprovalButtons;
