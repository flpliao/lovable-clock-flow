import { CancelButton, SaveButton } from '@/components/common/buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'warning' | 'danger';
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title = '確認操作',
  description = '確定要執行此操作嗎？',
  confirmText = '確認',
  cancelText = '取消',
  variant = 'default',
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getIconColor = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'danger':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-blue-500/20 text-blue-500';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'warning':
        return 'default';
      case 'danger':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${getIconColor()} rounded-full flex items-center justify-center`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter>
          <CancelButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </CancelButton>
          <SaveButton type="button" variant={getButtonVariant()} onClick={handleConfirm}>
            {confirmText}
          </SaveButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
