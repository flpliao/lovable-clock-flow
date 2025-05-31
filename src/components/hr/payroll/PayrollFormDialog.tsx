
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffManagementSafe } from '@/components/company/hooks/useStaffManagementSafe';
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import { formatCurrency } from '@/utils/payrollUtils';

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
  const { staffList } = useStaffManagementSafe();
  const { salaryStructures } = usePayrollManagement();
  
  const [formData, setFormData] = useState({
    staff_id: '',
    salary_structure_id: '',
    pay_period_start: '',
    pay_period_end: '',
    base_salary: 0,
    overtime_hours: 0,
    overtime_pay: 0,
    holiday_hours: 0,
    holiday_pay: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
    labor_insurance: 0,
    health_insurance: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        staff_id: initialData.staff_id || '',
        salary_structure_id: initialData.salary_structure_id || '',
        pay_period_start: initialData.pay_period_start || '',
        pay_period_end: initialData.pay_period_end || '',
        base_salary: initialData.base_salary || 0,
        overtime_hours: initialData.overtime_hours || 0,
        overtime_pay: initialData.overtime_pay || 0,
        holiday_hours: initialData.holiday_hours || 0,
        holiday_pay: initialData.holiday_pay || 0,
        allowances: initialData.allowances || 0,
        deductions: initialData.deductions || 0,
        tax: initialData.tax || 0,
        labor_insurance: initialData.labor_insurance || 0,
        health_insurance: initialData.health_insurance || 0
      });
    } else {
      // 重置表單
      setFormData({
        staff_id: '',
        salary_structure_id: '',
        pay_period_start: '',
        pay_period_end: '',
        base_salary: 0,
        overtime_hours: 0,
        overtime_pay: 0,
        holiday_hours: 0,
        holiday_pay: 0,
        allowances: 0,
        deductions: 0,
        tax: 0,
        labor_insurance: 0,
        health_insurance: 0
      });
    }
  }, [initialData, open]);

  const handleSalaryStructureChange = (structureId: string) => {
    const structure = salaryStructures.find(s => s.id === structureId);
    if (structure) {
      // 安全地計算津貼總額，確保型別正確
      let allowancesTotal: number = 0;
      if (structure.allowances && typeof structure.allowances === 'object') {
        allowancesTotal = Object.values(structure.allowances).reduce((sum: number, val: any) => {
          const numVal = Number(val) || 0;
          return sum + numVal;
        }, 0);
      }
      
      setFormData(prev => ({
        ...prev,
        salary_structure_id: structureId,
        base_salary: structure.base_salary,
        allowances: allowancesTotal
      }));
    }
  };

  const calculateOvertimePay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8; // 假設月薪 / 30天 / 8小時
      return hours * hourlyRate * structure.overtime_rate;
    }
    return 0;
  };

  const calculateHolidayPay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8;
      return hours * hourlyRate * structure.holiday_rate;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const grossSalary = formData.base_salary + formData.overtime_pay + formData.holiday_pay + formData.allowances;
  const netSalary = grossSalary - formData.deductions - formData.tax - formData.labor_insurance - formData.health_insurance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="staff_id">員工</Label>
              <Select value={formData.staff_id} onValueChange={(value) => setFormData(prev => ({ ...prev, staff_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇員工" />
                </SelectTrigger>
                <SelectContent>
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} - {staff.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary_structure_id">薪資結構</Label>
              <Select value={formData.salary_structure_id} onValueChange={handleSalaryStructureChange}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇薪資結構" />
                </SelectTrigger>
                <SelectContent>
                  {salaryStructures.map((structure) => (
                    <SelectItem key={structure.id} value={structure.id}>
                      {structure.position} - {structure.department} (Level {structure.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pay_period_start">薪資期間開始</Label>
              <Input
                type="date"
                value={formData.pay_period_start}
                onChange={(e) => setFormData(prev => ({ ...prev, pay_period_start: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="pay_period_end">薪資期間結束</Label>
              <Input
                type="date"
                value={formData.pay_period_end}
                onChange={(e) => setFormData(prev => ({ ...prev, pay_period_end: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="base_salary">基本薪資</Label>
              <Input
                type="number"
                value={formData.base_salary}
                onChange={(e) => setFormData(prev => ({ ...prev, base_salary: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="allowances">津貼</Label>
              <Input
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData(prev => ({ ...prev, allowances: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="overtime_hours">加班時數</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.overtime_hours}
                onChange={(e) => {
                  const hours = Number(e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    overtime_hours: hours,
                    overtime_pay: calculateOvertimePay(hours)
                  }));
                }}
              />
            </div>

            <div>
              <Label htmlFor="overtime_pay">加班費</Label>
              <Input
                type="number"
                value={formData.overtime_pay}
                onChange={(e) => setFormData(prev => ({ ...prev, overtime_pay: Number(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="holiday_hours">假日工作時數</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.holiday_hours}
                onChange={(e) => {
                  const hours = Number(e.target.value);
                  setFormData(prev => ({ 
                    ...prev, 
                    holiday_hours: hours,
                    holiday_pay: calculateHolidayPay(hours)
                  }));
                }}
              />
            </div>

            <div>
              <Label htmlFor="holiday_pay">假日工作費</Label>
              <Input
                type="number"
                value={formData.holiday_pay}
                onChange={(e) => setFormData(prev => ({ ...prev, holiday_pay: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tax">所得稅</Label>
              <Input
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData(prev => ({ ...prev, tax: Number(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="labor_insurance">勞保</Label>
              <Input
                type="number"
                value={formData.labor_insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, labor_insurance: Number(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="health_insurance">健保</Label>
              <Input
                type="number"
                value={formData.health_insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, health_insurance: Number(e.target.value) }))}
              />
            </div>

            <div>
              <Label htmlFor="deductions">其他扣款</Label>
              <Input
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData(prev => ({ ...prev, deductions: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">應發薪資: </span>
                <span className="text-green-600">{formatCurrency(grossSalary)}</span>
              </div>
              <div>
                <span className="font-medium">實發薪資: </span>
                <span className="text-blue-600 font-bold">{formatCurrency(netSalary)}</span>
              </div>
            </div>
          </div>

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
