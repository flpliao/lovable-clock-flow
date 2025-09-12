import CustomFormLabel from '@/components/common/CustomFormLabel';
import { CancelButton, UpdateButton } from '@/components/common/buttons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useLoadingAction from '@/hooks/useLoadingAction';
import { salaryFormSchema, type EditSalaryFormData } from '@/schemas/salary';
import { Salary, SALARY_TYPE_LABELS, SalaryStatus, SalaryType } from '@/types/salary';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface EditSalaryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditSalaryFormData) => Promise<Salary>;
  salary: Salary;
}

const EditSalaryForm: React.FC<EditSalaryFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  salary,
}) => {
  const form = useForm<EditSalaryFormData>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      salary_month: '',
      income_month: '',
      employee_slug: '',
      employee_name: '',
      department: '',
      position: '',
      salary_type: SalaryType.MONTHLY,
      basic_salary: 0,
      meal_allowance: 0,
      attendance_bonus: 0,
      supervisor_allowance: 0,
      transportation_allowance: 0,
      position_allowance: 0,
      professional_allowance: 0,
      holiday_bonus: 0,
      birthday_bonus: 0,
      year_end_bonus: 0,
      tax_free_overtime: 0,
      taxable_overtime: 0,
      unused_leave_compensation_special: 0,
      unused_leave_compensation_compensatory: 0,
      tax_free_unused_leave_compensatory: 0,
      taxable_unused_leave_compensatory: 0,
      unused_leave_compensation_monthly: 0,
      unused_leave_compensation_other: 0,
      severance_pay: 0,
      labor_insurance_personal: 0,
      labor_pension_personal: 0,
      health_insurance_personal: 0,
      leave_deduction: 0,
      late_deduction: 0,
      early_leave_deduction: 0,
      overtime_break_deduction: 0,
      absenteeism_deduction: 0,
      labor_insurance_employer: 0,
      occupational_insurance_employer: 0,
      health_insurance_employer: 0,
      labor_pension_employer: 0,
      status: SalaryStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (salary) {
      // 重置表單為初始資料
      form.reset({
        salary_month: salary.salary_month || '',
        income_month: salary.income_month || '',
        employee_slug: salary.employee.slug || '',
        employee_name: salary.employee_name || '',
        department: salary.department || '',
        position: salary.position || '',
        salary_type: salary.salary_type || SalaryType.MONTHLY,
        basic_salary: salary.basic_salary || 0,
        meal_allowance: salary.meal_allowance || 0,
        attendance_bonus: salary.attendance_bonus || 0,
        supervisor_allowance: salary.supervisor_allowance || 0,
        transportation_allowance: salary.transportation_allowance || 0,
        position_allowance: salary.position_allowance || 0,
        professional_allowance: salary.professional_allowance || 0,
        holiday_bonus: salary.holiday_bonus || 0,
        birthday_bonus: salary.birthday_bonus || 0,
        year_end_bonus: salary.year_end_bonus || 0,
        tax_free_overtime: salary.tax_free_overtime || 0,
        taxable_overtime: salary.taxable_overtime || 0,
        unused_leave_compensation_special: salary.unused_leave_compensation_special || 0,
        unused_leave_compensation_compensatory: salary.unused_leave_compensation_compensatory || 0,
        tax_free_unused_leave_compensatory: salary.tax_free_unused_leave_compensatory || 0,
        taxable_unused_leave_compensatory: salary.taxable_unused_leave_compensatory || 0,
        unused_leave_compensation_monthly: salary.unused_leave_compensation_monthly || 0,
        unused_leave_compensation_other: salary.unused_leave_compensation_other || 0,
        severance_pay: salary.severance_pay || 0,
        labor_insurance_personal: salary.labor_insurance_personal || 0,
        labor_pension_personal: salary.labor_pension_personal || 0,
        health_insurance_personal: salary.health_insurance_personal || 0,
        leave_deduction: salary.leave_deduction || 0,
        late_deduction: salary.late_deduction || 0,
        early_leave_deduction: salary.early_leave_deduction || 0,
        overtime_break_deduction: salary.overtime_break_deduction || 0,
        absenteeism_deduction: salary.absenteeism_deduction || 0,
        labor_insurance_employer: salary.labor_insurance_employer || 0,
        occupational_insurance_employer: salary.occupational_insurance_employer || 0,
        health_insurance_employer: salary.health_insurance_employer || 0,
        labor_pension_employer: salary.labor_pension_employer || 0,
        status: salary.status,
      });
    }
  }, [salary, form]);

  const { wrappedAction: handleSubmitAction, isLoading } = useLoadingAction(
    async (data: EditSalaryFormData) => {
      const submitData = {
        ...data,
        slug: salary.slug, // 保留原有的 slug
        created_at: salary.created_at, // 保留原有的創建時間
        updated_at: new Date().toISOString(), // 更新修改時間
      };
      const result = await onSubmit(submitData);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>編輯薪資記錄</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAction)} className="space-y-6" noValidate>
            {/* 基本資訊 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本資訊</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary_month"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel required>薪資年月（YYYY-MM）</CustomFormLabel>
                      <FormControl>
                        <Input
                          type="month"
                          {...field}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">薪資年月不可編輯</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income_month"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>所得年月（YYYY-MM）</CustomFormLabel>
                      <FormControl>
                        <Input
                          type="month"
                          {...field}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-1">所得年月不可編輯</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee_slug"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel required>員工代碼</CustomFormLabel>
                      <FormControl>
                        <Input placeholder="請輸入員工代碼" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employee_name"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>姓名</CustomFormLabel>
                      <FormControl>
                        <Input placeholder="請輸入姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>單位</CustomFormLabel>
                      <FormControl>
                        <Input placeholder="請輸入單位" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>職稱</CustomFormLabel>
                      <FormControl>
                        <Input placeholder="請輸入職稱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_type"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>薪資類別</CustomFormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(SALARY_TYPE_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 薪資項目 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">薪資項目</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="basic_salary"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>本薪</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meal_allowance"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>伙食津貼</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attendance_bonus"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>全勤獎金</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supervisor_allowance"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>主管津貼</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transportation_allowance"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>交通津貼</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position_allowance"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>職務津貼</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professional_allowance"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>專業加給</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="holiday_bonus"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>年節獎金</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday_bonus"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>生日禮金</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_end_bonus"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>年終獎金</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 加班費 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">加班費</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tax_free_overtime"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>免稅加班費</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxable_overtime"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>應稅加班費</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 不休假代金 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">不休假代金</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unused_leave_compensation_special"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>不休假代金-特休</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unused_leave_compensation_compensatory"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>不休假代金-補休</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_free_unused_leave_compensatory"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>免稅不休假代金-補休</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxable_unused_leave_compensatory"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>應稅不休假代金-補休</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unused_leave_compensation_monthly"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>不休假代金-月休</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unused_leave_compensation_other"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>不休假代金-其他假別</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 其他項目 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">其他項目</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="severance_pay"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>資遣費</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 扣款項目 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">扣款項目</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="labor_insurance_personal"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>勞保費-個人</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labor_pension_personal"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>勞退提繳-個人</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="health_insurance_personal"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>健保費-個人</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leave_deduction"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>請假扣款</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="late_deduction"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>遲到扣款</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="early_leave_deduction"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>早退扣款</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="overtime_break_deduction"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>休息超時扣款</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="absenteeism_deduction"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>曠職扣款</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 雇主負擔 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">雇主負擔</h3>
              <hr className="border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="labor_insurance_employer"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>勞保費-單位</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupational_insurance_employer"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>職保費-單位</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="health_insurance_employer"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>健保費-單位</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labor_pension_employer"
                  render={({ field }) => (
                    <FormItem>
                      <CustomFormLabel>勞退提繳-雇主</CustomFormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default EditSalaryForm;
