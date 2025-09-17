import { CancelButton, SubmitButton } from '@/components/common/buttons';
import {
  Dialog,
  DialogContent,
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
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 新增月份表單驗證 schema
const addMonthSchema = z.object({
  month: z
    .string()
    .min(1, '請輸入月份')
    .regex(/^\d{4}-\d{2}$/, '請輸入正確的格式 (YYYY-MM)'),
});

type AddMonthFormData = z.infer<typeof addMonthSchema>;

interface AddMonthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddMonthFormData) => void;
}

const AddMonthDialog: React.FC<AddMonthDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  // 表單設定
  const form = useForm<AddMonthFormData>({
    resolver: zodResolver(addMonthSchema),
    defaultValues: {
      month: '',
    },
  });

  // 處理表單提交
  const handleSubmit = async (data: AddMonthFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  // 處理取消
  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增薪資月份</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>月份格式 (YYYY-MM)</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：2024-01" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">
                    請輸入格式為 YYYY-MM 的月份，例如：2024-01
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter>
              <CancelButton onClick={handleCancel} />
              <SubmitButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMonthDialog;
