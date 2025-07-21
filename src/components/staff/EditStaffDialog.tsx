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
import { loadRoles } from '@/hooks/useRole';
import { updateStaff } from '@/hooks/useStaff';
import { useRoleStore } from '@/stores/roleStore';
import { useEffect, useState } from 'react';
import { EditStaffFormContent } from './forms/EditStaffFormContent';
import { useSupervisorFilter } from './hooks/useSupervisorFilter';
import { Staff } from './types';

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSuccess: () => void;
}

const EditStaffDialog = ({ open, onOpenChange, staff, onSuccess }: EditStaffDialogProps) => {
  const { toast } = useToast();
  const { roles } = useRoleStore();
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  // 使用 hook 來篩選可選的主管
  const potentialSupervisors = useSupervisorFilter(currentStaff);

  // 載入職位
  useEffect(() => {
    loadRoles();
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
      if (!currentStaff) return;
      const success = await updateStaff(currentStaff);
      if (success) {
        onSuccess();
        onOpenChange(false);
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
