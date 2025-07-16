import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { roleService } from '@/services/roleService';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useEffect, useState } from 'react';
import { SYSTEM_ROLES } from './constants/systemRoles';
import AddStaffForm from './forms/AddStaffForm';
import { NewStaff, StaffRole } from './types';

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (staff: NewStaff) => void;
}

const AddStaffDialog = ({ open, onOpenChange, onSuccess }: AddStaffDialogProps) => {
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: '',
    email: '',
    department: '',
    position: '',
    role_id: '',
    branch_id: '',
    branch_name: '',
    contact: '',
  });

  const isAdmin = permissionService.isAdmin();

  // 角色列表
  const [roles, setRoles] = useState<StaffRole[]>([]);

  // 載入角色
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.loadRoles();
        setRoles(data);
      } catch (error) {
        console.error('載入角色失敗，使用預設系統角色:', error);
        setRoles(SYSTEM_ROLES);
      }
    };
    fetchRoles();
  }, []);

  if (!isAdmin) {
    return null;
  }

  const handleAddStaff = async () => {
    try {
      // 將收集到的表單資料交給父層，由父層負責呼叫 API
      onSuccess(newStaff);
    } catch (error) {
      console.error('新增員工失敗:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">新增人員</DialogTitle>
          <DialogDescription className="text-xs">新增員工至系統</DialogDescription>
        </DialogHeader>

        <AddStaffForm newStaff={newStaff} setNewStaff={setNewStaff} roles={roles} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-xs">
            取消
          </Button>
          <Button onClick={handleAddStaff} className="h-8 text-xs">
            新增
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
