
import { useForm } from 'react-hook-form';

export type TimeSlotFormData = {
  name: string;
  start_time: string;
  end_time: string;
  requires_checkin: boolean;
  sort_order: number;
};

export const useTimeSlotForm = (defaultValues?: Partial<TimeSlotFormData>) => {
  const form = useForm<TimeSlotFormData>({
    defaultValues: {
      name: '',
      start_time: '09:00',
      end_time: '17:00',
      requires_checkin: true,
      sort_order: 1,
      ...defaultValues,
    },
  });

  const validateTimeSlot = (data: TimeSlotFormData) => {
    // 驗證時間格式
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.start_time)) {
      form.setError('start_time', { message: '請輸入有效的開始時間 (HH:MM)' });
      return false;
    }
    if (!timeRegex.test(data.end_time)) {
      form.setError('end_time', { message: '請輸入有效的結束時間 (HH:MM)' });
      return false;
    }

    // 驗證結束時間是否晚於開始時間
    const startTime = new Date(`2000-01-01 ${data.start_time}`);
    const endTime = new Date(`2000-01-01 ${data.end_time}`);
    
    if (endTime <= startTime) {
      form.setError('end_time', { message: '結束時間必須晚於開始時間' });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    form.reset({
      name: '',
      start_time: '09:00',
      end_time: '17:00',
      requires_checkin: true,
      sort_order: 1,
    });
  };

  return {
    form,
    validateTimeSlot,
    resetForm,
  };
};
