import { CancelButton, UpdateButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { WorkScheduleStatus } from '@/constants/workSchedule';
import useLoadingAction from '@/hooks/useLoadingAction';
import { CreateWorkScheduleFormData, createWorkScheduleSchema } from '@/schemas/workSchedule';
import type { UpdateWorkScheduleData, WorkSchedule } from '@/types/workSchedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditWorkScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slug: string, data: UpdateWorkScheduleData) => Promise<boolean>;
  workSchedule: WorkSchedule | null;
  setWorkSchedule: (workSchedule: WorkSchedule | null) => void;
}

const EditWorkScheduleForm = ({
  open,
  onOpenChange,
  onSubmit,
  workSchedule,
  setWorkSchedule,
}: EditWorkScheduleFormProps) => {
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

  // 監聽狀態變化
  const watchedStatus = form.watch('status');
  const isWorkDay = watchedStatus === WorkScheduleStatus.WORK;

  // 當 workSchedule 變更時，重置表單資料
  useEffect(() => {
    if (workSchedule) {
      form.reset({
        status: workSchedule.status,
        clock_in_time: workSchedule.clock_in_time,
        clock_out_time: workSchedule.clock_out_time,
        ot_start_after_hours: workSchedule.ot_start_after_hours,
        ot_start_after_minutes: workSchedule.ot_start_after_minutes,
        break1_start: workSchedule.break1_start || '',
        break1_end: workSchedule.break1_end || '',
        break2_start: workSchedule.break2_start || '',
        break2_end: workSchedule.break2_end || '',
        break3_start: workSchedule.break3_start || '',
        break3_end: workSchedule.break3_end || '',
      });
    }
  }, [workSchedule, form]);

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: CreateWorkScheduleFormData) => {
      if (!workSchedule) return;

      const workScheduleData: UpdateWorkScheduleData = {
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

      const result = await onSubmit(workSchedule.slug, workScheduleData);
      if (result) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    form.reset();
    setWorkSchedule(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">編輯工作時程</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            修改工作時程設定
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel required>狀態</CustomFormLabel>
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

            {/* 工作時間 - 僅在工作日顯示 */}
            {isWorkDay && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clock_in_time"
                    render={({ field }) => (
                      <FormItem>
                        <CustomFormLabel required>上班時間</CustomFormLabel>
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
                        <CustomFormLabel required>下班時間</CustomFormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* 加班設定 - 僅在工作日顯示 */}
            {isWorkDay && (
              <div className="space-y-4">
                <FormLabel>加班起算時間-下班時間後</FormLabel>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ot_start_after_hours"
                    render={({ field }) => (
                      <FormItem>
                        <CustomFormLabel>小時</CustomFormLabel>
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
                        <CustomFormLabel>分鐘</CustomFormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="59" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* 休息時間 - 僅在工作日顯示 */}
            {isWorkDay && (
              <div className="space-y-4">
                <FormLabel>休息時間</FormLabel>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="break1_start"
                      render={({ field }) => (
                        <FormItem>
                          <CustomFormLabel>開始</CustomFormLabel>
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
                          <CustomFormLabel>結束</CustomFormLabel>
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
                          <CustomFormLabel>開始</CustomFormLabel>
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
                          <CustomFormLabel>結束</CustomFormLabel>
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
                          <CustomFormLabel>開始</CustomFormLabel>
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
                          <CustomFormLabel>結束</CustomFormLabel>
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
            )}

            <DialogFooter>
              <CancelButton onClick={handleClose} disabled={isLoading} />
              <UpdateButton isLoading={isLoading} disabled={isLoading} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkScheduleForm;
