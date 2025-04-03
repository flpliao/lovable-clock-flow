
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
import { useStaffManagementContext } from './StaffManagementContext';
import { departments, positions, roles } from './StaffConstants';
import { useUser } from '@/contexts/UserContext';

const AddStaffDialog = () => {
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newStaff, 
    setNewStaff, 
    handleAddStaff,
    staffList
  } = useStaffManagementContext();
  
  const { isAdmin } = useUser();
  
  if (!isAdmin()) return null;
  
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> 新增人員
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增人員</DialogTitle>
          <DialogDescription>
            新增員工至排班系統，完成後請點擊新增
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名
            </Label>
            <Input
              id="name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              職位
            </Label>
            <Select 
              value={newStaff.position} 
              onValueChange={(value) => setNewStaff({...newStaff, position: value})}
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
              value={newStaff.department} 
              onValueChange={(value) => setNewStaff({...newStaff, department: value})}
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
              value={newStaff.supervisor_id || ''} 
              onValueChange={(value) => setNewStaff({...newStaff, supervisor_id: value || undefined})}
            >
              <SelectTrigger className="col-span-3" id="supervisor">
                <SelectValue placeholder="選擇上級主管" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">無上級主管</SelectItem>
                {staffList.map((staff) => (
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
              value={newStaff.contact}
              onChange={(e) => setNewStaff({...newStaff, contact: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              角色
            </Label>
            <Select 
              value={newStaff.role} 
              onValueChange={(value: 'user' | 'admin') => setNewStaff({...newStaff, role: value})}
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
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddStaff}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
