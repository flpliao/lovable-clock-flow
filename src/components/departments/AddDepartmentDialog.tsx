
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useUser } from '@/contexts/UserContext';

const AddDepartmentDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newDepartment, 
    setNewDepartment, 
    handleAddDepartment 
  } = useDepartmentManagementContext();
  
  const { isAdmin, currentUser } = useUser();

  // 檢查權限：管理員或廖俊雄可以新增部門
  const canAddDepartment = isAdmin() || currentUser?.name === '廖俊雄';

  if (!canAddDepartment) {
    return null;
  }

  const handleSubmit = async () => {
    console.log('🚀 提交新增部門:', newDepartment);
    await handleAddDepartment();
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          新增部門
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增部門</DialogTitle>
          <DialogDescription>
            新增新的部門或門市到系統中
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              部門名稱
            </Label>
            <Input
              id="name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
              className="col-span-3"
              placeholder="請輸入部門名稱"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              類型
            </Label>
            <Select 
              value={newDepartment.type} 
              onValueChange={(value: 'headquarters' | 'branch' | 'store') => 
                setNewDepartment({...newDepartment, type: value})
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarters">總公司</SelectItem>
                <SelectItem value="branch">分公司</SelectItem>
                <SelectItem value="store">門市</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              地點
            </Label>
            <Input
              id="location"
              value={newDepartment.location || ''}
              onChange={(e) => setNewDepartment({...newDepartment, location: e.target.value})}
              className="col-span-3"
              placeholder="請輸入地點"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              主管姓名
            </Label>
            <Input
              id="manager"
              value={newDepartment.manager_name || ''}
              onChange={(e) => setNewDepartment({...newDepartment, manager_name: e.target.value})}
              className="col-span-3"
              placeholder="請輸入主管姓名"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              聯絡方式
            </Label>
            <Input
              id="contact"
              value={newDepartment.manager_contact || ''}
              onChange={(e) => setNewDepartment({...newDepartment, manager_contact: e.target.value})}
              className="col-span-3"
              placeholder="請輸入聯絡方式"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            新增部門
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
