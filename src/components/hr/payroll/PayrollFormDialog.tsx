
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import { usePayrollForm } from './hooks/usePayrollForm';
import PayrollBasicFields from './forms/PayrollBasicFields';
import PayrollPeriodFields from './forms/PayrollPeriodFields';
import PayrollSalaryFields from './forms/PayrollSalaryFields';
import PayrollOvertimeFields from './forms/PayrollOvertimeFields';
import PayrollDeductionFields from './forms/PayrollDeductionFields';
import PayrollSummary from './forms/PayrollSummary';

interface PayrollFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}

const PayrollFormDialog: React.FC<PayrollFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title
}) => {
  const { salaryStructures } = usePayrollManagement();
  const {
    formData,
    updateFormData,
    handleSalaryStructureChange,
    handleOvertimeHoursChange,
    handleHolidayHoursChange
  } = usePayrollForm(initialData, salaryStructures);

  useEffect(() => {
    if (open) {
      console.log('💰 PayrollFormDialog 開啟，開始檢查員工資料載入狀態');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證必填欄位
    if (!formData.staff_id) {
      console.error('❌ 員工ID為必填');
      return;
    }
    
    if (!formData.salary_structure_id) {
      console.error('❌ 薪資結構為必填');
      return;
    }
    
    if (!formData.pay_period_start) {
      console.error('❌ 薪資期間開始為必填');
      return;
    }
    
    if (!formData.pay_period_end) {
      console.error('❌ 薪資期間結束為必填');
      return;
    }
    
    const submitData = {
      ...formData,
      base_salary: Number(formData.base_salary),
      overtime_hours: Number(formData.overtime_hours),
      overtime_pay: Number(formData.overtime_pay),
      holiday_hours: Number(formData.holiday_hours),
      holiday_pay: Number(formData.holiday_pay),
      allowances: Number(formData.allowances),
      deductions: Number(formData.deductions),
      tax: Number(formData.tax),
      labor_insurance: Number(formData.labor_insurance),
      health_insurance: Number(formData.health_insurance),
      gross_salary: Number(formData.gross_salary),
      net_salary: Number(formData.net_salary)
    };

    console.log('💾 提交薪資記錄資料:', submitData);
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <PayrollBasicFields
            staffId={formData.staff_id}
            salaryStructureId={formData.salary_structure_id}
            salaryStructures={salaryStructures}
            onStaffChange={(value) => updateFormData({ staff_id: value })}
            onSalaryStructureChange={handleSalaryStructureChange}
          />

          <PayrollPeriodFields
            startDate={formData.pay_period_start}
            endDate={formData.pay_period_end}
            onStartDateChange={(value) => updateFormData({ pay_period_start: value })}
            onEndDateChange={(value) => updateFormData({ pay_period_end: value })}
          />

          <PayrollSalaryFields
            baseSalary={formData.base_salary}
            allowances={formData.allowances}
            onBaseSalaryChange={(value) => updateFormData({ base_salary: value })}
            onAllowancesChange={(value) => updateFormData({ allowances: value })}
          />

          <PayrollOvertimeFields
            overtimeHours={formData.overtime_hours}
            overtimePay={formData.overtime_pay}
            holidayHours={formData.holiday_hours}
            holidayPay={formData.holiday_pay}
            onOvertimeHoursChange={handleOvertimeHoursChange}
            onOvertimePayChange={(value) => updateFormData({ overtime_pay: value })}
            onHolidayHoursChange={handleHolidayHoursChange}
            onHolidayPayChange={(value) => updateFormData({ holiday_pay: value })}
          />

          <PayrollDeductionFields
            tax={formData.tax}
            laborInsurance={formData.labor_insurance}
            healthInsurance={formData.health_insurance}
            deductions={formData.deductions}
            onTaxChange={(value) => updateFormData({ tax: value })}
            onLaborInsuranceChange={(value) => updateFormData({ labor_insurance: value })}
            onHealthInsuranceChange={(value) => updateFormData({ health_insurance: value })}
            onDeductionsChange={(value) => updateFormData({ deductions: value })}
          />

          <PayrollSummary
            grossSalary={formData.gross_salary}
            netSalary={formData.net_salary}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              {initialData ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollFormDialog;
