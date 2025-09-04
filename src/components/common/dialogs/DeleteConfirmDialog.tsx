import { CancelButton, DeleteConfirmButton } from '@/components/common/buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useLoadingAction from '@/hooks/useLoadingAction';
import { AlertTriangle } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

const DeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  title = '確認刪除',
  description = '確定要刪除此項目嗎？此操作無法復原。',
}: DeleteDialogProps) => {
  const { wrappedAction: handleConfirm, isLoading } = useLoadingAction(async () => {
    const result = await onConfirm();
    if (result) {
      onOpenChange(false);
      onSuccess?.();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
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
          <CancelButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          />
          <DeleteConfirmButton
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
