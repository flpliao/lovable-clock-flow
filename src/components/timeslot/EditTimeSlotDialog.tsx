
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
                rules={{ required: '請選擇開始時間' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時間</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                rules={{ required: '請選擇結束時間' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>結束時間</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
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
                min: { value: 1, message: '排序必須大於 0' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>排序順序</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
