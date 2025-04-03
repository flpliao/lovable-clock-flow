
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { useUser } from '@/contexts/UserContext';

const AddDepartmentDialog = () => {
  const { isAdmin } = useUser();
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newDepartment, 
    setNewDepartment, 
    handleAddDepartment 
  } = useDepartmentManagementContext();

  if (!isAdmin()) return null;

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增部門/門市
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增部門/門市</DialogTitle>
          <DialogDescription>
            請填寫新部門或門市的資料，帶 * 的欄位為必填。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              名稱 *
            </Label>
            <Input
              id="name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              類型 *
            </Label>
            <Select 
              onValueChange={(value) => setNewDepartment({...newDepartment, type: value as 'department' | 'store'})}
              value={newDepartment.type}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">部門</SelectItem>
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
              placeholder="例：台北市信義區"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="managerName" className="text-right">
              負責人
            </Label>
            <Input
              id="managerName"
              value={newDepartment.managerName || ''}
              onChange={(e) => setNewDepartment({...newDepartment, managerName: e.target.value})}
              className="col-span-3"
              placeholder="例：王經理"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="managerContact" className="text-right">
              聯絡方式
            </Label>
            <Input
              id="managerContact"
              value={newDepartment.managerContact || ''}
              onChange={(e) => setNewDepartment({...newDepartment, managerContact: e.target.value})}
              className="col-span-3"
              placeholder="例：0912-345-678"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddDepartment}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
