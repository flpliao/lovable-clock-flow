
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { LeaveType } from '@/types/hr';

interface LeaveTypeFormDialogProps {
  open: boolean;
  onClose: () => void;
  leaveType?: LeaveType | null;
  isEditing: boolean;
}

export function LeaveTypeFormDialog({ open, onClose, leaveType, isEditing }: LeaveTypeFormDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name_zh: '',
    name_en: '',
    is_paid: false,
    annual_reset: true,
    max_days_per_year: '',
    max_days_per_month: '',
    requires_attachment: false,
    requires_approval: true,
    gender_restriction: '',
    description: '',
    is_active: true,
    sort_order: '0'
  });

  useEffect(() => {
    if (isEditing && leaveType) {
      setFormData({
        code: leaveType.code,
        name_zh: leaveType.name_zh,
        name_en: leaveType.name_en,
        is_paid: leaveType.is_paid,
        annual_reset: leaveType.annual_reset,
        max_days_per_year: leaveType.max_days_per_year?.toString() || '',
        max_days_per_month: leaveType.max_days_per_month?.toString() || '',
        requires_attachment: leaveType.requires_attachment,
        requires_approval: leaveType.requires_approval,
        gender_restriction: leaveType.gender_restriction || '',
        description: leaveType.description || '',
        is_active: leaveType.is_active,
        sort_order: leaveType.sort_order.toString()
      });
    } else {
      // 重置表單
      setFormData({
        code: '',
        name_zh: '',
        name_en: '',
        is_paid: false,
        annual_reset: true,
        max_days_per_year: '',
        max_days_per_month: '',
        requires_attachment: false,
        requires_approval: true,
        gender_restriction: '',
        description: '',
        is_active: true,
        sort_order: '0'
      });
    }
  }, [isEditing, leaveType, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        max_days_per_year: formData.max_days_per_year ? parseInt(formData.max_days_per_year) : null,
        max_days_per_month: formData.max_days_per_month ? parseInt(formData.max_days_per_month) : null,
        gender_restriction: formData.gender_restriction || null,
        sort_order: parseInt(formData.sort_order)
      };

      if (isEditing && leaveType) {
        await LeaveTypeService.updateLeaveType(leaveType.id, submitData);
        toast({
          title: "更新成功",
          description: `假別「${formData.name_zh}」已更新`,
        });
      } else {
        await LeaveTypeService.createLeaveType(submitData);
        toast({
          title: "新增成功",
          description: `假別「${formData.name_zh}」已新增`,
        });
      }

      onClose();
    } catch (error) {
      console.error('操作失敗:', error);
      toast({
        title: "操作失敗",
        description: "無法儲存假別設定",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '編輯假別' : '新增假別'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? '修改假別設定和規則' : '建立新的假別類型'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">假別代碼</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="例如：sick, annual"
                required
                disabled={isEditing && leaveType?.is_system_default}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">排序</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleInputChange('sort_order', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_zh">中文名稱</Label>
              <Input
                id="name_zh"
                value={formData.name_zh}
                onChange={(e) => handleInputChange('name_zh', e.target.value)}
                placeholder="例如：病假"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">英文名稱</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => handleInputChange('name_en', e.target.value)}
                placeholder="例如：Sick Leave"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">說明</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="假別說明和注意事項"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_days_per_year">年度上限天數</Label>
              <Input
                id="max_days_per_year"
                type="number"
                value={formData.max_days_per_year}
                onChange={(e) => handleInputChange('max_days_per_year', e.target.value)}
                placeholder="不限制請留空"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_days_per_month">每月上限天數</Label>
              <Input
                id="max_days_per_month"
                type="number"
                value={formData.max_days_per_month}
                onChange={(e) => handleInputChange('max_days_per_month', e.target.value)}
                placeholder="不限制請留空"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender_restriction">性別限制</Label>
            <Select
              value={formData.gender_restriction}
              onValueChange={(value) => handleInputChange('gender_restriction', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇性別限制（無限制請留空）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">無限制</SelectItem>
                <SelectItem value="male">限男性</SelectItem>
                <SelectItem value="female">限女性</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_paid"
                checked={formData.is_paid}
                onCheckedChange={(checked) => handleInputChange('is_paid', checked)}
              />
              <Label htmlFor="is_paid">有薪假</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="annual_reset"
                checked={formData.annual_reset}
                onCheckedChange={(checked) => handleInputChange('annual_reset', checked)}
              />
              <Label htmlFor="annual_reset">年度重置</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_approval"
                checked={formData.requires_approval}
                onCheckedChange={(checked) => handleInputChange('requires_approval', checked)}
              />
              <Label htmlFor="requires_approval">需要核准</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="requires_attachment"
                checked={formData.requires_attachment}
                onCheckedChange={(checked) => handleInputChange('requires_attachment', checked)}
              />
              <Label htmlFor="requires_attachment">需要附件</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">啟用</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '處理中...' : (isEditing ? '更新' : '新增')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
