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
import { useStaff } from '@/hooks/useStaff';
import { useState } from 'react';
import AddStaffForm from './forms/AddStaffForm';
import { NewStaff } from './types';

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddStaffDialog = ({ open, onOpenChange, onSuccess }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const { addStaff } = useStaff();
  const [newStaff, setNewStaff] = useState<NewStaff>({
    name: '',
    position: '',
    department: '',
    branch_id: '',
    branch_name: '',
    contact: '',
    role_id: 'user',
  });

  const handleAddStaff = async () => {
    try {
      const success = await addStaff(newStaff);
      if (success) {
        onSuccess();
        setNewStaff({
          name: '',
          position: '',
          department: '',
          branch_id: '',
          branch_name: '',
          contact: '',
          role_id: 'user',
        });
        onOpenChange(false); // 新增成功時自動關閉 dialog
      }
    } catch (error) {
      console.error('新增員工失敗:', error);
      toast({
        title: '新增失敗',
        description: error instanceof Error ? error.message : '無法新增員工',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">新增人員</DialogTitle>
          <DialogDescription className="text-xs">新增員工至系統</DialogDescription>
        </DialogHeader>

        <AddStaffForm newStaff={newStaff} setNewStaff={setNewStaff} />

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
