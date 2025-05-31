
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
import { usePayrollManagement } from '@/hooks/usePayrollManagement';
import { formatCurrency } from '@/utils/payrollUtils';
import StaffSelector from './StaffSelector';

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
    health_insurance: 0,
    gross_salary: 0,
    net_salary: 0,
    status: 'draft'
  });

  useEffect(() => {
    if (open) {
      console.log('💰 PayrollFormDialog 開啟，開始檢查員工資料載入狀態');
    }
  }, [open]);

  // 初始化表單資料
  useEffect(() => {
    if (initialData) {
      console.log('📝 載入編輯資料:', initialData);
      setFormData({
        staff_id: initialData.staff_id || '',
        salary_structure_id: initialData.salary_structure_id || '',
        pay_period_start: initialData.pay_period_start || '',
        pay_period_end: initialData.pay_period_end || '',
        base_salary: Number(initialData.base_salary) || 0,
        overtime_hours: Number(initialData.overtime_hours) || 0,
        overtime_pay: Number(initialData.overtime_pay) || 0,
        holiday_hours: Number(initialData.holiday_hours) || 0,
        holiday_pay: Number(initialData.holiday_pay) || 0,
        allowances: Number(initialData.allowances) || 0,
        deductions: Number(initialData.deductions) || 0,
        tax: Number(initialData.tax) || 0,
        labor_insurance: Number(initialData.labor_insurance) || 0,
        health_insurance: Number(initialData.health_insurance) || 0,
        gross_salary: Number(initialData.gross_salary) || 0,
        net_salary: Number(initialData.net_salary) || 0,
        status: initialData.status || 'draft'
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
        health_insurance: 0,
        gross_salary: 0,
        net_salary: 0,
        status: 'draft'
      });
    }
  }, [initialData, open]);

  // 當薪資結構改變時，自動填入基本資料
  const handleSalaryStructureChange = (structureId: string) => {
    const structure = salaryStructures.find(s => s.id === structureId);
    if (structure) {
      // 安全地計算津貼總額
      let allowancesTotal: number = 0;
      if (structure.allowances && typeof structure.allowances === 'object') {
        const allowanceValues = Object.values(structure.allowances) as unknown[];
        allowancesTotal = allowanceValues.reduce<number>((sum: number, val: unknown) => {
          const numVal = Number(val) || 0;
          return sum + numVal;
        }, 0);
      }
      
      setFormData(prev => {
        const newData = {
          ...prev,
          salary_structure_id: structureId,
          base_salary: structure.base_salary,
          allowances: allowancesTotal
        };
        
        // 重新計算薪資
        const calculatedData = calculateSalaries(newData);
        return calculatedData;
      });
    }
  };

  // 計算加班費
  const calculateOvertimePay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8; // 假設月薪 / 30天 / 8小時
      return Math.round(hours * hourlyRate * structure.overtime_rate);
    }
    return 0;
  };

  // 計算假日工作費
  const calculateHolidayPay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8;
      return Math.round(hours * hourlyRate * structure.holiday_rate);
    }
    return 0;
  };

  // 計算應發和實發薪資
  const calculateSalaries = (data: typeof formData) => {
    const grossSalary = data.base_salary + data.overtime_pay + data.holiday_pay + data.allowances;
    const netSalary = grossSalary - data.deductions - data.tax - data.labor_insurance - data.health_insurance;
    
    return {
      ...data,
      gross_salary: grossSalary,
      net_salary: netSalary
    };
  };

  // 更新表單資料並重新計算
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      return calculateSalaries(newData);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 確保所有必要欄位都有值
    const submitData = {
      ...formData,
      // 確保數值欄位是數字類型
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StaffSelector
              value={formData.staff_id}
              onValueChange={(value) => updateFormData({ staff_id: value })}
              required
            />

            <div>
              <Label htmlFor="salary_structure_id">薪資結構</Label>
              <Select value={formData.salary_structure_id} onValueChange={handleSalaryStructureChange}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇薪資結構" />
                </SelectTrigger>
                <SelectContent>
                  {salaryStructures.length === 0 ? (
                    <SelectItem value="" disabled>
                      尚未建立薪資結構
                    </SelectItem>
                  ) : (
                    salaryStructures.map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.position} - {structure.department} (Level {structure.level})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {salaryStructures.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  請先建立薪資結構
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pay_period_start">薪資期間開始</Label>
              <Input
                type="date"
                value={formData.pay_period_start}
                onChange={(e) => updateFormData({ pay_period_start: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="pay_period_end">薪資期間結束</Label>
              <Input
                type="date"
                value={formData.pay_period_end}
                onChange={(e) => updateFormData({ pay_period_end: e.target.value })}
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
                onChange={(e) => updateFormData({ base_salary: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="allowances">津貼</Label>
              <Input
                type="number"
                value={formData.allowances}
                onChange={(e) => updateFormData({ allowances: Number(e.target.value) })}
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
                  const overtimePay = calculateOvertimePay(hours);
                  updateFormData({ 
                    overtime_hours: hours,
                    overtime_pay: overtimePay
                  });
                }}
              />
            </div>

            <div>
              <Label htmlFor="overtime_pay">加班費</Label>
              <Input
                type="number"
                value={formData.overtime_pay}
                onChange={(e) => updateFormData({ overtime_pay: Number(e.target.value) })}
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
                  const holidayPay = calculateHolidayPay(hours);
                  updateFormData({ 
                    holiday_hours: hours,
                    holiday_pay: holidayPay
                  });
                }}
              />
            </div>

            <div>
              <Label htmlFor="holiday_pay">假日工作費</Label>
              <Input
                type="number"
                value={formData.holiday_pay}
                onChange={(e) => updateFormData({ holiday_pay: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="tax">所得稅</Label>
              <Input
                type="number"
                value={formData.tax}
                onChange={(e) => updateFormData({ tax: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="labor_insurance">勞保</Label>
              <Input
                type="number"
                value={formData.labor_insurance}
                onChange={(e) => updateFormData({ labor_insurance: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="health_insurance">健保</Label>
              <Input
                type="number"
                value={formData.health_insurance}
                onChange={(e) => updateFormData({ health_insurance: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="deductions">其他扣款</Label>
              <Input
                type="number"
                value={formData.deductions}
                onChange={(e) => updateFormData({ deductions: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">應發薪資: </span>
                <span className="text-green-600">{formatCurrency(formData.gross_salary)}</span>
              </div>
              <div>
                <span className="font-medium">實發薪資: </span>
                <span className="text-blue-600 font-bold">{formatCurrency(formData.net_salary)}</span>
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
