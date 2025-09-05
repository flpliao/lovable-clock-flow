import { CancelButton, UpdateButton } from '@/components/common/buttons';
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
import { Employee } from '@/types/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 密碼變更表單 schema
const changePasswordSchema = z
  .object({
    password: z.string().min(8, '密碼至少8碼').max(50, '密碼最多50個字元'),
    password_confirmation: z.string().min(8, '密碼至少8碼').max(50, '密碼最多50個字元'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: '密碼確認不一致',
    path: ['password_confirmation'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: {
    slug: string;
    password: string;
    password_confirmation: string;
  }) => Promise<unknown>;
  employee?: Employee;
}

const ChangePasswordForm = ({
  open,
  onOpenChange,
  onSubmit,
  employee,
}: ChangePasswordFormProps) => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: ChangePasswordFormData) => {
      const result = await onSubmit({
        slug: employee?.slug,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

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
          <DialogTitle className="text-base">變更密碼</DialogTitle>
          <DialogDescription className="text-xs">
            {employee?.name ? `為 ${employee?.name} 變更密碼` : '變更員工密碼'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-4">
            {/* 新密碼和確認密碼並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>新密碼</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請輸入新密碼"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>確認新密碼</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請再次輸入新密碼"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <CancelButton onClick={handleClose} disabled={isLoading} />
              <UpdateButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;
