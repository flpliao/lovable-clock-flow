import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreateWorkScheduleData,
  createWorkScheduleSchema,
  WorkScheduleStatus,
  type CreateWorkScheduleFormData,
} from '@/types/workSchedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

interface CreateWorkScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateWorkScheduleData) => void;
  shiftId: string;
}

export interface CreateWorkScheduleFormRef {
  form: UseFormReturn<CreateWorkScheduleFormData>;
  reset: () => void;
}

const CreateWorkScheduleForm = forwardRef<CreateWorkScheduleFormRef, CreateWorkScheduleFormProps>(
  ({ open, onOpenChange, onSubmit, shiftId }, ref) => {
    const form = useForm<CreateWorkScheduleFormData>({
      resolver: zodResolver(createWorkScheduleSchema),
      defaultValues: {
        status: WorkScheduleStatus.WORK,
        clock_in_time: '',
        clock_out_time: '',
        ot_start_after_hours: 0,
        ot_start_after_minutes: 0,
        break1_start: '',
        break1_end: '',
        break2_start: '',
        break2_end: '',
        break3_start: '',
        break3_end: '',
      },
    });

    // 將 form 和相關方法暴露給父層
    useImperativeHandle(ref, () => ({
      form,
      reset: () => form.reset(),
    }));

    const handleSubmit = (data: CreateWorkScheduleFormData) => {
      const workScheduleData: CreateWorkScheduleData = {
        shift_id: shiftId,
        status: data.status,
        clock_in_time: data.clock_in_time,
        clock_out_time: data.clock_out_time,
        ot_start_after_hours: data.ot_start_after_hours,
        ot_start_after_minutes: data.ot_start_after_minutes,
        break1_start: data.break1_start || undefined,
        break1_end: data.break1_end || undefined,
        break2_start: data.break2_start || undefined,
        break2_end: data.break2_end || undefined,
        break3_start: data.break3_start || undefined,
        break3_end: data.break3_end || undefined,
      };
      onSubmit(workScheduleData);
    };

    const handleClose = () => {
      form.reset();
      onOpenChange(false);
    };

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">新增工作時程</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              為班次新增工作時程設定
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* 基本資訊 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>狀態</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選擇狀態" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={WorkScheduleStatus.WORK}>上班日</SelectItem>
                            <SelectItem value={WorkScheduleStatus.OFF}>休息日</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 工作時間 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clock_in_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>上班時間</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clock_out_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>下班時間</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 加班設定 */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">加班起算時間-下班時間後</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ot_start_after_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>小時</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="23" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ot_start_after_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>分鐘</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="59" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 休息時間 */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">休息時間</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="break1_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>開始</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="break1_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>結束</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="break2_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="break2_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="break3_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="break3_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* 按鈕 */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  取消
                </Button>
                <Button type="submit">新增</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateWorkScheduleForm.displayName = 'CreateWorkScheduleForm';

export default CreateWorkScheduleForm;
