import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Salary } from '@/types/salary';
import React, { useEffect } from 'react';
import { useSalaryForm } from './hooks/useSalaryForm';

interface CreateSalaryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Salary, 'slug' | 'created_at' | 'updated_at'>) => void;
  initialData?: Salary;
  title: string;
}

const CreateSalaryForm: React.FC<CreateSalaryFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}) => {
  const { formData, updateFormData } = useSalaryForm(initialData);

  useEffect(() => {
    if (open) {
      console.log('💰 CreateSalaryForm 開啟，開始檢查員工資料載入狀態');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證必填欄位
    if (!formData.employee_id) {
      console.error('❌ 員工ID為必填');
      return;
    }

    if (!formData.salary_month) {
      console.error('❌ 薪資月份為必填');
      return;
    }

    if (!formData.employee_name) {
      console.error('❌ 員工姓名為必填');
      return;
    }

    const submitData = {
      ...formData,
      basic_salary: Number(formData.basic_salary),
      meal_allowance: Number(formData.meal_allowance),
      attendance_bonus: Number(formData.attendance_bonus),
      supervisor_allowance: Number(formData.supervisor_allowance),
      transportation_allowance: Number(formData.transportation_allowance),
      position_allowance: Number(formData.position_allowance),
      professional_allowance: Number(formData.professional_allowance),
      holiday_bonus: Number(formData.holiday_bonus),
      birthday_bonus: Number(formData.birthday_bonus),
      year_end_bonus: Number(formData.year_end_bonus),
      tax_free_overtime: Number(formData.tax_free_overtime),
      taxable_overtime: Number(formData.taxable_overtime),
      unused_leave_compensation_special: Number(formData.unused_leave_compensation_special),
      unused_leave_compensation_compensatory: Number(
        formData.unused_leave_compensation_compensatory
      ),
      tax_free_unused_leave_compensatory: Number(formData.tax_free_unused_leave_compensatory),
      taxable_unused_leave_compensatory: Number(formData.taxable_unused_leave_compensatory),
      unused_leave_compensation_monthly: Number(formData.unused_leave_compensation_monthly),
      unused_leave_compensation_other: Number(formData.unused_leave_compensation_other),
      severance_pay: Number(formData.severance_pay),
      labor_insurance_personal: Number(formData.labor_insurance_personal),
      labor_pension_personal: Number(formData.labor_pension_personal),
      health_insurance_personal: Number(formData.health_insurance_personal),
      leave_deduction: Number(formData.leave_deduction),
      late_deduction: Number(formData.late_deduction),
      early_leave_deduction: Number(formData.early_leave_deduction),
      overtime_break_deduction: Number(formData.overtime_break_deduction),
      absenteeism_deduction: Number(formData.absenteeism_deduction),
      labor_insurance_employer: Number(formData.labor_insurance_employer),
      occupational_insurance_employer: Number(formData.occupational_insurance_employer),
      health_insurance_employer: Number(formData.health_insurance_employer),
      labor_pension_employer: Number(formData.labor_pension_employer),
    };

    console.log('💾 提交薪資記錄資料:', submitData);
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* 基本資訊 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本資訊</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">員工ID *</Label>
                <Input
                  id="employee_id"
                  value={formData.employee_id}
                  onChange={e => updateFormData({ employee_id: e.target.value })}
                  placeholder="請輸入員工ID"
                />
              </div>
              <div>
                <Label htmlFor="employee_number">員工編號</Label>
                <Input
                  id="employee_number"
                  value={formData.employee_number}
                  onChange={e => updateFormData({ employee_number: e.target.value })}
                  placeholder="請輸入員工編號"
                />
              </div>
              <div>
                <Label htmlFor="employee_name">員工姓名 *</Label>
                <Input
                  id="employee_name"
                  value={formData.employee_name}
                  onChange={e => updateFormData({ employee_name: e.target.value })}
                  placeholder="請輸入員工姓名"
                />
              </div>
              <div>
                <Label htmlFor="department">單位</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={e => updateFormData({ department: e.target.value })}
                  placeholder="請輸入單位"
                />
              </div>
              <div>
                <Label htmlFor="position">職位</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={e => updateFormData({ position: e.target.value })}
                  placeholder="請輸入職位"
                />
              </div>
              <div>
                <Label htmlFor="salary_type">薪資類型</Label>
                <Select
                  value={formData.salary_type}
                  onValueChange={value => updateFormData({ salary_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">月薪</SelectItem>
                    <SelectItem value="hourly">時薪</SelectItem>
                    <SelectItem value="daily">日薪</SelectItem>
                    <SelectItem value="contract">合約</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary_month">薪資月份 *</Label>
                <Input
                  id="salary_month"
                  type="month"
                  value={formData.salary_month}
                  onChange={e => updateFormData({ salary_month: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="income_month">收入月份</Label>
                <Input
                  id="income_month"
                  type="month"
                  value={formData.income_month}
                  onChange={e => updateFormData({ income_month: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 薪資項目 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">薪資項目</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="basic_salary">基本薪資</Label>
                <Input
                  id="basic_salary"
                  type="number"
                  value={formData.basic_salary}
                  onChange={e => updateFormData({ basic_salary: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="meal_allowance">餐費津貼</Label>
                <Input
                  id="meal_allowance"
                  type="number"
                  value={formData.meal_allowance}
                  onChange={e => updateFormData({ meal_allowance: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="attendance_bonus">全勤獎金</Label>
                <Input
                  id="attendance_bonus"
                  type="number"
                  value={formData.attendance_bonus}
                  onChange={e => updateFormData({ attendance_bonus: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="supervisor_allowance">主管津貼</Label>
                <Input
                  id="supervisor_allowance"
                  type="number"
                  value={formData.supervisor_allowance}
                  onChange={e => updateFormData({ supervisor_allowance: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="transportation_allowance">交通津貼</Label>
                <Input
                  id="transportation_allowance"
                  type="number"
                  value={formData.transportation_allowance}
                  onChange={e =>
                    updateFormData({ transportation_allowance: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="position_allowance">職務津貼</Label>
                <Input
                  id="position_allowance"
                  type="number"
                  value={formData.position_allowance}
                  onChange={e => updateFormData({ position_allowance: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="professional_allowance">專業津貼</Label>
                <Input
                  id="professional_allowance"
                  type="number"
                  value={formData.professional_allowance}
                  onChange={e => updateFormData({ professional_allowance: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="holiday_bonus">節日獎金</Label>
                <Input
                  id="holiday_bonus"
                  type="number"
                  value={formData.holiday_bonus}
                  onChange={e => updateFormData({ holiday_bonus: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* 加班費 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">加班費</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax_free_overtime">免稅加班費</Label>
                <Input
                  id="tax_free_overtime"
                  type="number"
                  value={formData.tax_free_overtime}
                  onChange={e => updateFormData({ tax_free_overtime: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="taxable_overtime">應稅加班費</Label>
                <Input
                  id="taxable_overtime"
                  type="number"
                  value={formData.taxable_overtime}
                  onChange={e => updateFormData({ taxable_overtime: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* 扣款項目 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">扣款項目</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="labor_insurance_personal">勞保個人負擔</Label>
                <Input
                  id="labor_insurance_personal"
                  type="number"
                  value={formData.labor_insurance_personal}
                  onChange={e =>
                    updateFormData({ labor_insurance_personal: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="labor_pension_personal">勞退個人負擔</Label>
                <Input
                  id="labor_pension_personal"
                  type="number"
                  value={formData.labor_pension_personal}
                  onChange={e => updateFormData({ labor_pension_personal: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="health_insurance_personal">健保個人負擔</Label>
                <Input
                  id="health_insurance_personal"
                  type="number"
                  value={formData.health_insurance_personal}
                  onChange={e =>
                    updateFormData({ health_insurance_personal: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="leave_deduction">請假扣款</Label>
                <Input
                  id="leave_deduction"
                  type="number"
                  value={formData.leave_deduction}
                  onChange={e => updateFormData({ leave_deduction: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="late_deduction">遲到扣款</Label>
                <Input
                  id="late_deduction"
                  type="number"
                  value={formData.late_deduction}
                  onChange={e => updateFormData({ late_deduction: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="early_leave_deduction">早退扣款</Label>
                <Input
                  id="early_leave_deduction"
                  type="number"
                  value={formData.early_leave_deduction}
                  onChange={e => updateFormData({ early_leave_deduction: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{initialData ? '更新' : '新增'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalaryForm;
