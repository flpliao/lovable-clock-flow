
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';

const AddBranchDialog = () => {
  const {
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    newBranch,
    setNewBranch,
    handleAddBranch
  } = useCompanyManagementContext();
  const { currentUser } = useUser();

  // 允許廖俊雄和管理員新增營業處
  const canAddBranch = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  if (!canAddBranch) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交新增營業處表單，當前用戶:', currentUser?.name);
    handleAddBranch();
  };

  return (
    <Dialog open={isAddBranchDialogOpen} onOpenChange={setIsAddBranchDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          新增營業處
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>新增營業處</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">營業處名稱 *</Label>
              <Input
                id="name"
                value={newBranch.name}
                onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                placeholder="請輸入營業處名稱"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">營業處代碼 *</Label>
              <Input
                id="code"
                value={newBranch.code}
                onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                placeholder="請輸入營業處代碼"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="type">類型</Label>
            <Select
              value={newBranch.type}
              onValueChange={(value: 'headquarters' | 'branch' | 'store') => 
                setNewBranch({ ...newBranch, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇營業處類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarters">總公司</SelectItem>
                <SelectItem value="branch">分公司</SelectItem>
                <SelectItem value="store">門市</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">地址 *</Label>
            <Input
              id="address"
              value={newBranch.address}
              onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
              placeholder="請輸入完整地址"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">電話 *</Label>
              <Input
                id="phone"
                value={newBranch.phone}
                onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                placeholder="請輸入聯絡電話"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newBranch.email || ''}
                onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                placeholder="請輸入Email地址"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager_name">負責人姓名</Label>
              <Input
                id="manager_name"
                value={newBranch.manager_name || ''}
                onChange={(e) => setNewBranch({ ...newBranch, manager_name: e.target.value })}
                placeholder="請輸入負責人姓名"
              />
            </div>
            <div>
              <Label htmlFor="manager_contact">負責人聯絡方式</Label>
              <Input
                id="manager_contact"
                value={newBranch.manager_contact || ''}
                onChange={(e) => setNewBranch({ ...newBranch, manager_contact: e.target.value })}
                placeholder="請輸入負責人聯絡方式"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="business_license">營業執照號碼</Label>
            <Input
              id="business_license"
              value={newBranch.business_license || ''}
              onChange={(e) => setNewBranch({ ...newBranch, business_license: e.target.value })}
              placeholder="請輸入營業執照號碼"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddBranchDialogOpen(false)}
            >
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

export default AddBranchDialog;
