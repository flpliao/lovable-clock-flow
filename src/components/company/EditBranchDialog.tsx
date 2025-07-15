import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useBranchStore } from '@/stores/branchStore';
import { Branch } from '@/types/company';
import { Edit } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface EditBranchDialogProps {
  open: boolean;
  onClose: () => void;
  branch: Branch | null;
}

const EditBranchDialog = ({ open, onClose, branch }: EditBranchDialogProps) => {
  const { toast } = useToast();
  const { updateBranch } = useBranchStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    manager_contact: '',
    business_license: '',
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        code: branch.code || '',
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        manager_name: branch.manager_name || '',
        manager_contact: branch.manager_contact || '',
        business_license: branch.business_license || '',
      });
    }
  }, [branch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code) {
      toast({
        title: '請填寫必要資訊',
        description: '單位名稱和代碼為必填欄位',
        variant: 'destructive',
      });
      return;
    }

    if (!branch) {
      toast({
        title: '錯誤',
        description: '找不到要編輯的單位',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateBranch(branch.id, formData);
      if (success) {
        toast({
          title: '更新成功',
          description: `單位 ${formData.name} 已成功更新`,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '更新單位時發生錯誤',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            編輯單位
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">單位名稱 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="請輸入單位名稱"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">單位代碼 *</Label>
              <Input
                id="code"
                value={formData.code}
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
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder="請輸入地址"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="請輸入電話"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">電子信箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="請輸入電子信箱"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager_name">負責人姓名</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={e => handleInputChange('manager_name', e.target.value)}
                placeholder="請輸入負責人姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager_contact">負責人聯絡方式</Label>
              <Input
                id="manager_contact"
                value={formData.manager_contact}
                onChange={e => handleInputChange('manager_contact', e.target.value)}
                placeholder="請輸入負責人聯絡方式"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_license">營業執照號碼</Label>
            <Input
              id="business_license"
              value={formData.business_license}
              onChange={e => handleInputChange('business_license', e.target.value)}
              placeholder="請輸入營業執照號碼"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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
