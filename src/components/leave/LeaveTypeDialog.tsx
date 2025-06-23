
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

const leaveTypeSchema = z.object({
  code: z.string().min(1, '假別代碼不能為空').max(20, '假別代碼最多20個字元'),
  name_zh: z.string().min(1, '中文名稱不能為空').max(50, '中文名稱最多50個字元'),
  name_en: z.string().min(1, '英文名稱不能為空').max(50, '英文名稱最多50個字元'),
  is_paid: z.boolean(),
  annual_reset: z.boolean(),
  max_days_per_year: z.coerce.number().nullable().optional(),
  requires_attachment: z.boolean(),
  is_active: z.boolean(),
  description: z.string().optional(),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

interface LeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType?: any;
  onSave: (data: LeaveTypeFormData) => void;
}

export function LeaveTypeDialog({ 
  open, 
  onOpenChange, 
  leaveType, 
  onSave 
}: LeaveTypeDialogProps) {
  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      code: '',
      name_zh: '',
      name_en: '',
      is_paid: false,
      annual_reset: true,
      max_days_per_year: undefined,
      requires_attachment: false,
      is_active: true,
      description: '',
    },
  });

  // 當 leaveType 或 open 狀態改變時重新設定表單值
  useEffect(() => {
    if (open) {
      if (leaveType) {
        // 編輯模式：填入現有資料
        form.reset({
          code: leaveType.code || '',
          name_zh: leaveType.name_zh || '',
          name_en: leaveType.name_en || '',
          is_paid: leaveType.is_paid || false,
          annual_reset: leaveType.annual_reset !== undefined ? leaveType.annual_reset : true,
          max_days_per_year: leaveType.max_days_per_year || undefined,
          requires_attachment: leaveType.requires_attachment || false,
          is_active: leaveType.is_active !== undefined ? leaveType.is_active : true,
          description: leaveType.description || '',
        });
      } else {
        // 新增模式：重置為預設值
        form.reset({
          code: '',
          name_zh: '',
          name_en: '',
          is_paid: false,
          annual_reset: true,
          max_days_per_year: undefined,
          requires_attachment: false,
          is_active: true,
          description: '',
        });
      }
    }
  }, [leaveType, open, form]);

  const handleSubmit = (data: LeaveTypeFormData) => {
    // 處理空值轉換
    const processedData = {
      ...data,
      max_days_per_year: data.max_days_per_year || null,
      description: data.description || null,
    };
    onSave(processedData);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {leaveType ? '編輯假別' : '新增假別'}
          </DialogTitle>
          <DialogDescription>
            {leaveType ? '修改假別設定' : '新增一個假別類型'}
          </DialogDescription>
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
                    <FormLabel>假別代碼 *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="例如：sick" 
                        {...field}
                        disabled={leaveType?.is_system_default}
                      />
                    </FormControl>
                    <FormDescription>
                      英文代碼，系統內唯一識別
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name_zh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>中文名稱 *</FormLabel>
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
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>英文名稱 *</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：Sick Leave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>說明</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="假別說明和規則"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 數值設定 */}
            <FormField
              control={form.control}
              name="max_days_per_year"
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
                  <FormDescription>
                    設定每年最多可請的天數，留空表示無限制
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 開關設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">有薪假</FormLabel>
                      <FormDescription>
                        此假別是否為有薪假
                      </FormDescription>
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
                name="annual_reset"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">年度重置</FormLabel>
                      <FormDescription>
                        是否每年重新計算額度
                      </FormDescription>
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
                name="requires_attachment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">需要附件</FormLabel>
                      <FormDescription>
                        申請此假別是否需要上傳附件
                      </FormDescription>
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">啟用狀態</FormLabel>
                      <FormDescription>
                        是否啟用此假別
                      </FormDescription>
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                取消
              </Button>
              <Button type="submit">
                {leaveType ? '更新' : '新增'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
