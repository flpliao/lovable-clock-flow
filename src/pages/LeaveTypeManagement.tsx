import { AddButton } from '@/components/common/buttons';
import DeleteConfirmDialog from '@/components/common/dialogs/DeleteConfirmDialog';
import PageHeader from '@/components/layouts/PageHeader';
import PageLayout from '@/components/layouts/PageLayout';
import { CreateLeaveTypeDialog } from '@/components/leave/CreateLeaveTypeDialog';
import { EditLeaveTypeDialog } from '@/components/leave/EditLeaveTypeDialog';
import { LeaveTypeTable } from '@/components/leave/LeaveTypeTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

      {/* 假別列表 */}
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-white/60 border-b border-white/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800 text-xl font-bold">假別列表</CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                管理系統中的所有請假類型
              </CardDescription>
            </div>
            <AddButton onClick={handleAdd} buttonText="新增假別" className="" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <LeaveTypeTable
            leaveTypes={leaveTypes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

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
