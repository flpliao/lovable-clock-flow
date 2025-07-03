import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useIsAdmin } from '@/hooks/useStores';
import { Plus } from 'lucide-react';
import AddStaffForm from './forms/AddStaffForm';

const AddStaffDialog = () => {
  console.log('🎯 AddStaffDialog rendering');
  
  const isAdmin = useIsAdmin();
  
  // Add error boundary for context usage
  const staffManagementContext = useStaffManagementContext();
  
  if (!staffManagementContext) {
    console.error('❌ Failed to get staff management context');
    return null; // Return null if context is not available
  }
  
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newStaff, 
    setNewStaff, 
    handleAddStaff
  } = staffManagementContext;
  
  if (!isAdmin) {
    console.log('🚫 User is not admin, hiding AddStaffDialog');
    return null;
  }
  
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
