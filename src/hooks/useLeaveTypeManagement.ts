import { useToast } from '@/hooks/useToast';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { useCallback, useEffect, useState } from 'react';

interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  annual_reset: boolean;
  max_days_per_year?: number;
  requires_attachment: boolean;
  is_system_default: boolean;
  is_active: boolean;
  sort_order: number;
  description?: string;
}

export function useLeaveTypeManagement() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const { toast } = useToast();

  const loadLeaveTypes = useCallback(async () => {
    try {
      const data = await LeaveTypeService.getLeaveTypes();
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('載入假別失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入假别資料',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleSave = async (data: Partial<LeaveType>, selectedLeaveType: LeaveType | null) => {
    try {
      if (selectedLeaveType) {
        await LeaveTypeService.updateLeaveType(selectedLeaveType.id, data);
        toast({
          title: '更新成功',
          description: '假別已更新',
        });
      } else {
        await LeaveTypeService.createLeaveType(data);
        toast({
          title: '新增成功',
          description: '假別已新增',
        });
      }
      loadLeaveTypes();
      return true;
    } catch (error) {
      console.error('儲存假別失敗:', error);
      toast({
        title: '儲存失敗',
        description: '無法儲存假別資料',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDelete = async (leaveType: LeaveType) => {
    if (leaveType.is_system_default) {
      toast({
        title: '無法刪除',
        description: '系統預設假別無法刪除，但可以停用',
        variant: 'destructive',
      });
      return false;
    }

    try {
      if (await LeaveTypeService.deleteLeaveType(leaveType.id)) {
        toast({
          title: '刪除成功',
          description: '假別已刪除',
        });
        loadLeaveTypes();
        return true;
      } else {
        toast({
          title: '刪除失敗',
          description: '無法刪除假別',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('刪除假別失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除假別',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    loadLeaveTypes();
  }, [loadLeaveTypes]);

  const handleSyncDefaults = async () => {
    try {
      const ok = await LeaveTypeService.syncFromDefaults();
      if (ok) {
        toast({ title: '同步成功', description: '已同步系統預設假別' });
        await loadLeaveTypes();
      } else {
        toast({ title: '同步失敗', description: '無法同步預設假別', variant: 'destructive' });
      }
    } catch (error) {
      console.error('同步預設假別失敗:', error);
      toast({ title: '同步失敗', description: '無法同步預設假別', variant: 'destructive' });
    }
  };

  return {
    leaveTypes,
    loadLeaveTypes,
    handleSave,
    handleDelete,
    handleSyncDefaults,
  };
}
