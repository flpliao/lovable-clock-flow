import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RequestType } from '@/constants/checkInTypes';
import { Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
import MissedCheckInForm from './MissedCheckInForm';

interface MissedCheckInDialogProps {
  onSubmit?: () => void;
  // 當前打卡狀態
  type: RequestType;
  // 新增：自動帶入參數
  defaultDate?: Date;
  defaultTime?: string;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  // 新增：外部控制
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean; // 是否顯示觸發按鈕
}

const MissedCheckInDialog: React.FC<MissedCheckInDialogProps> = ({
  onSubmit,
  type,
  defaultDate,
  defaultTime,
  scheduleStartTime,
  scheduleEndTime,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  showTrigger = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // 使用外部控制或內部狀態
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
    onSubmit?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 whitespace-nowrap"
          >
            <Clock className="h-4 w-4 mr-1" />
            忘記打卡
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            忘記打卡申請
          </DialogTitle>
        </DialogHeader>

        <MissedCheckInForm
          onSuccess={handleSuccess}
          onCancel={handleClose}
          defaultRequestType={type}
          defaultDate={defaultDate}
          defaultTime={defaultTime}
          scheduleStartTime={scheduleStartTime}
          scheduleEndTime={scheduleEndTime}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckInDialog;
