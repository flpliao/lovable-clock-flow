import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
import MissedCheckInForm from './components/MissedCheckInForm';

interface MissedCheckInDialogProps {
  onSubmit?: () => void;
}

const MissedCheckInDialog: React.FC<MissedCheckInDialogProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);

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

        <MissedCheckInForm onSuccess={handleSuccess} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default MissedCheckInDialog;
