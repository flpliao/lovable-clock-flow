import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { useCompanyManagementContext } from './CompanyManagementContext';

const EditBranchDialog = () => {
  const {
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    currentBranch,
    setCurrentBranch,
    handleEditBranch,
  } = useCompanyManagementContext();

  if (!currentBranch) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEditBranch();
  };

  return (
    <Dialog open={isEditBranchDialogOpen} onOpenChange={setIsEditBranchDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>編輯單位</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">單位名稱 *</Label>
              <Input
                id="edit-name"
                value={currentBranch.name}
                onChange={e => setCurrentBranch({ ...currentBranch, name: e.target.value })}
                placeholder="請輸入單位名稱"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-code">單位代碼 *</Label>
              <Input
                id="edit-code"
                value={currentBranch.code}
                onChange={e => setCurrentBranch({ ...currentBranch, code: e.target.value })}
                placeholder="請輸入單位代碼"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-address">地址 *</Label>
            <Input
              id="edit-address"
              value={currentBranch.address}
              onChange={e => setCurrentBranch({ ...currentBranch, address: e.target.value })}
              placeholder="請輸入完整地址"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-phone">電話 *</Label>
              <Input
                id="edit-phone"
                value={currentBranch.phone}
                onChange={e => setCurrentBranch({ ...currentBranch, phone: e.target.value })}
                placeholder="請輸入聯絡電話"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={currentBranch.email || ''}
                onChange={e => setCurrentBranch({ ...currentBranch, email: e.target.value })}
                placeholder="請輸入Email地址"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-manager-name">負責人姓名</Label>
              <Input
                id="edit-manager-name"
                value={currentBranch.manager_name || ''}
                onChange={e => setCurrentBranch({ ...currentBranch, manager_name: e.target.value })}
                placeholder="請輸入負責人姓名"
              />
            </div>
            <div>
              <Label htmlFor="edit-manager-contact">負責人聯絡方式</Label>
              <Input
                id="edit-manager-contact"
                value={currentBranch.manager_contact || ''}
                onChange={e =>
                  setCurrentBranch({ ...currentBranch, manager_contact: e.target.value })
                }
                placeholder="請輸入負責人聯絡方式"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-business-license">營業執照號碼</Label>
            <Input
              id="edit-business-license"
              value={currentBranch.business_license || ''}
              onChange={e =>
                setCurrentBranch({ ...currentBranch, business_license: e.target.value })
              }
              placeholder="請輸入營業執照號碼"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-is-active"
              checked={currentBranch.is_active}
              onCheckedChange={checked =>
                setCurrentBranch({ ...currentBranch, is_active: checked })
              }
            />
            <Label htmlFor="edit-is-active">營運中</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditBranchDialogOpen(false)}
            >
              取消
            </Button>
            <Button type="submit">儲存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranchDialog;
