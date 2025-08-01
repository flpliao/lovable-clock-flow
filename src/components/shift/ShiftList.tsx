import CreateShiftForm from '@/components/shift/CreateShiftForm';
import EditShiftForm from '@/components/shift/EditShiftForm';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/ui/DeleteDialog';
import { Input } from '@/components/ui/input';
import { useShift } from '@/hooks/useShift';
import { CreateShiftData, Shift, UpdateShiftData } from '@/types/shift';
import { Clock, Edit, Plus, Search, Settings, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ShiftList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  const { shifts, isLoading, loadAllShifts, createShiftData, updateShiftData, deleteShiftData } =
    useShift();

  useEffect(() => {
    loadAllShifts();
  }, []);

  // 篩選班次
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch =
      shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateShift = async (formData: CreateShiftData) => {
    const result = await createShiftData(formData);
    if (result) {
      setShowCreateForm(false);
    }
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShowEditForm(true);
  };

  const handleUpdateShift = async (slug: string, formData: UpdateShiftData) => {
    const result = await updateShiftData(slug, formData);
    if (result) {
      setShowEditForm(false);
      setSelectedShift(null);
    }
  };

  const handleManageTimeSlots = (shift: Shift) => {
    // TODO: 實作管理時間段的功能
    console.log('管理時間段:', shift);
    // 這裡可以導航到時間段管理頁面或打開時間段管理 dialog
  };

  const handleDeleteShift = (slug: string) => {
    setShiftToDelete(slug);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (shiftToDelete) {
      await deleteShiftData(shiftToDelete);
      setShiftToDelete(null);
    }
  };
  if (isLoading) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 mt-4">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜尋區域 */}
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* 搜尋框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                type="text"
                placeholder="搜尋班次名稱或代碼..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
          </div>

          {/* 新增按鈕 */}
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增班次
          </Button>
        </div>

        {/* 搜尋結果提示 */}
        {searchTerm && (
          <div className="text-white/60 text-sm">
            搜尋 &quot;{searchTerm}&quot; 的結果：{filteredShifts.length} 個班次
          </div>
        )}
      </div>

      {/* 班次列表 */}
      <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl p-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">班次列表</h2>
          <div className="space-y-3">
            {filteredShifts.map(shift => (
              <div
                key={shift.slug}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: shift.color || '#3B82F6' }}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium truncate">{shift.name}</h3>
                    <p className="text-white/60 text-sm">代碼：{shift.code}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                  <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0">
                    <div className="text-white/80 text-sm flex items-center">
                      日切時間：{shift.day_cut_time}
                    </div>
                    <div className="text-white/80 text-sm flex items-center gap-2">
                      週期天數：{shift.cycle_days} 天
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => handleManageTimeSlots(shift)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 md:flex-none"
                      onClick={() => handleEditShift(shift)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      編輯
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 flex-1 md:flex-none"
                      onClick={() => handleDeleteShift(shift.slug)}
                    >
                      <Trash2 className="h-3 w-3" />
                      移除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 新增班次表單 */}
      <CreateShiftForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateShift}
      />

      {/* 編輯班次表單 */}
      {selectedShift && (
        <EditShiftForm
          shift={selectedShift}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={handleUpdateShift}
        />
      )}

      {/* 刪除確認對話框 */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="確認刪除班次"
        description="確定要刪除此班次嗎？此操作無法復原。"
      />
    </div>
  );
};

export default ShiftList;
