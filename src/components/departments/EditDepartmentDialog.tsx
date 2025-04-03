
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
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
import { useDepartmentManagementContext } from './DepartmentManagementContext';

const EditDepartmentDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentDepartment, 
    setCurrentDepartment, 
    handleEditDepartment 
  } = useDepartmentManagementContext();

  if (!currentDepartment) return null;

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯部門/門市</DialogTitle>
          <DialogDescription>
            編輯部門或門市的資料，帶 * 的欄位為必填。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              名稱 *
            </Label>
            <Input
              id="edit-name"
              value={currentDepartment.name}
              onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-type" className="text-right">
              類型 *
            </Label>
            <Select 
              onValueChange={(value) => setCurrentDepartment({...currentDepartment, type: value as 'department' | 'store'})}
              value={currentDepartment.type}
            >
              <SelectTrigger className="col-span-3" id="edit-type">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">部門</SelectItem>
                <SelectItem value="store">門市</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-location" className="text-right">
              地點
            </Label>
            <Input
              id="edit-location"
              value={currentDepartment.location || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, location: e.target.value})}
              className="col-span-3"
              placeholder="例：台北市信義區"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-managerName" className="text-right">
              負責人
            </Label>
            <Input
              id="edit-managerName"
              value={currentDepartment.managerName || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, managerName: e.target.value})}
              className="col-span-3"
              placeholder="例：王經理"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-managerContact" className="text-right">
              聯絡方式
            </Label>
            <Input
              id="edit-managerContact"
              value={currentDepartment.managerContact || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, managerContact: e.target.value})}
              className="col-span-3"
              placeholder="例：0912-345-678"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-staffCount" className="text-right">
              人數
            </Label>
            <Input
              id="edit-staffCount"
              value={currentDepartment.staffCount.toString()}
              onChange={(e) => setCurrentDepartment({...currentDepartment, staffCount: parseInt(e.target.value) || 0})}
              className="col-span-3"
              type="number"
              min="0"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditDepartment}>更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
