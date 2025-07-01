import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LeaveTypeDialog } from '@/components/leave/LeaveTypeDialog';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { LeaveTypeStatsCards } from '@/components/leave/LeaveTypeStatsCards';
import { LeaveTypeTable } from '@/components/leave/LeaveTypeTable';
import { LeaveTypePageHeader } from '@/components/leave/LeaveTypePageHeader';
import { LeaveTypeBackground } from '@/components/leave/LeaveTypeBackground';
import { useLeaveTypeManagement } from '@/hooks/useLeaveTypeManagement';
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
export default function LeaveTypeManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [deleteLeaveType, setDeleteLeaveType] = useState<LeaveType | null>(null);
  const {
    leaveTypes,
    loading,
    handleSave,
    handleDelete
  } = useLeaveTypeManagement();

  // 統計數據
  const stats = {
    total: leaveTypes.length,
    active: leaveTypes.filter(type => type.is_active).length,
    paid: leaveTypes.filter(type => type.is_paid && type.is_active).length,
    systemDefault: leaveTypes.filter(type => type.is_system_default).length
  };
  const handleAdd = () => {
    setSelectedLeaveType(null);
    setDialogOpen(true);
  };
  const handleEdit = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setDialogOpen(true);
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
  const onSave = async (data: Partial<LeaveType>) => {
    const success = await handleSave(data, selectedLeaveType);
    if (success) {
      setDialogOpen(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-slate-700 text-lg font-medium">載入中...</div>
        </div>
      </div>;
  }
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{animationDelay: '6s'}}></div>

      <div className="relative z-10 w-full px-4 lg:px-8 pt-24 md:pt-28 pb-8">
        <div className="space-y-6">
          <LeaveTypePageHeader />

          <LeaveTypeStatsCards stats={stats} />

          {/* 操作按鈕區域 */}
          <div className="flex justify-end">
            <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5 font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              新增假別
            </Button>
          </div>

          <LeaveTypeTable leaveTypes={leaveTypes} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </div>

        {/* 對話框 */}
        <LeaveTypeDialog open={dialogOpen} onOpenChange={setDialogOpen} leaveType={selectedLeaveType} onSave={onSave} />

        <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} title="確認刪除假別" description={`確定要刪除「${deleteLeaveType?.name_zh}」嗎？此操作無法復原。`} />
      </div>
    </div>;
}