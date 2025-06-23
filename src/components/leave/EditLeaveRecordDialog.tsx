
import React from 'react';
import { LeaveRequest } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EditLeaveFormFields } from './EditLeaveFormFields';
import { useEditLeaveForm } from '@/hooks/useEditLeaveForm';

interface EditLeaveRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRecord: LeaveRequest | null;
  onSave: (leaveId: string, updateData: Partial<LeaveRequest>) => Promise<boolean>;
  loading: boolean;
}

export const EditLeaveRecordDialog: React.FC<EditLeaveRecordDialogProps> = ({
  isOpen,
  onClose,
  leaveRecord,
  onSave,
  loading
}) => {
  const {
    formData,
    startDateObj,
    endDateObj,
    handleFormDataChange,
    handleStartDateChange,
    handleEndDateChange
  } = useEditLeaveForm(leaveRecord);

  const handleSave = async () => {
    if (!leaveRecord) return;
    
    const success = await onSave(leaveRecord.id, {
      ...formData,
      start_date: formData.start_date,
      end_date: formData.end_date
    });
    
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>編輯請假記錄</DialogTitle>
        </DialogHeader>
        
        <EditLeaveFormFields
          formData={formData}
          startDateObj={startDateObj}
          endDateObj={endDateObj}
          onFormDataChange={handleFormDataChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? '儲存中...' : '儲存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
