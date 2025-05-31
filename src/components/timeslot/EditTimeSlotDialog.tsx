
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TimeSlot, CreateTimeSlot } from '@/services/timeSlotService';

interface EditTimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSlot: TimeSlot;
  onSubmit: (updates: Partial<CreateTimeSlot>) => void;
}

type FormData = {
  name: string;
  start_time: string;
  end_time: string;
  requires_checkin: boolean;
  is_active: boolean;
  sort_order: number;
};

const EditTimeSlotDialog = ({ open, onOpenChange, timeSlot, onSubmit }: EditTimeSlotDialogProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      name: timeSlot.name,
      start_time: timeSlot.start_time,
      end_time: timeSlot.end_time,
      requires_checkin: timeSlot.requires_checkin,
      is_active: timeSlot.is_active,
      sort_order: timeSlot.sort_order,
    },
  });

  useEffect(() => {
    console.log('Setting form values for editing:', timeSlot);
    form.reset({
      name: timeSlot.name,
      start_time: timeSlot.start_time,
      end_time: timeSlot.end_time,
      requires_checkin: timeSlot.requires_checkin,
      is_active: timeSlot.is_active,
      sort_order: timeSlot.sort_order,
    });
  }, [timeSlot, form]);

  const handleSubmit = (data: FormData) => {
    console.log('Edit form submission data:', data);
    
    // 驗證時間格式
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.start_time)) {
      form.setError('start_time', { message: '請輸入有效的開始時間 (HH:MM)' });
      return;
    }
    if (!timeRegex.test(data.end_time)) {
      form.setError('end_time', { message: '請輸入有效的結束時間 (HH:MM)' });
      return;
    }

    // 驗證結束時間是否晚於開始時間
    const startTime = new Date(`2000-01-01 ${data.start_time}`);
    const endTime = new Date(`2000-01-01 ${data.end_time}`);
    
    if (endTime <= startTime) {
      form.setError('end_time', { message: '結束時間必須晚於開始時間' });
      return;
    }

    onSubmit({
      name: data.name,
      start_time: data.start_time,
      end_time: data.end_time,
      requires_checkin: data.requires_checkin,
      sort_order: data.sort_order,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯時間段</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>啟用狀態</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      停用後將無法被選擇
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit">
                更新
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeSlotDialog;
