
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SalaryStructureFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}

const SalaryStructureFormDialog: React.FC<SalaryStructureFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title
}) => {
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    level: 1,
    base_salary: 0,
    overtime_rate: 1.34,
    holiday_rate: 2.0,
    is_active: true,
    effective_date: new Date().toISOString().split('T')[0],
    // 津貼項目
    transport_allowance: 0,
    meal_allowance: 0,
    phone_allowance: 0,
    housing_allowance: 0,
    performance_allowance: 0
  });

  useEffect(() => {
    if (initialData) {
      const allowances = initialData.allowances || {};
      setFormData({
        position: initialData.position || '',
        department: initialData.department || '',
        level: initialData.level || 1,
        base_salary: initialData.base_salary || 0,
        overtime_rate: initialData.overtime_rate || 1.34,
        holiday_rate: initialData.holiday_rate || 2.0,
        is_active: initialData.is_active || true,
        effective_date: initialData.effective_date || new Date().toISOString().split('T')[0],
        transport_allowance: allowances.transport || 0,
        meal_allowance: allowances.meal || 0,
        phone_allowance: allowances.phone || 0,
        housing_allowance: allowances.housing || 0,
        performance_allowance: allowances.performance || 0
      });
    } else {
      setFormData({
        position: '',
        department: '',
        level: 1,
        base_salary: 0,
        overtime_rate: 1.34,
        holiday_rate: 2.0,
        is_active: true,
        effective_date: new Date().toISOString().split('T')[0],
        transport_allowance: 0,
        meal_allowance: 0,
        phone_allowance: 0,
        housing_allowance: 0,
        performance_allowance: 0
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 建構津貼物件
    const allowances: Record<string, number> = {};
    if (formData.transport_allowance > 0) allowances.transport = formData.transport_allowance;
    if (formData.meal_allowance > 0) allowances.meal = formData.meal_allowance;
    if (formData.phone_allowance > 0) allowances.phone = formData.phone_allowance;
    if (formData.housing_allowance > 0) allowances.housing = formData.housing_allowance;
    if (formData.performance_allowance > 0) allowances.performance = formData.performance_allowance;

    const submitData = {
      position: formData.position,
      department: formData.department,
      level: formData.level,
      base_salary: formData.base_salary,
      overtime_rate: formData.overtime_rate,
      holiday_rate: formData.holiday_rate,
      is_active: formData.is_active,
      effective_date: formData.effective_date,
      allowances,
      benefits: {} // 暫時空物件
    };

    onSubmit(submitData);
  };

  const totalAllowances = formData.transport_allowance + formData.meal_allowance + 
                         formData.phone_allowance + formData.housing_allowance + 
                         formData.performance_allowance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">職位名稱</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="例：軟體工程師"
                required
              />
            </div>

            <div>
              <Label htmlFor="department">部門</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="例：IT部"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="level">職級</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="10"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="overtime_rate">加班費率</Label>
              <Input
                id="overtime_rate"
                type="number"
                step="0.01"
                min="1"
                value={formData.overtime_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, overtime_rate: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="holiday_rate">假日費率</Label>
              <Input
                id="holiday_rate"
                type="number"
                step="0.01"
                min="1"
                value={formData.holiday_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, holiday_rate: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="base_salary">基本薪資 (月薪)</Label>
            <Input
              id="base_salary"
              type="number"
              min="0"
              value={formData.base_salary}
              onChange={(e) => setFormData(prev => ({ ...prev, base_salary: Number(e.target.value) }))}
              placeholder="例：50000"
              required
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">津貼設定</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transport_allowance">交通津貼</Label>
                <Input
                  id="transport_allowance"
                  type="number"
                  min="0"
                  value={formData.transport_allowance}
                  onChange={(e) => setFormData(prev => ({ ...prev, transport_allowance: Number(e.target.value) }))}
                  placeholder="例：2000"
                />
              </div>

              <div>
                <Label htmlFor="meal_allowance">餐費津貼</Label>
                <Input
                  id="meal_allowance"
                  type="number"
                  min="0"
                  value={formData.meal_allowance}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal_allowance: Number(e.target.value) }))}
                  placeholder="例：1000"
                />
              </div>

              <div>
                <Label htmlFor="phone_allowance">電話津貼</Label>
                <Input
                  id="phone_allowance"
                  type="number"
                  min="0"
                  value={formData.phone_allowance}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_allowance: Number(e.target.value) }))}
                  placeholder="例：800"
                />
              </div>

              <div>
                <Label htmlFor="housing_allowance">住房津貼</Label>
                <Input
                  id="housing_allowance"
                  type="number"
                  min="0"
                  value={formData.housing_allowance}
                  onChange={(e) => setFormData(prev => ({ ...prev, housing_allowance: Number(e.target.value) }))}
                  placeholder="例：5000"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="performance_allowance">績效津貼</Label>
                <Input
                  id="performance_allowance"
                  type="number"
                  min="0"
                  value={formData.performance_allowance}
                  onChange={(e) => setFormData(prev => ({ ...prev, performance_allowance: Number(e.target.value) }))}
                  placeholder="例：3000"
                />
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              津貼總額: <span className="font-medium">NT$ {totalAllowances.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="effective_date">生效日期</Label>
              <Input
                id="effective_date"
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData(prev => ({ ...prev, effective_date: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">啟用此薪資結構</Label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>基本薪資:</span>
                <span>NT$ {formData.base_salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>津貼總額:</span>
                <span>NT$ {totalAllowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-1">
                <span>總計:</span>
                <span>NT$ {(formData.base_salary + totalAllowances).toLocaleString()}</span>
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

export default SalaryStructureFormDialog;
