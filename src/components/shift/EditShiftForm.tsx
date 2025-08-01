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
import { Shift, UpdateShiftData } from '@/types/shift';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 表單驗證 schema
const shiftFormSchema = z.object({
  code: z.string().min(1, '班次代碼為必填項目'),
  name: z.string().min(1, '班次名稱為必填項目'),
  day_cut_time: z.string().min(1, '日切時間為必填項目'),
  color: z.string().min(1, '顏色為必填項目'),
});

type ShiftFormData = z.infer<typeof shiftFormSchema>;

interface EditShiftFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slug: string, formData: UpdateShiftData) => void;
  isLoading?: boolean;
  shift?: Shift;
}

const EditShiftForm = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  shift,
}: EditShiftFormProps) => {
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      code: shift?.code || '',
      name: shift?.name || '',
      day_cut_time: shift?.day_cut_time || '',
      color: shift?.color || '#3B82F6',
    },
  });

  // 當 shift 資料變更時，更新表單預設值
  React.useEffect(() => {
    if (shift) {
      form.reset({
        code: shift.code,
        name: shift.name,
        day_cut_time: shift.day_cut_time,
        color: shift.color,
      });
    }
  }, [shift, form]);

  const handleSubmit = (data: ShiftFormData) => {
    if (!shift) return;

    // 確保所有必填欄位都有值
    const shiftData: UpdateShiftData = {
      code: data.code,
      name: data.name,
      day_cut_time: data.day_cut_time,
      color: data.color,
    };
    onSubmit(shift.slug, shiftData);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base">編輯班次</DialogTitle>
          <DialogDescription className="text-xs">修改班次設定</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* 班次名稱和代碼並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">班次名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="例如：早班"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">班次代碼</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="例如：MORNING"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 日切時間和顏色選擇器並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day_cut_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">日切時間</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">顏色</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        className="bg-background border-input text-foreground h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="h-8 text-sm">
                取消
              </Button>
              <Button type="submit" disabled={isLoading} className="h-8 text-sm">
                {isLoading ? '更新中...' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShiftForm;
