
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
import { PlusCircle } from 'lucide-react';
import { useStaffManagementContext } from './StaffManagementContext';
import { departments, positions, roles } from './StaffConstants';
import { useUser } from '@/contexts/UserContext';

const AddStaffDialog = () => {
  const { isAdmin } = useUser();
  const { 
    isAddDialogOpen, 
    setIsAddDialogOpen, 
    newStaff, 
    setNewStaff, 
    handleAddStaff 
  } = useStaffManagementContext();

  if (!isAdmin()) return null;

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增人員
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增人員</DialogTitle>
          <DialogDescription>
            請填寫新員工的資料，帶 * 的欄位為必填。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              姓名 *
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
              職位 *
            </Label>
            <Select 
              onValueChange={(value) => setNewStaff({...newStaff, position: value})}
              value={newStaff.position}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="選擇職位" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              部門 *
            </Label>
            <Select 
              onValueChange={(value) => setNewStaff({...newStaff, department: value})}
              value={newStaff.department}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="選擇部門" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              角色 *
            </Label>
            <Select 
              onValueChange={(value) => setNewStaff({...newStaff, role: value as 'user' | 'admin'})}
              value={newStaff.role}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="選擇角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
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
              placeholder="例：0912-345-678"
            />
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
