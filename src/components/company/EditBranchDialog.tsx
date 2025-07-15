import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { Branch } from '@/types/company';
import React, { useEffect, useState } from 'react';

interface EditBranchDialogProps {
  open: boolean;
  onClose: () => void;
  branch: Branch | null;
}

const EditBranchDialog = ({ open, onClose, branch }: EditBranchDialogProps) => {
  const { toast } = useToast();
  const { updateBranch, setLoading } = useBranchStore();

  const [editedBranch, setEditedBranch] = useState<Partial<Branch>>({
    name: '',
    code: '',
    address: '',
    phone: '',
    manager_name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 當 branch 改變時，更新 editedBranch
  useEffect(() => {
    if (branch) {
      setEditedBranch({
        name: branch.name || '',
        code: branch.code || '',
        address: branch.address || '',
        phone: branch.phone || '',
        manager_name: branch.manager_name || '',
      });
    }
  }, [branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!branch) {
      toast({
        title: '錯誤',
        description: '找不到要編輯的單位',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      await branchService.updateBranch(branch.id, editedBranch);
      updateBranch(branch.id, editedBranch);

      toast({
        title: '成功',
        description: '單位更新成功',
      });

      onClose();
    } catch (error) {
      console.error('更新單位失敗:', error);
      toast({
        title: '錯誤',
        description: error instanceof Error ? error.message : '更新單位失敗',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Branch, value: string) => {
    setEditedBranch(prev => ({ ...prev, [field]: value }));
  };

  // 如果沒有 branch 資料，不顯示對話框
  if (!branch) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯單位</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">單位名稱</Label>
              <Input
                id="name"
                value={editedBranch.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="請輸入單位名稱"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">單位代碼</Label>
              <Input
                id="code"
                value={editedBranch.code}
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
              value={editedBranch.address}
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
                value={editedBranch.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="請輸入電話"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">負責人</Label>
              <Input
                id="manager"
                value={editedBranch.manager_name}
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
              {isSubmitting ? '更新中...' : '更新'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranchDialog;
