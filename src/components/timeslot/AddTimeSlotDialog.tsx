
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { CreateTimeSlot } from '@/services/timeSlotService';
import { useTimeSlotForm, TimeSlotFormData } from './hooks/useTimeSlotForm';
import TimeSlotFormFields from './components/TimeSlotFormFields';
import TimeSlotDialogActions from './components/TimeSlotDialogActions';

interface AddTimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CreateTimeSlot, 'created_by'>) => void;
}

const AddTimeSlotDialog = ({ open, onOpenChange, onSubmit }: AddTimeSlotDialogProps) => {
  const { form, validateTimeSlot, resetForm } = useTimeSlotForm();

  const handleSubmit = (data: TimeSlotFormData) => {
    console.log('Form submission data:', data);
    
    if (!validateTimeSlot(data)) {
      return;
    }

    onSubmit({
      name: data.name,
      start_time: data.start_time,
      end_time: data.end_time,
      requires_checkin: data.requires_checkin,
      sort_order: data.sort_order,
    });
    
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增時間段</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TimeSlotFormFields form={form} />
            <TimeSlotDialogActions onCancel={() => onOpenChange(false)} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeSlotDialog;
