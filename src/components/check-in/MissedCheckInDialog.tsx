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
  hasCheckInToday: boolean;
}

const MissedCheckInDialog: React.FC<MissedCheckInDialogProps> = ({ onSubmit, hasCheckInToday }) => {
  const [open, setOpen] = useState(false);

  // 根據當前打卡狀態智能判斷預設申請類型
  const getDefaultRequestType = (): RequestType => {
    if (!hasCheckInToday) {
      return RequestType.CHECK_IN; // 沒有上班卡，預設申請上班打卡
    } else return RequestType.CHECK_OUT; // 有上班卡但沒有下班卡，預設申請下班打卡
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccess = () => {
    handleClose();
    onSubmit?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          defaultRequestType={getDefaultRequestType()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckInDialog;
