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
import { useEffect, useState } from 'react';
import { SYSTEM_ROLES } from './constants/systemRoles';
import { EditStaffFormContent } from './forms/EditStaffFormContent';
import { Staff, StaffRole } from './types';
import { useSupervisorFilter } from './hooks/useSupervisorFilter';

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: (staff: Staff) => void;
}

const EditStaffDialog = ({ open, onOpenChange, staff, onSuccess }: EditStaffDialogProps) => {
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [roles, setRoles] = useState<StaffRole[]>([]);

  // 使用 hook 來篩選可選的主管
  const potentialSupervisors = useSupervisorFilter(editingStaff);

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

  useEffect(() => {
    if (staff) {
      setEditingStaff(staff);
    }
  }, [staff]);

  if (!editingStaff) {
    return null;
  }

  const handleEditStaff = async () => {
    try {
      // TODO: 實作編輯員工的 API 呼叫
      onSuccess(editingStaff);
    } catch (error) {
      console.error('編輯員工失敗:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-base">編輯人員</DialogTitle>
          <DialogDescription className="text-xs">編輯員工資料</DialogDescription>
        </DialogHeader>

        <EditStaffFormContent
          currentStaff={editingStaff}
          setCurrentStaff={setEditingStaff}
          potentialSupervisors={potentialSupervisors}
          roles={roles}
          onHireDateChange={() => {}}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-xs">
            取消
          </Button>
          <Button onClick={handleEditStaff} className="h-8 text-xs">
            儲存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
