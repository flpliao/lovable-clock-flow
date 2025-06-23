
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import MissedCheckinFormFields from './components/MissedCheckinFormFields';
import { useMissedCheckinForm } from './hooks/useMissedCheckinForm';

interface MissedCheckinDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

const MissedCheckinDialog: React.FC<MissedCheckinDialogProps> = ({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange, 
  onSuccess 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;
  
  const {
    formData,
    loading,
    updateFormData,
    submitForm,
    resetForm
  } = useMissedCheckinForm(() => {
    setOpen(false);
    onSuccess();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const DialogComponent = isControlled ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            忘記打卡申請
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MissedCheckinFormFields
            formData={formData}
            onFormDataChange={updateFormData}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交申請'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ) : (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <MissedCheckinFormFields
            formData={formData}
            onFormDataChange={updateFormData}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交申請'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return DialogComponent;
};

export default MissedCheckinDialog;
