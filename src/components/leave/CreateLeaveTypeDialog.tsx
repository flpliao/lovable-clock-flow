import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaidType, LeaveTypeCode } from '@/constants/leave';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';

const createLeaveTypeSchema = z.object({
  code: z.nativeEnum(LeaveTypeCode),
  name: z.string().min(1, '名稱不能為空').max(50, '名稱最多50個字元'),
  paid_type: z.nativeEnum(PaidType),
  annual_reset: z.boolean(),
  max_per_year: z.coerce.number().nullable().optional(),
  required_attachment: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional(),
});

type CreateLeaveTypeFormData = z.infer<typeof createLeaveTypeSchema>;

interface CreateLeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CreateLeaveTypeFormData) => Promise<boolean>;
}

export function CreateLeaveTypeDialog({ open, onOpenChange, onSave }: CreateLeaveTypeDialogProps) {
  const {
    defaultLeaveTypes,
    isLoading,
    isLoaded,
    fetchDefaultLeaveTypes,
    getDefaultLeaveTypeByCode,
  } = useDefaultLeaveTypeStore();

  const form = useForm<CreateLeaveTypeFormData>({
    resolver: zodResolver(createLeaveTypeSchema),
    defaultValues: {
      code: LeaveTypeCode.OTHER,
      name: '',
      paid_type: PaidType.UNPAID,
      annual_reset: true,
      max_per_year: undefined,
      required_attachment: false,
      is_active: true,
      description: '',
    },
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

  const handleSubmit = async (data: CreateLeaveTypeFormData) => {
    // 處理空值轉換
    const processedData = {
      ...data,
      max_per_year: data.max_per_year || undefined,
      description: data.description || undefined,
    };

    const success = await onSave(processedData);
    if (success) {
      form.reset();
      onOpenChange(false);
    }
  };

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
                    <FormLabel>假別類型 *</FormLabel>
                    <Select onValueChange={handleLeaveTypeChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇假別類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading && (
                          <SelectItem value="" disabled>
                            載入中...
                          </SelectItem>
                        )}
                        {!isLoading &&
                          defaultLeaveTypes.map(type => (
                            <SelectItem key={type.code} value={type.code}>
                              {type.name} ({type.code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                    <FormLabel>假別名稱 *</FormLabel>
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
                  <FormLabel>說明</FormLabel>
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
                  <FormLabel>每年最大天數</FormLabel>
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
                  <FormLabel>薪資類型 *</FormLabel>
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
                      <FormLabel className="text-base">年度重置</FormLabel>
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
                      <FormLabel className="text-base">需要附件</FormLabel>
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
                      <FormLabel className="text-base">啟用狀態</FormLabel>
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
              <Button type="button" variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit">新增</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
