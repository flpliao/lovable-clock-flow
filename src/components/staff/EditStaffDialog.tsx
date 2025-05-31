
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
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { EditStaffFormContent } from './forms/EditStaffFormContent';

const EditStaffDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentStaff, 
    setCurrentStaff, 
    handleEditStaff,
    staffList,
    roles
  } = useStaffManagementContext();

  if (!currentStaff) return null;

  // Filter out the current staff from potential supervisors to prevent self-supervision
  const potentialSupervisors = staffList.filter(staff => 
    staff.id !== currentStaff.id && 
    (currentStaff.branch_id ? staff.branch_id === currentStaff.branch_id || staff.branch_id === '1' : true)
  );

  const handleSaveClick = async () => {
    const success = await handleEditStaff();
    // Dialog will be closed automatically if successful
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯人員資料</DialogTitle>
          <DialogDescription>
            更新員工資料，完成後請點擊儲存
          </DialogDescription>
        </DialogHeader>
        
        <EditStaffFormContent 
          currentStaff={currentStaff}
          setCurrentStaff={setCurrentStaff}
          potentialSupervisors={potentialSupervisors}
          roles={roles}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveClick}>儲存變更</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
