
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

interface SalaryStructureQuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  title: string;
}

const SalaryStructureQuickAddDialog: React.FC<SalaryStructureQuickAddDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
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
    effective_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!open) {
      // 重置表單
      setFormData({
        position: '',
        department: '',
        level: 1,
        base_salary: 0,
        overtime_rate: 1.34,
        holiday_rate: 2.0,
        is_active: true,
        effective_date: new Date().toISOString().split('T')[0]
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      position: formData.position,
      department: formData.department,
      level: formData.level,
      base_salary: formData.base_salary,
      overtime_rate: formData.overtime_rate,
      holiday_rate: formData.holiday_rate,
      is_active: formData.is_active,
      effective_date: formData.effective_date,
      allowances: {}, // 空津貼物件
      benefits: {} // 空福利物件
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <p className="text-gray-600 mb-2">預覽</p>
              <div className="flex justify-between">
                <span>基本薪資:</span>
                <span className="font-medium">NT$ {formData.base_salary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>職位: {formData.position || '未設定'}</span>
                <span>部門: {formData.department || '未設定'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              新增
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryStructureQuickAddDialog;
