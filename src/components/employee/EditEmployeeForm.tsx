import { CancelButton, UpdateButton } from '@/components/common/buttons';
import CustomFormLabel from '@/components/common/CustomFormLabel';
import DepartmentSelect from '@/components/common/DepartmentSelect';
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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// 員工表單 schema
const employeeFormSchema = z.object({
  no: z.string().min(1, '工號不能為空').max(50, '工號最多50個字元'),
  gender: z.nativeEnum(Gender, {
    required_error: '性別不能為空',
  }),
  name: z.string().min(1, '姓名不能為空').max(50, '姓名最多50個字元'),
  email: z.string().email('請輸入有效的電子郵件').min(1, '電子郵件不能為空'),
  department_slug: z.string().min(1, '請選擇部門'),
  start_date: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  role_name: z.string().min(1, '請選擇權限'),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EditEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slug: string, formData: Partial<Omit<Employee, 'slug'>>) => Promise<unknown>;
  employee?: Employee;
  setEmployee: (employee: Employee | null) => void;
}

const EditEmployeeForm = ({
  open,
  onOpenChange,
  onSubmit,
  employee,
  setEmployee,
}: EditEmployeeFormProps) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      no: employee?.no || '',
      gender: employee?.gender || Gender.MALE,
      name: employee?.name || '',
      email: employee?.email || '',
      department_slug: employee?.department?.slug || '',
      start_date: employee?.start_date || '',
      phone: employee?.phone || '',
      role_name: employee?.roles?.[0]?.name || '',
    },
  });

  // 當 employee 資料變更時，更新表單預設值
  useEffect(() => {
    if (employee) {
      console.log(employee);
      form.reset({
        no: employee.no,
        gender: employee.gender,
        name: employee.name,
        email: employee.email,
        department_slug: employee.department?.slug,
        role_name: employee.roles?.[0]?.name || '',
        start_date: employee.start_date || '',
        phone: employee.phone || '',
      });
    }
  }, [employee, form]);

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: EmployeeFormData) => {
      if (!employee) return;

      // 確保所有必填欄位都有值
      const employeeData: Partial<Omit<Employee, 'slug'>> = {
        no: data.no,
        gender: data.gender,
        name: data.name,
        email: data.email,
        department_slug: data.department_slug,
        role_name: data.role_name,
        start_date: data.start_date,
        phone: data.phone,
      };
      const result = await onSubmit(employee.slug, employeeData);
      if (result) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    onOpenChange(false);
    setEmployee(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">編輯員工</DialogTitle>
          <DialogDescription className="text-xs">修改員工資料</DialogDescription>
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

            {/* 到職日期和聯絡電話並排 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <UpdateButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeForm;
