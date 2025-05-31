
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { TimeSlotFormData } from '../hooks/useTimeSlotForm';

interface TimeSlotFormFieldsProps {
  form: UseFormReturn<TimeSlotFormData>;
}

const TimeSlotFormFields = ({ form }: TimeSlotFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        rules={{ required: '請輸入時間段名稱' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>時間段名稱</FormLabel>
            <FormControl>
              <Input placeholder="例：早班 (09:00-17:00)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_time"
          rules={{ 
            required: '請選擇開始時間',
            pattern: {
              value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              message: '請輸入有效時間格式 (HH:MM)'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>開始時間</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field}
                  step="300"
                  min="00:00"
                  max="23:59"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_time"
          rules={{ 
            required: '請選擇結束時間',
            pattern: {
              value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              message: '請輸入有效時間格式 (HH:MM)'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>結束時間</FormLabel>
              <FormControl>
                <Input 
                  type="time" 
                  {...field}
                  step="300"
                  min="00:00"
                  max="23:59"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="requires_checkin"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>需要打卡</FormLabel>
              <div className="text-sm text-muted-foreground">
                此時間段是否需要員工打卡
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sort_order"
        rules={{ 
          required: '請輸入排序順序',
          min: { value: 1, message: '排序必須大於 0' },
          max: { value: 999, message: '排序不能超過 999' }
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>排序順序</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                max="999"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? '' : parseInt(value) || 1);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TimeSlotFormFields;
