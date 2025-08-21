import { CancelButton, SaveButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useLoadingAction from '@/hooks/useLoadingAction';
import { ShiftFormData, shiftFormSchema } from '@/schemas/shift';
import { CreateShiftData } from '@/types/shift';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface CreateShiftFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: CreateShiftData) => Promise<unknown>;
}

const CreateShiftForm = ({ open, onOpenChange, onSubmit }: CreateShiftFormProps) => {
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      code: '',
      name: '',
      day_cut_time: '',
      color: '#3B82F6',
    },
  });

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: ShiftFormData) => {
      // 確保所有必填欄位都有值
      const shiftData: CreateShiftData = {
        code: data.code,
        name: data.name,
        day_cut_time: data.day_cut_time,
        color: data.color,
      };
      const result = await onSubmit(shiftData);
      if (result) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base">新增班次</DialogTitle>
          <DialogDescription className="text-xs">新增工作班次設定</DialogDescription>
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

            <div className="flex justify-end gap-2 pt-4">
              <CancelButton onClick={handleClose} disabled={isLoading} />
              <SaveButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShiftForm;
