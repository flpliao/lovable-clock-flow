import { CancelButton, SaveButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import DepartmentSelect from '@/components/common/DepartmentSelect';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import GenderSelect from '@/components/common/GenderSelect';
import RolesSelect from '@/components/common/RolesSelect';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Gender } from '@/constants/gender';
import useLoadingAction from '@/hooks/useLoadingAction';
import { Employee } from '@/types/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 員工表單 schema
const employeeFormSchema = z.object({
  no: z.string().min(1, '工號不能為空').max(50, '工號最多50個字元'),
  gender: z.nativeEnum(Gender, {
    required_error: '性別不能為空',
  }),
  password: z.string().min(8, '密碼至少8碼').max(50, '密碼最多50個字元'),
  password_confirmation: z.string().min(8, '密碼至少8碼').max(50, '密碼最多50個字元'),
  name: z.string().min(1, '姓名不能為空').max(50, '姓名最多50個字元'),
  email: z.string().email('請輸入有效的電子郵件').min(1, '電子郵件不能為空'),
  department_slug: z.string().min(1, '請選擇部門'),
  role_name: z.string().min(1, '請選擇權限'),
  direct_manager_slug: z.string().optional().or(z.literal('')),
  start_date: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface CreateEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: Omit<Employee, 'slug'>) => Promise<unknown>;
}

const CreateEmployeeForm = ({ open, onOpenChange, onSubmit }: CreateEmployeeFormProps) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      no: '',
      name: '',
      email: '',
      password: '',
      department_slug: '',
      role_name: '',
      direct_manager_slug: '',
      start_date: '',
      phone: '',
    },
  });

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: EmployeeFormData) => {
      // 確保所有必填欄位都有值
      const employeeData: Omit<Employee, 'slug'> = {
        no: data.no,
        gender: data.gender,
        name: data.name,
        email: data.email,
        department_slug: data.department_slug,
        role_name: data.role_name,
        direct_manager_slug: data.direct_manager_slug,
        start_date: data.start_date,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      console.log(employeeData);
      const result = await onSubmit(employeeData);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">新增員工</DialogTitle>
          <DialogDescription className="text-xs">新增員工至系統</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-4">
            {/* 工號和性別並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="no"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>工號</CustomFormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請輸入工號"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>性別</CustomFormLabel>
                    <FormControl>
                      <GenderSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="選擇性別"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 姓名和單位並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>姓名</CustomFormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請輸入員工姓名"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department_slug"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>單位</CustomFormLabel>
                    <FormControl>
                      <DepartmentSelect
                        selectedDepartment={field.value}
                        onDepartmentChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 電子郵件和職位並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>電子郵件</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請輸入電子郵件"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_name"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>權限</CustomFormLabel>
                    <FormControl>
                      <RolesSelect
                        selectedRole={field.value}
                        onRoleChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>密碼</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="password"
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
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel required>密碼確認</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 直屬主管和到職日期並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="direct_manager_slug"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel>直屬主管</CustomFormLabel>
                    <FormControl>
                      <EmployeeSelect
                        selectedEmployee={field.value}
                        onEmployeeChange={field.onChange}
                        className="w-full"
                        placeholder="請選擇直屬主管"
                        searchPlaceholder="搜尋主管姓名..."
                        includeRoles={['admin', 'manager']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel>到職日期</CustomFormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-background border-input text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 聯絡電話 */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <CustomFormLabel>聯絡電話</CustomFormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-background border-input text-foreground"
                        placeholder="請輸入聯絡電話"
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

export default CreateEmployeeForm;
