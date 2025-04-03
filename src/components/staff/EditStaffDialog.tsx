
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
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
import { useStaffManagement } from './StaffManagementContext';
import { departments, positions, roles } from './StaffConstants';
import { useUser } from '@/contexts/UserContext';

const EditStaffDialog = () => {
  const { isAdmin } = useUser();
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    currentStaff, 
    setCurrentStaff, 
    handleEditStaff 
  } = useStaffManagement();

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯人員資料</DialogTitle>
          <DialogDescription>
            修改員工的資料，帶 * 的欄位為必填。
          </DialogDescription>
        </DialogHeader>
        {currentStaff && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                姓名 *
              </Label>
              <Input
                id="edit-name"
                value={currentStaff.name}
                onChange={(e) => setCurrentStaff({...currentStaff, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-position" className="text-right">
                職位 *
              </Label>
              <Select 
                onValueChange={(value) => setCurrentStaff({...currentStaff, position: value})}
                value={currentStaff.position}
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
              <Label htmlFor="edit-department" className="text-right">
                部門 *
              </Label>
              <Select 
                onValueChange={(value) => setCurrentStaff({...currentStaff, department: value})}
                value={currentStaff.department}
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
            {isAdmin() && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  角色 *
                </Label>
                <Select 
                  onValueChange={(value) => setCurrentStaff({...currentStaff, role: value as 'user' | 'admin'})}
                  value={currentStaff.role}
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
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contact" className="text-right">
                聯絡電話
              </Label>
              <Input
                id="edit-contact"
                value={currentStaff.contact}
                onChange={(e) => setCurrentStaff({...currentStaff, contact: e.target.value})}
                className="col-span-3"
                placeholder="例：0912-345-678"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditStaff}>儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
