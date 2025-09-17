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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useLoadingAction from '@/hooks/useLoadingAction';
import { ShiftFormData, shiftFormSchema } from '@/schemas/shift';
import { Shift, UpdateShiftData } from '@/types/shift';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

interface EditShiftFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slug: string, formData: UpdateShiftData) => Promise<unknown>;
  shift?: Shift;
  setShift: (shift: Shift | null) => void;
}

const EditShiftForm = ({ open, onOpenChange, onSubmit, shift, setShift }: EditShiftFormProps) => {
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

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: ShiftFormData) => {
      if (!shift) return;

      // 確保所有必填欄位都有值
      const shiftData: UpdateShiftData = {
        code: data.code,
        name: data.name,
        day_cut_time: data.day_cut_time,
        color: data.color,
      };
      const result = await onSubmit(shift.slug, shiftData);
      if (result) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    setShift(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">編輯班次</DialogTitle>
          <DialogDescription className="text-xs">修改班次設定</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-4">
            {/* 班次名稱和代碼並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>班次名稱</CustomFormLabel>
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
                    <CustomFormLabel required>班次代碼</CustomFormLabel>
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
                    <CustomFormLabel required>日切時間</CustomFormLabel>
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
                    <CustomFormLabel required>顏色</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <CancelButton onClick={handleClose} disabled={isLoading} />
              <UpdateButton isLoading={isLoading} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShiftForm;
