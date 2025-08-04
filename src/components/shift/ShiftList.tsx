import CreateShiftForm from '@/components/shift/CreateShiftForm';
import CreateWorkScheduleForm from '@/components/shift/CreateWorkScheduleForm';
import EditShiftForm from '@/components/shift/EditShiftForm';
import WorkScheduleList from '@/components/shift/WorkScheduleList';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/ui/DeleteDialog';
import { Input } from '@/components/ui/input';
import { useShift } from '@/hooks/useShift';
import { CreateShiftData, Shift, UpdateShiftData } from '@/types/shift';
import { CreateWorkScheduleData, WorkSchedule } from '@/types/workSchedule';
import { ChevronDown, ChevronRight, Clock, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CreateWorkScheduleFormRef } from './CreateWorkScheduleForm';

const ShiftList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showCreateWorkScheduleForm, setShowCreateWorkScheduleForm] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showDeleteWorkScheduleDialog, setShowDeleteWorkScheduleDialog] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);
  const [workScheduleToDelete, setWorkScheduleToDelete] = useState<string | null>(null);
  const [expandedShifts, setExpandedShifts] = useState<Set<string>>(new Set());
  const formRef = useRef<CreateWorkScheduleFormRef>(null);

  const {
    shifts,
    isLoading,
    loadAllShifts,
    handleCreateShift,
    handleUpdateShift,
    handleDeleteShift,
    handleCreateWorkSchedule,
    handleDeleteWorkSchedule,
  } = useShift();

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

  const submitCreateShift = async (formData: CreateShiftData) => {
    const result = await handleCreateShift(formData);
    if (result) {
      setShowCreateForm(false);
    }
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setShowEditForm(true);
  };

  const submitUpdateShift = async (slug: string, formData: UpdateShiftData) => {
    const result = await handleUpdateShift(slug, formData);
    if (result) {
      setShowEditForm(false);
      setSelectedShift(null);
    }
  };

  const handleToggleExpand = (shiftSlug: string) => {
    const newExpanded = new Set(expandedShifts);
    if (newExpanded.has(shiftSlug)) {
      newExpanded.delete(shiftSlug);
    } else {
      newExpanded.add(shiftSlug);
    }
    setExpandedShifts(newExpanded);
  };

  const handleEditWorkSchedule = (workSchedule: WorkSchedule) => {
    // TODO: 實作編輯工作時程的功能
    console.log('編輯工作時程:', workSchedule);
  };

  const handleAddWorkSchedule = (shiftSlug: string) => {
    setSelectedShift(shifts.find(shift => shift.slug === shiftSlug) || null);
    setShowCreateWorkScheduleForm(true);
  };

  const submitCreateWorkSchedule = async (data: CreateWorkScheduleData) => {
    const result = await handleCreateWorkSchedule(data);
    if (result) {
      setShowCreateWorkScheduleForm(false);
      formRef.current?.reset();
    }
  };

  const handleDeleteWorkScheduleConfirm = async (slug: string) => {
    setWorkScheduleToDelete(slug);
    setShowDeleteWorkScheduleDialog(true);
  };

  const handleDeleteWorkScheduleConfirmAction = async () => {
    if (workScheduleToDelete) {
      const result = await handleDeleteWorkSchedule(workScheduleToDelete);
      if (result) {
        setWorkScheduleToDelete(null);
        setShowDeleteWorkScheduleDialog(false);
      }
    }
  };

  const handleDeleteShiftConfirm = (slug: string) => {
    setShiftToDelete(slug);
    setShowDeleteDialog(true);
  };

  const handleDeleteShiftConfirmAction = async () => {
    if (shiftToDelete) {
      await handleDeleteShift(shiftToDelete);
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
            {filteredShifts.map(shift => {
              const isExpanded = expandedShifts.has(shift.slug);
              const workSchedules = shift.work_schedules || [];

              return (
                <div key={shift.slug} className="space-y-2">
                  {/* 班次主項目 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors gap-4">
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
                            onClick={() => handleToggleExpand(shift.slug)}
                            className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
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
                          onClick={() => handleDeleteShiftConfirm(shift.slug)}
                        >
                          <Trash2 className="h-3 w-3" />
                          移除
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 展開的工作時程列表 */}
                  {isExpanded && (
                    <WorkScheduleList
                      workSchedules={workSchedules}
                      onAddWorkSchedule={() => handleAddWorkSchedule(shift.slug)}
                      onEditWorkSchedule={handleEditWorkSchedule}
                      onDeleteWorkSchedule={handleDeleteWorkScheduleConfirm}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 新增班次表單 */}
      <CreateShiftForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={submitCreateShift}
      />

      {/* 編輯班次表單 */}
      {selectedShift && (
        <EditShiftForm
          shift={selectedShift}
          open={showEditForm}
          onOpenChange={setShowEditForm}
          onSubmit={submitUpdateShift}
        />
      )}

      {/* 新增工作時程表單 */}
      {selectedShift && (
        <CreateWorkScheduleForm
          ref={formRef}
          shiftId={selectedShift.id}
          open={showCreateWorkScheduleForm}
          onOpenChange={setShowCreateWorkScheduleForm}
          onSubmit={submitCreateWorkSchedule}
        />
      )}

      {/* 刪除確認對話框 */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteShiftConfirmAction}
        title="確認刪除班次"
        description="確定要刪除此班次嗎？此操作無法復原。"
      />

      {/* 刪除工作時程確認對話框 */}
      <DeleteDialog
        open={showDeleteWorkScheduleDialog}
        onOpenChange={setShowDeleteWorkScheduleDialog}
        onConfirm={handleDeleteWorkScheduleConfirmAction}
        title="確認刪除工作時程"
        description="確定要刪除此工作時程嗎？此操作無法復原。"
      />
    </div>
  );
};

export default ShiftList;
