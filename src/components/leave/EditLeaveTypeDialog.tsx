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
  FormDescription,
  FormField,
  FormItem,
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { LeaveTypeCode, PaidType } from '@/constants/leave';
import useLoadingAction from '@/hooks/useLoadingAction';
import {
  leaveTypeFormDefaultValues,
  leaveTypeFormSchema,
  type LeaveTypeFormData,
} from '@/schemas/leaveType';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';
import type { LeaveType } from '@/types/leaveType';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DefaultLeaveTypeSelect } from './DefaultLeaveTypeSelect';

interface EditLeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType: LeaveType | null;
  onSave: (slug: string, data: LeaveTypeFormData) => Promise<boolean>;
}

export function EditLeaveTypeDialog({
  open,
  onOpenChange,
  leaveType,
  onSave,
}: EditLeaveTypeDialogProps) {
  const { isLoaded, isLoading, fetchDefaultLeaveTypes } = useDefaultLeaveTypeStore();

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeFormSchema),
    defaultValues: leaveTypeFormDefaultValues,
  });

  // 載入預設假別類型資料
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      fetchDefaultLeaveTypes().catch(console.error);
    }
  }, [isLoaded, isLoading, fetchDefaultLeaveTypes]);

  // 當 leaveType 或 open 狀態改變時重新設定表單值
  useEffect(() => {
    if (open && leaveType) {
      form.reset({
        code: leaveType.code || LeaveTypeCode.OTHER,
        name: leaveType.name || '',
        paid_type: leaveType.paid_type || PaidType.UNPAID,
        annual_reset: leaveType.annual_reset !== undefined ? leaveType.annual_reset : true,
        max_per_year: leaveType.max_per_year || undefined,
        required_attachment: leaveType.required_attachment || false,
        is_active: leaveType.is_active !== undefined ? leaveType.is_active : true,
        description: leaveType.description || '',
      });
    }
  }, [leaveType, open, form]);

  const { wrappedAction: handleSubmit, isLoading: isSaving } = useLoadingAction(
    async (data: LeaveTypeFormData) => {
      if (!leaveType) return;

      // 處理空值轉換
      const processedData = {
        ...data,
        max_per_year: data.max_per_year || undefined,
        description: data.description || undefined,
      };

      const success = await onSave(leaveType.slug, processedData);
      if (success) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  if (!leaveType) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>編輯假別</DialogTitle>
          <DialogDescription>修改假別設定</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* 基本資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>假別類型</CustomFormLabel>
                    <FormControl>
                      <DefaultLeaveTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>選擇假別類型</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>假別名稱</CustomFormLabel>
                    <FormControl>
                      <Input placeholder="例如：病假" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel>說明</CustomFormLabel>
                  <FormControl>
                    <Textarea placeholder="假別說明和規則" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 數值設定 */}
            <FormField
              control={form.control}
              name="max_per_year"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel required>每年最大天數</CustomFormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="留空表示無限制"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>設定每年最多可請的天數，留空表示無限制</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 薪資設定 */}
            <FormField
              control={form.control}
              name="paid_type"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel required>薪資類型</CustomFormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇薪資類型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PaidType.PAID}>有薪</SelectItem>
                      <SelectItem value={PaidType.HALF}>半薪</SelectItem>
                      <SelectItem value={PaidType.UNPAID}>無薪</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>選擇此假別的薪資計算方式</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 開關設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="annual_reset"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <CustomFormLabel>年度重置</CustomFormLabel>
                      <FormDescription>是否每年重新計算額度</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required_attachment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <CustomFormLabel>需要附件</CustomFormLabel>
                      <FormDescription>申請此假別是否需要上傳附件</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <CustomFormLabel>啟用狀態</CustomFormLabel>
                      <FormDescription>是否啟用此假別</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <CancelButton onClick={handleClose} />
              <UpdateButton isLoading={isSaving} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
