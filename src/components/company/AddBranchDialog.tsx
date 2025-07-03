import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import React from 'react';
import { useCompanyManagementContext } from './CompanyManagementContext';

const AddBranchDialog = () => {
  const {
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    newBranch,
    setNewBranch,
    handleAddBranch
  } = useCompanyManagementContext();
  
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { toast } = useToast();

  const canAddBranch = isAdmin;

  console.log('AddBranchDialog - 對話框狀態:', { 
    isAddBranchDialogOpen, 
    canAddBranch, 
    userName: currentUser?.name 
  });

  if (!canAddBranch) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 AddBranchDialog: 提交新增營業處表單');
    console.log('📋 AddBranchDialog: 表單資料:', newBranch);
    console.log('👤 AddBranchDialog: 當前用戶:', currentUser?.name);

    // 基本驗證
    if (!newBranch.name?.trim()) {
      toast({
        title: "驗證失敗",
        description: "營業處名稱不能為空",
        variant: "destructive"
      });
      return;
    }

    if (!newBranch.code?.trim()) {
      toast({
        title: "驗證失敗", 
        description: "營業處代碼不能為空",
        variant: "destructive"
      });
      return;
    }

    if (!newBranch.address?.trim()) {
      toast({
        title: "驗證失敗",
        description: "地址不能為空", 
        variant: "destructive"
      });
      return;
    }

    if (!newBranch.phone?.trim()) {
      toast({
        title: "驗證失敗",
        description: "電話不能為空",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('✅ AddBranchDialog: 呼叫新增營業處功能');
      await handleAddBranch();
      console.log('✅ AddBranchDialog: 新增營業處成功');
    } catch (error) {
      console.error('❌ AddBranchDialog: 新增營業處失敗:', error);
      toast({
        title: "新增失敗",
        description: "新增營業處時發生錯誤，請重試",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    console.log('🚪 AddBranchDialog: 關閉新增營業處對話框');
    setIsAddBranchDialogOpen(false);
    // 重設表單
    setNewBranch({
      name: '',
      code: '',
      type: 'branch',
      address: '',
      phone: '',
      email: '',
      manager_name: '',
      manager_contact: '',
      business_license: ''
    });
  };

  return (
    <Dialog open={isAddBranchDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
              onClick={handleClose}
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
