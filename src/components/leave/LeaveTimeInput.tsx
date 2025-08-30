import React from 'react';
import { FormControl, FormMessage } from '@/components/ui/form';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import { WorkSchedule } from '@/types/workSchedule';
import { getSmartDefaultTime } from '@/utils/scheduleTimeUtils';
import dayjs, { Dayjs } from 'dayjs';
import { UseFormReturn } from 'react-hook-form';
import { LeaveRequestFormValues } from '@/schemas/leaveRequest';

interface LeaveTimeInputProps {
  form: UseFormReturn<LeaveRequestFormValues>;
  field: {
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
  };
  workSchedules: WorkSchedule[];
  label: string;
  isEndTime?: boolean;
}

export const LeaveTimeInput: React.FC<LeaveTimeInputProps> = ({
  field,
  workSchedules,
  label,
  isEndTime = false,
}) => {
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? dayjs(e.target.value) : null;
    field.onChange(date);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // 當只選擇日期沒選時間時，自動填入預設時間
    if (e.target.value && e.target.value.length === 10) {
      const selectedDate = dayjs(e.target.value);
      const defaultTime = getSmartDefaultTime(selectedDate, workSchedules, isEndTime);

      if (defaultTime) {
        e.target.value = defaultTime;
        field.onChange(dayjs(defaultTime));
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <CustomFormLabel required className="text-white">
        {label}
      </CustomFormLabel>
      <FormControl>
        <div className="relative">
          <input
            type="datetime-local"
            step="1800"
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
            value={field.value ? field.value.format('YYYY-MM-DDTHH:mm') : ''}
            onChange={handleDateTimeChange}
            onBlur={handleBlur}
          />
        </div>
      </FormControl>
      <FormMessage />
    </div>
  );
};
