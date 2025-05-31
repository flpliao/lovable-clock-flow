
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
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCompanyManagementContext } from '@/components/company/CompanyManagementContext';
import { usePositions } from './hooks/usePositions';
import { departments } from './StaffConstants';

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

  const { branches } = useCompanyManagementContext();
  const { getPositionNames } = usePositions();
  const positions = getPositionNames();

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
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={currentStaff.name || ''}
              onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
              className="col-span-3"
              placeholder="請輸入姓名"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="branch" className="text-right">
              所屬營業處 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={currentStaff.branch_id || ''} 
              onValueChange={(value) => {
                const selectedBranch = branches.find(b => b.id === value);
                setCurrentStaff({
                  ...currentStaff, 
                  branch_id: value,
                  branch_name: selectedBranch?.name || '',
                  supervisor_id: undefined // 清除主管設定，因為可能跨營業處
                });
              }}
            >
              <SelectTrigger className="col-span-3" id="branch">
                <SelectValue placeholder="選擇營業處" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.type === 'headquarters' ? '總公司' : branch.type === 'branch' ? '分公司' : '門市'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              職位 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={currentStaff.position || ''} 
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
              部門 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={currentStaff.department || ''} 
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
                    {staff.name} ({staff.position}) - {staff.branch_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              聯絡電話 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact"
              value={currentStaff.contact || ''}
              onChange={(e) => setCurrentStaff({...currentStaff, contact: e.target.value})}
              className="col-span-3"
              placeholder="請輸入聯絡電話"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              角色
            </Label>
            <Select 
              value={currentStaff.role_id || currentStaff.role || ''} 
              onValueChange={(value) => {
                // If it's a system role ID, set both role and role_id
                if (value === 'admin' || value === 'user') {
                  setCurrentStaff({...currentStaff, role: value, role_id: value});
                } else {
                  // Otherwise it's a custom role, set role_id and role name for display
                  const selectedRole = roles.find(r => r.id === value);
                  setCurrentStaff({
                    ...currentStaff, 
                    role_id: value,
                    role: selectedRole ? selectedRole.name : 'custom'
                  });
                }
              }}
            >
              <SelectTrigger className="col-span-3" id="role">
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleSaveClick}>儲存變更</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
