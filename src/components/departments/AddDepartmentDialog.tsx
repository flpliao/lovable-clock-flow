
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
import { useDepartmentManagement } from './useDepartmentManagement';
import { useUser } from '@/contexts/UserContext';

const AddDepartmentDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newDepartment, 
    setNewDepartment, 
    handleAddDepartment
  } = useDepartmentManagement();
  
  const { isAdmin } = useUser();
  
  if (!isAdmin()) return null;
  
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-6 px-2 text-xs">
          <Plus className="h-3 w-3 mr-1" /> 新增
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-sm">新增部門</DialogTitle>
          <DialogDescription className="text-xs">
            新增部門至系統
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="name" className="text-right text-xs">
              名稱
            </Label>
            <Input
              id="name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
              className="col-span-3 h-7 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="type" className="text-right text-xs">
              類型
            </Label>
            <Select 
              value={newDepartment.type} 
              onValueChange={(value) => setNewDepartment({...newDepartment, type: value})}
            >
              <SelectTrigger className="col-span-3 h-7 text-xs" id="type">
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
            <Label htmlFor="location" className="text-right text-xs">
              地點
            </Label>
            <Input
              id="location"
              value={newDepartment.location}
              onChange={(e) => setNewDepartment({...newDepartment, location: e.target.value})}
              className="col-span-3 h-7 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="manager_name" className="text-right text-xs">
              負責人
            </Label>
            <Input
              id="manager_name"
              value={newDepartment.manager_name}
              onChange={(e) => setNewDepartment({...newDepartment, manager_name: e.target.value})}
              className="col-span-3 h-7 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="manager_contact" className="text-right text-xs">
              聯絡方式
            </Label>
            <Input
              id="manager_contact"
              value={newDepartment.manager_contact}
              onChange={(e) => setNewDepartment({...newDepartment, manager_contact: e.target.value})}
              className="col-span-3 h-7 text-xs"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-7 text-xs">取消</Button>
          <Button onClick={handleAddDepartment} className="h-7 text-xs">新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
