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
import { CheckCircle } from 'lucide-react';

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  approveComment?: string;
  onApproveCommentChange?: (comment: string) => void;
}

const ApproveDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  title = '確認核准',
  description = '確定要核准此申請嗎？',
  approveComment = '',
  onApproveCommentChange,
}: ApproveDialogProps) => {
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
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <DialogTitle className="text-base">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* 核准原因輸入框 */}
        {onApproveCommentChange && (
          <div className="space-y-2">
            <label htmlFor="approve-comment" className="text-sm text-muted-foreground">
              註解
            </label>
            <textarea
              id="approve-comment"
              value={approveComment}
              onChange={e => onApproveCommentChange(e.target.value)}
              placeholder="如需要，請在此填寫註解"
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
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            loadingText="核准中..."
          >
            核准
          </SaveButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveDialog;
