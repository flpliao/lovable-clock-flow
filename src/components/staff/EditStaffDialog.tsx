
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffManagementContext } from './StaffManagementContext';
import { departments, positions, roles } from './StaffConstants';

const EditStaffDialog = () => {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentStaff, 
    setCurrentStaff, 
    handleEditStaff,
    staffList
  } = useStaffManagementContext();

  if (!currentStaff) return null;

  // Filter out the current staff from potential supervisors to prevent self-supervision
  const potentialSupervisors = staffList.filter(staff => staff.id !== currentStaff.id);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯人員資料</DialogTitle>
          <DialogDescription>
            更新員工資料，完成後請點擊儲存
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input
              id="name"
              value={currentStaff.name}
              onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              職位
            </Label>
            <Select 
              value={currentStaff.position} 
              onValueChange={(value) => setCurrentStaff({...currentStaff, position: value})}
            >
              <SelectTrigger className="col-span-3" id="position">
                <SelectValue placeholder="選擇職位" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              部門
            </Label>
            <Select 
              value={currentStaff.department} 
              onValueChange={(value) => setCurrentStaff({...currentStaff, department: value})}
            >
              <SelectTrigger className="col-span-3" id="department">
                <SelectValue placeholder="選擇部門" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supervisor" className="text-right">
              上級主管
            </Label>
            <Select 
              value={currentStaff.supervisor_id || ''} 
              onValueChange={(value) => setCurrentStaff({...currentStaff, supervisor_id: value || undefined})}
            >
              <SelectTrigger className="col-span-3" id="supervisor">
                <SelectValue placeholder="選擇上級主管" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">無上級主管</SelectItem>
                {potentialSupervisors.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              聯絡電話
            </Label>
            <Input
              id="contact"
              value={currentStaff.contact}
              onChange={(e) => setCurrentStaff({...currentStaff, contact: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              角色
            </Label>
            <Select 
              value={currentStaff.role} 
              onValueChange={(value: 'user' | 'admin') => setCurrentStaff({...currentStaff, role: value})}
            >
              <SelectTrigger className="col-span-3" id="role">
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditStaff}>儲存變更</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
