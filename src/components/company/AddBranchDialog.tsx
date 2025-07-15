import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { useCompanyStore } from '@/stores/companyStore';
import { NewBranch } from '@/types/company';
import React, { useState } from 'react';

interface AddBranchDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddBranchDialog = ({ open, onClose }: AddBranchDialogProps) => {
  const { toast } = useToast();
  const { company } = useCompanyStore();
  const { addBranch, setLoading } = useBranchStore();

  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    phone: '',
    manager_name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company?.id) {
      toast({
        title: '錯誤',
        description: '沒有公司ID，無法新增單位',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const createdBranch = await branchService.addBranch(company.id, newBranch);
      addBranch(createdBranch);

      toast({
        title: '成功',
        description: '單位新增成功',
      });

      // 重置表單
      setNewBranch({
        name: '',
        code: '',
        type: 'branch',
        address: '',
        phone: '',
        manager_name: '',
      });

      onClose();
    } catch (error) {
      console.error('新增單位失敗:', error);
      toast({
        title: '錯誤',
        description: error instanceof Error ? error.message : '新增單位失敗',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NewBranch, value: string) => {
    setNewBranch(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增單位</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">單位名稱</Label>
              <Input
                id="name"
                value={newBranch.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="請輸入單位名稱"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">單位代碼</Label>
              <Input
                id="code"
                value={newBranch.code}
                onChange={e => handleInputChange('code', e.target.value)}
                placeholder="請輸入單位代碼"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">地址</Label>
            <Input
              id="address"
              value={newBranch.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder="請輸入地址"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                value={newBranch.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="請輸入電話"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">負責人</Label>
              <Input
                id="manager"
                value={newBranch.manager_name}
                onChange={e => handleInputChange('manager_name', e.target.value)}
                placeholder="請輸入負責人"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '新增中...' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranchDialog;
