import { CancelButton, SaveButton } from '@/components/common/buttons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useLoadingAction from '@/hooks/useLoadingAction';
import { XCircle } from 'lucide-react';

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  rejectionReason?: string;
  onRejectionReasonChange?: (reason: string) => void;
}

const RejectDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  title = '確認拒絕',
  description = '確定要拒絕此申請嗎？請填寫拒絕原因。',
  rejectionReason = '',
  onRejectionReasonChange,
}: RejectDialogProps) => {
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
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-base">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 拒絕原因輸入框 */}
        {onRejectionReasonChange && (
          <div className="space-y-2">
            <label htmlFor="rejection-reason" className="text-sm text-muted-foreground">
              拒絕理由 (必填)
            </label>
            <textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={e => onRejectionReasonChange(e.target.value)}
              placeholder="請填寫拒絕理由"
              className="w-full min-h-[80px] p-3 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        )}

        <DialogFooter>
          <CancelButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          />
          <SaveButton
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || (onRejectionReasonChange && !rejectionReason.trim())}
            className="bg-red-500 hover:bg-red-600"
            loadingText="拒絕中..."
            isLoading={isLoading}
          >
            確定
          </SaveButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
