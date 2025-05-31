
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
import { Plus } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import AddStaffForm from './forms/AddStaffForm';

const AddStaffDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newStaff, 
    setNewStaff, 
    handleAddStaff
  } = useStaffManagementContext();
  
  const { isAdmin } = useUser();
  
  if (!isAdmin()) return null;
  
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 px-2 text-xs">
          <Plus className="h-3 w-3 mr-1" /> 新增
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-base">新增人員</DialogTitle>
          <DialogDescription className="text-xs">
            新增員工至系統
          </DialogDescription>
        </DialogHeader>
        
        <AddStaffForm newStaff={newStaff} setNewStaff={setNewStaff} />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-8 text-xs">取消</Button>
          <Button onClick={handleAddStaff} className="h-8 text-xs">新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
