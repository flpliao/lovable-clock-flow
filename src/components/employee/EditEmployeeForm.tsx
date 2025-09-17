import { CancelButton, UpdateButton } from '@/components/common/buttons';
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
import { employeeFormSchema, type EmployeeFormData } from '@/schemas/employee';
import { Employee } from '@/types/employee';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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
      role_name: employee?.roles?.[0]?.name || '',
      direct_manager_slug: employee?.direct_manager?.slug || '',
      start_date: employee?.start_date || '',
      phone: employee?.phone || '',
    },
  });

  // 當 employee 資料變更時，更新表單預設值
  useEffect(() => {
    if (employee) {
      form.reset({
        no: employee.no,
        gender: employee.gender,
        name: employee.name,
        email: employee.email,
        department_slug: employee.department?.slug,
        role_name: employee.roles?.[0]?.name || '',
        direct_manager_slug: employee.direct_manager?.slug || '',
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
        direct_manager_slug: data.direct_manager_slug,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                        excludeEmployeeSlug={employee?.slug}
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
              <UpdateButton isLoading={isLoading} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeForm;
