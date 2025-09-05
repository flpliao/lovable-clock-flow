import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import { getLeaveTypeExtraField } from '@/utils/leaveTypeUtils';
import dayjs from 'dayjs';
import { UseFormReturn } from 'react-hook-form';
import { LeaveRequestFormValues } from '@/schemas/leaveRequest';

interface LeaveTypeExtraFieldsProps {
  form: UseFormReturn<LeaveRequestFormValues>;
  leaveTypeCode: string;
}

const LeaveTypeExtraFields = ({ form, leaveTypeCode }: LeaveTypeExtraFieldsProps) => {
  const extraFieldConfig = getLeaveTypeExtraField(leaveTypeCode);

  if (!extraFieldConfig) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">額外資訊</h3>
      <FormField
        control={form.control}
        name="reference_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <CustomFormLabel required={extraFieldConfig.required} className="text-white">
              {extraFieldConfig.fieldLabel}
            </CustomFormLabel>
            <FormControl>
              <input
                type="date"
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
                value={field.value ? field.value.format('YYYY-MM-DD') : ''}
                onChange={e => {
                  const date = e.target.value ? dayjs(e.target.value) : null;
                  field.onChange(date);
                }}
              />
            </FormControl>
            <p className="text-sm text-white/70 mt-1">{extraFieldConfig.fieldDescription}</p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LeaveTypeExtraFields;
