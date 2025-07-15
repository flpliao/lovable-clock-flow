import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBranchStore } from '@/stores/branchStore';
import { NewBranch } from '@/types/company';
import { useState } from 'react';

interface AddBranchDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddBranchDialog = ({ open, onClose }: AddBranchDialogProps) => {
  const { addBranch } = useBranchStore();

  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    manager_contact: '',
    business_license: '',
  });

  const handleSubmit = async () => {
    const success = await addBranch(newBranch);
    if (success) {
      onClose();
      setNewBranch({
        name: '',
        code: '',
        type: 'branch',
        address: '',
        phone: '',
        email: '',
        manager_name: '',
        manager_contact: '',
        business_license: '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增單位</DialogTitle>
          <DialogDescription>請填寫單位的基本資訊。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名稱
            </Label>
            <Input
              id="name"
              value={newBranch.name}
              onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              代碼
            </Label>
            <Input
              id="code"
              value={newBranch.code}
              onChange={e => setNewBranch({ ...newBranch, code: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              地址
            </Label>
            <Input
              id="address"
              value={newBranch.address}
              onChange={e => setNewBranch({ ...newBranch, address: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              電話
            </Label>
            <Input
              id="phone"
              value={newBranch.phone}
              onChange={e => setNewBranch({ ...newBranch, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newBranch.email}
              onChange={e => setNewBranch({ ...newBranch, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager_name" className="text-right">
              負責人
            </Label>
            <Input
              id="manager_name"
              value={newBranch.manager_name}
              onChange={e => setNewBranch({ ...newBranch, manager_name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager_contact" className="text-right">
              負責人聯絡方式
            </Label>
            <Input
              id="manager_contact"
              value={newBranch.manager_contact}
              onChange={e => setNewBranch({ ...newBranch, manager_contact: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="business_license" className="text-right">
              營業執照
            </Label>
            <Input
              id="business_license"
              value={newBranch.business_license}
              onChange={e => setNewBranch({ ...newBranch, business_license: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranchDialog;
