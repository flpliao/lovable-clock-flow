import { AddButton } from '@/components/common/buttons';
import DeleteConfirmDialog from '@/components/common/dialogs/DeleteConfirmDialog';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { CreateLeaveTypeDialog } from '@/components/leave/CreateLeaveTypeDialog';
import { EditLeaveTypeDialog } from '@/components/leave/EditLeaveTypeDialog';
import { LeaveTypeStatsCards } from '@/components/leave/LeaveTypeStatsCards';
import { LeaveTypeTable } from '@/components/leave/LeaveTypeTable';
import { useLeaveType } from '@/hooks/useLeaveType';
import { LeaveType } from '@/types/leaveType';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <PageLayout>
      <PageHeader
        icon={Calendar}
        title="請假假別管理"
        description="管理系統中的請假類型設定"
        iconBgColor="bg-green-500"
      />

      <LeaveTypeStatsCards stats={stats} />

      {/* 操作按鈕區域 */}
      <div className="flex justify-end gap-3">
        <AddButton
          onClick={handleAdd}
          buttonText="新增假別"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5 font-semibold"
        />
      </div>

      <LeaveTypeTable leaveTypes={leaveTypes} onEdit={handleEdit} onDelete={handleDeleteClick} />

      {/* 對話框 */}
      <CreateLeaveTypeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSave={handleCreateLeaveType}
      />

      <EditLeaveTypeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        leaveType={selectedLeaveType}
        onSave={handleUpdateLeaveType}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDelete(deleteLeaveType)}
        onSuccess={() => {
          setDeleteLeaveType(null);
        }}
        title="確認刪除假別"
        description={`確定要刪除「${deleteLeaveType?.name}」嗎？此操作無法復原。`}
      />
    </PageLayout>
  );
}
