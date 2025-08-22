import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { LeaveTypeDialog } from '@/components/leave/LeaveTypeDialog';
import { LeaveTypeStatsCards } from '@/components/leave/LeaveTypeStatsCards';
import { LeaveTypeTable } from '@/components/leave/LeaveTypeTable';
import { Button } from '@/components/ui/button';
import { useLeaveTypeManagement } from '@/hooks/useLeaveTypeManagement';
import { Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { LeaveType } from '@/types/leaveType';
import { LeaveTypeCode, PaidType } from '@/constants/leave';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [deleteLeaveType, setDeleteLeaveType] = useState<LeaveType | null>(null);
  const { leaveTypes, handleSave, handleDelete, handleSyncDefaults } = useLeaveTypeManagement();

  // 系統預設假別代碼
  const defaultLeaveTypeCodes = new Set([
    LeaveTypeCode.ANNUAL,
    LeaveTypeCode.SICK,
    LeaveTypeCode.PERSONAL,
    LeaveTypeCode.MARRIAGE,
    LeaveTypeCode.BEREAVEMENT_L1,
    LeaveTypeCode.BEREAVEMENT_L2,
    LeaveTypeCode.BEREAVEMENT_L3,
    LeaveTypeCode.MATERNITY,
    LeaveTypeCode.PATERNITY,
  ]);

  // 將符合預設清單的假別標記為系統預設
  const enhancedLeaveTypes = leaveTypes.map(type => ({
    ...type,
    is_system_default: defaultLeaveTypeCodes.has(type.code),
  }));

  // 統計數據
  const stats = {
    total: enhancedLeaveTypes.length,
    active: enhancedLeaveTypes.filter(type => type.is_active).length,
    paid: enhancedLeaveTypes.filter(type => type.paid_type === 'paid' && type.is_active).length,
    systemDefault: enhancedLeaveTypes.filter(type => type.is_system_default).length,
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

  // 適配器函數：將表單數據轉換為 API 期望的格式
  const onSave = async (formData: LeaveTypeFormData) => {
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

    const success = await handleSave(apiData, selectedLeaveType);
    if (success) {
      setDialogOpen(false);
    }
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
            onClick={async () => {
              await handleSyncDefaults();
            }}
            className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5 font-semibold"
          >
            同步預設假別
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-2.5 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增假別
          </Button>
        </div>

        <LeaveTypeTable
          leaveTypes={enhancedLeaveTypes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* 對話框 */}
        <LeaveTypeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          leaveType={selectedLeaveType}
          onSave={onSave}
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
