import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import { useStaffStore } from '@/stores/staffStore';
import { useEffect, useState } from 'react';
import { EditStaffFormContent } from './forms/EditStaffFormContent';
import { useSupervisorFilter } from './hooks/useSupervisorFilter';
import { Staff, StaffRole } from './types';

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: () => void;
}

const EditStaffDialog = ({ open, onOpenChange, staff, onSuccess }: EditStaffDialogProps) => {
  const { toast } = useToast();
  const { currentStaff, setCurrentStaff, updateStaff } = useStaffStore();
  const [roles, setRoles] = useState<StaffRole[]>([]);

  // 使用 hook 來篩選可選的主管
  const potentialSupervisors = useSupervisorFilter(currentStaff);

  // 載入職位
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.loadRoles();
        setRoles(data);
      } catch (error) {
        console.error('載入職位失敗:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (staff) {
      setCurrentStaff(staff);
    }
  }, [staff, setCurrentStaff]);

  if (!currentStaff) {
    return null;
  }

  const handleEditStaff = async () => {
    try {
      const success = await updateStaff(currentStaff);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('編輯員工失敗:', error);
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '無法更新員工資料',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">編輯人員</DialogTitle>
          <DialogDescription className="text-xs">編輯員工資料</DialogDescription>
        </DialogHeader>

        <EditStaffFormContent
          currentStaff={currentStaff}
          setCurrentStaff={setCurrentStaff}
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
