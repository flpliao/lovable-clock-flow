
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeaveType } from '@/types/hr';

const leaveTypeSchema = z.object({
  code: z.string().min(1, '請假代碼不能為空'),
  name_zh: z.string().min(1, '中文名稱不能為空'),
  name_en: z.string().min(1, '英文名稱不能為空'),
  description: z.string().optional(),
  is_paid: z.boolean(),
  is_active: z.boolean(),
  requires_attachment: z.boolean(),
  max_days_per_year: z.number().min(0).optional(),
  max_days_per_month: z.number().min(0).optional(),
  gender_restriction: z.enum(['male', 'female']).optional(),
  annual_reset: z.boolean(),
  is_system_default: z.boolean(),
});

type LeaveTypeFormData = z.infer<typeof leaveTypeSchema>;

interface LeaveTypeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (leaveType: LeaveType) => Promise<void>;
  leaveType?: LeaveType | null;
}

export function LeaveTypeFormDialog({
  open,
  onClose,
  onSave,
  leaveType,
}: LeaveTypeFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<LeaveTypeFormData>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      code: '',
      name_zh: '',
      name_en: '',
      description: '',
      is_paid: true,
      is_active: true,
      requires_attachment: false,
      max_days_per_year: 0,
      max_days_per_month: 0,
      annual_reset: false,
      is_system_default: false,
    },
  });

  useEffect(() => {
    if (leaveType) {
      form.reset({
        code: leaveType.code,
        name_zh: leaveType.name_zh,
        name_en: leaveType.name_en,
        description: leaveType.description || '',
        is_paid: leaveType.is_paid,
        is_active: leaveType.is_active,
        requires_attachment: leaveType.requires_attachment,
        max_days_per_year: leaveType.max_days_per_year || 0,
        max_days_per_month: leaveType.max_days_per_month || 0,
        gender_restriction: leaveType.gender_restriction || undefined,
        annual_reset: leaveType.annual_reset,
        is_system_default: leaveType.is_system_default,
      });
    } else {
      form.reset({
        code: '',
        name_zh: '',
        name_en: '',
        description: '',
        is_paid: true,
        is_active: true,
        requires_attachment: false,
        max_days_per_year: 0,
        max_days_per_month: 0,
        annual_reset: false,
        is_system_default: false,
      });
    }
  }, [leaveType, form]);

  const handleSubmit = async (data: LeaveTypeFormData) => {
    setLoading(true);
    try {
      const leaveTypeData: LeaveType = {
        id: leaveType?.id || '',
        code: data.code,
        name_zh: data.name_zh,
        name_en: data.name_en,
        description: data.description,
        is_paid: data.is_paid,
        is_active: data.is_active,
        requires_attachment: data.requires_attachment,
        max_days_per_year: data.max_days_per_year,
        max_days_per_month: data.max_days_per_month,
        gender_restriction: data.gender_restriction || null,
        annual_reset: data.annual_reset,
        is_system_default: data.is_system_default,
        requires_approval: true, // Add missing required property with default value
        sort_order: leaveType?.sort_order || 0, // Add missing required property with default value
        created_at: leaveType?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await onSave(leaveTypeData);
      onClose();
    } catch (error) {
      console.error('Failed to save leave type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {leaveType ? '編輯請假類型' : '新增請假類型'}
          </DialogTitle>
          <DialogDescription>
            設定請假類型的基本資訊和規則
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>請假代碼</FormLabel>
                  <FormControl>
                    <Input placeholder="例如: annual" {...field} />
                  </FormControl>
                  <FormDescription>
                    用於系統識別的唯一代碼
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name_zh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>中文名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: 特別休假" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>英文名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: Annual Leave" {...field} />
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
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="請假類型的詳細說明"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">有薪假</FormLabel>
                      <FormDescription>
                        是否為帶薪休假
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
                      <FormLabel className="text-base">啟用</FormLabel>
                      <FormDescription>
                        是否可供使用
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
            
            <FormField
              control={form.control}
              name="requires_attachment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">需要附件</FormLabel>
                    <FormDescription>
                      申請時是否需要上傳證明文件
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
              name="gender_restriction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性別限制</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇性別限制" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">無限制</SelectItem>
                      <SelectItem value="male">限男性</SelectItem>
                      <SelectItem value="female">限女性</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    特定性別才能申請的假別
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_days_per_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>年度上限天數</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      0表示無限制
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_days_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月度上限天數</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      0表示無限制
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '儲存中...' : '儲存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
