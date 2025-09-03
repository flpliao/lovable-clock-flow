import { CancelButton, SaveButton } from '@/components/common/buttons';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DefaultLeaveTypeSelect } from './DefaultLeaveTypeSelect';

interface CreateLeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: LeaveTypeFormData) => Promise<boolean>;
}

export function CreateLeaveTypeDialog({ open, onOpenChange, onSave }: CreateLeaveTypeDialogProps) {
  const { isLoaded, isLoading, fetchDefaultLeaveTypes, getDefaultLeaveTypeByCode } =
    useDefaultLeaveTypeStore();

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

  // 當選擇假別類型時，自動填入預設值
  const handleLeaveTypeChange = (selectedCode: LeaveTypeCode) => {
    const defaults = getDefaultLeaveTypeByCode(selectedCode);
    if (defaults) {
      form.setValue('code', selectedCode);
      form.setValue('name', defaults.name);
      form.setValue('paid_type', defaults.paid_type);
      form.setValue('annual_reset', defaults.annual_reset);
      form.setValue('max_per_year', defaults.max_per_year);
      form.setValue('required_attachment', defaults.required_attachment);
      form.setValue('description', defaults.detailed_description);
    }
  };

  const { wrappedAction: handleSubmit, isLoading: isSaving } = useLoadingAction(
    async (data: LeaveTypeFormData) => {
      const leaveTypeData: LeaveTypeFormData = {
        code: data.code,
        name: data.name,
        paid_type: data.paid_type,
        annual_reset: data.annual_reset,
        max_per_year: data.max_per_year,
        required_attachment: data.required_attachment,
        is_active: data.is_active,
        description: data.description,
      };

      const success = await onSave(leaveTypeData);
      if (success) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新增假別</DialogTitle>
          <DialogDescription>新增一個假別類型</DialogDescription>
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
                        onValueChange={handleLeaveTypeChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>選擇假別類型類型</FormDescription>
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
              <SaveButton isLoading={isSaving} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
