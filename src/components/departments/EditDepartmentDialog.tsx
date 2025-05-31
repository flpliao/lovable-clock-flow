
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentManagement } from './useDepartmentManagement';

const EditDepartmentDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentDepartment, 
    setCurrentDepartment, 
    handleEditDepartment
  } = useDepartmentManagement();
  
  if (!currentDepartment) return null;
  
  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-sm">編輯部門</DialogTitle>
          <DialogDescription className="text-xs">
            修改部門資訊
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-name" className="text-right text-xs">
              名稱
            </Label>
            <Input
              id="edit-name"
              value={currentDepartment.name}
              onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
              className="col-span-3 h-6 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-type" className="text-right text-xs">
              類型
            </Label>
            <Select 
              value={currentDepartment.type} 
              onValueChange={(value: 'headquarters' | 'branch' | 'store') => setCurrentDepartment({...currentDepartment, type: value})}
            >
              <SelectTrigger className="col-span-3 h-6 text-xs" id="edit-type">
                <SelectValue placeholder="選擇類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarters" className="text-xs">總部</SelectItem>
                <SelectItem value="branch" className="text-xs">分部</SelectItem>
                <SelectItem value="store" className="text-xs">門市</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-location" className="text-right text-xs">
              地點
            </Label>
            <Input
              id="edit-location"
              value={currentDepartment.location || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, location: e.target.value})}
              className="col-span-3 h-6 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-manager_name" className="text-right text-xs">
              負責人
            </Label>
            <Input
              id="edit-manager_name"
              value={currentDepartment.manager_name || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, manager_name: e.target.value})}
              className="col-span-3 h-6 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="edit-manager_contact" className="text-right text-xs">
              聯絡方式
            </Label>
            <Input
              id="edit-manager_contact"
              value={currentDepartment.manager_contact || ''}
              onChange={(e) => setCurrentDepartment({...currentDepartment, manager_contact: e.target.value})}
              className="col-span-3 h-6 text-xs"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="h-6 text-xs">取消</Button>
          <Button onClick={handleEditDepartment} className="h-6 text-xs">儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
