import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { CreateLeaveTypeDialog } from '@/components/leave/CreateLeaveTypeDialog';
import { EditLeaveTypeDialog } from '@/components/leave/EditLeaveTypeDialog';
import { LeaveTypeStatsCards } from '@/components/leave/LeaveTypeStatsCards';
import { LeaveTypeTable } from '@/components/leave/LeaveTypeTable';
import { Button } from '@/components/ui/button';
import { LeaveTypeCode, PaidType } from '@/constants/leave';
import { useLeaveType } from '@/hooks/useLeaveType';
import { LeaveType } from '@/types/leaveType';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';

// 適配器類型，用於處理表單數據和 API 數據之間的轉換
type LeaveTypeFormData = {
  code: LeaveTypeCode;
  name: string;
  paid_type: PaidType;
  annual_reset: boolean;
  max_per_year?: number | null;
  required_attachment: boolean;
  is_active: boolean;
  description?: string;
};

export default function LeaveTypeManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [deleteLeaveType, setDeleteLeaveType] = useState<LeaveType | null>(null);
  const { leaveTypes, handleCreateLeaveType, handleUpdateLeaveType, handleDelete } = useLeaveType();

  // 統計數據
  const stats = {
    total: leaveTypes.length,
    active: leaveTypes.filter(type => type.is_active).length,
    paid: leaveTypes.filter(type => type.paid_type === 'paid' && type.is_active).length,
  };

  const handleAdd = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (leaveType: LeaveType) => {
    setDeleteLeaveType(leaveType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteLeaveType) return;
    const success = await handleDelete(deleteLeaveType);
    if (success) {
      setDeleteDialogOpen(false);
      setDeleteLeaveType(null);
    }
  };

  // 新增假別處理函數
  const onCreateSave = async (formData: LeaveTypeFormData): Promise<boolean> => {
    const apiData: Partial<LeaveType> = {
      code: formData.code,
      name: formData.name,
      paid_type: formData.paid_type,
      annual_reset: formData.annual_reset,
      max_per_year: formData.max_per_year || undefined,
      required_attachment: formData.required_attachment,
      is_active: formData.is_active,
      description: formData.description,
    };

    return await handleCreateLeaveType(apiData);
  };

  // 編輯假別處理函數
  const onEditSave = async (slug: string, formData: LeaveTypeFormData): Promise<boolean> => {
    const apiData: Partial<LeaveType> = {
      code: formData.code,
      name: formData.name,
      paid_type: formData.paid_type,
      annual_reset: formData.annual_reset,
      max_per_year: formData.max_per_year || undefined,
      required_attachment: formData.required_attachment,
      is_active: formData.is_active,
      description: formData.description,
    };

    return await handleUpdateLeaveType(slug, apiData);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          icon={Calendar}
          title="請假假別管理"
          description="管理系統中的請假類型設定"
          iconBgColor="bg-green-500"
        />

        <LeaveTypeStatsCards stats={stats} />

        {/* 操作按鈕區域 */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增假別
          </Button>
        </div>

        <LeaveTypeTable leaveTypes={leaveTypes} onEdit={handleEdit} onDelete={handleDeleteClick} />

        {/* 對話框 */}
        <CreateLeaveTypeDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={onCreateSave}
        />

        <EditLeaveTypeDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          leaveType={selectedLeaveType}
          onSave={onEditSave}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="確認刪除假別"
          description={`確定要刪除「${deleteLeaveType?.name}」嗎？此操作無法復原。`}
        />
      </div>
    </PageLayout>
  );
}
