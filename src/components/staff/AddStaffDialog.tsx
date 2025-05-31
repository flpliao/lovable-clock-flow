
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCompanyManagementContext } from '@/components/company/CompanyManagementContext';
import { departments, positions } from './StaffConstants';
import { useUser } from '@/contexts/UserContext';

const AddStaffDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newStaff, 
    setNewStaff, 
    handleAddStaff,
    staffList,
    roles
  } = useStaffManagementContext();
  
  const { branches } = useCompanyManagementContext();
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
        
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="name" className="text-right text-xs">
              姓名
            </Label>
            <Input
              id="name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
              className="col-span-3 h-8 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="branch" className="text-right text-xs">
              營業處
            </Label>
            <Select 
              value={newStaff.branch_id || ''} 
              onValueChange={(value) => {
                const selectedBranch = branches.find(b => b.id === value);
                setNewStaff({
                  ...newStaff, 
                  branch_id: value,
                  branch_name: selectedBranch?.name
                });
              }}
            >
              <SelectTrigger className="col-span-3 h-8 text-xs" id="branch">
                <SelectValue placeholder="選擇營業處" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id} className="text-xs">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="position" className="text-right text-xs">
              職位
            </Label>
            <Select 
              value={newStaff.position} 
              onValueChange={(value) => setNewStaff({...newStaff, position: value})}
            >
              <SelectTrigger className="col-span-3 h-8 text-xs" id="position">
                <SelectValue placeholder="選擇職位" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position} className="text-xs">
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="department" className="text-right text-xs">
              部門
            </Label>
            <Select 
              value={newStaff.department} 
              onValueChange={(value) => setNewStaff({...newStaff, department: value})}
            >
              <SelectTrigger className="col-span-3 h-8 text-xs" id="department">
                <SelectValue placeholder="選擇部門" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department} className="text-xs">
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="supervisor" className="text-right text-xs">
              主管
            </Label>
            <Select 
              value={newStaff.supervisor_id || ''} 
              onValueChange={(value) => setNewStaff({...newStaff, supervisor_id: value || undefined})}
            >
              <SelectTrigger className="col-span-3 h-8 text-xs" id="supervisor">
                <SelectValue placeholder="選擇主管" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="text-xs">無主管</SelectItem>
                {staffList
                  .filter(staff => newStaff.branch_id ? staff.branch_id === newStaff.branch_id || staff.branch_id === '1' : true)
                  .map((staff) => (
                  <SelectItem key={staff.id} value={staff.id} className="text-xs">
                    {staff.name} ({staff.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="contact" className="text-right text-xs">
              電話
            </Label>
            <Input
              id="contact"
              value={newStaff.contact}
              onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
              className="col-span-3 h-8 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-3">
            <Label htmlFor="role" className="text-right text-xs">
              角色
            </Label>
            <Select 
              value={newStaff.role_id || newStaff.role} 
              onValueChange={(value) => {
                if (value === 'admin' || value === 'user') {
                  setNewStaff({...newStaff, role: value, role_id: value});
                } else {
                  const selectedRole = roles.find(r => r.id === value);
                  setNewStaff({
                    ...newStaff, 
                    role_id: value,
                    role: selectedRole ? selectedRole.name : 'custom'
                  });
                }
              }}
            >
              <SelectTrigger className="col-span-3 h-8 text-xs" id="role">
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id} className="text-xs">
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="h-8 text-xs">取消</Button>
          <Button onClick={handleAddStaff} className="h-8 text-xs">新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
