import PageHeader from '@/components/layout/PageHeader';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShift } from '@/hooks/useShift';
import { CreateShiftData } from '@/types/shift';
import { Clock, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ShiftManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const { shifts, isLoading, error, loadAllShifts, createShiftData, deleteShiftData } = useShift();

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

  // 新增班次表單狀態
  const [newShift, setNewShift] = useState<CreateShiftData>({
    code: '',
    name: '',
    day_cut_time: '',
    cycle_days: 1,
    color: '#3B82F6',
  });

  const handleCreateShift = async () => {
    const result = await createShiftData(newShift);
    if (result) {
      setShowCreateForm(false);
      setNewShift({
        code: '',
        name: '',
        day_cut_time: '',
        cycle_days: 1,
        color: '#3B82F6',
      });
    }
  };

  const handleDeleteShift = async (slug: string) => {
    if (window.confirm('確定要刪除此班次嗎？')) {
      await deleteShiftData(slug);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        icon={Clock}
        title="班次規劃"
        description="管理員工工作班次設定"
        iconBgColor="bg-purple-500"
      />

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
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">載入中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">載入失敗：{error}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">班次列表</h2>
            <div className="space-y-3">
              {filteredShifts.map(shift => (
                <div
                  key={shift.slug}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: shift.color || '#3B82F6' }}
                    >
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{shift.name}</h3>
                      <p className="text-white/60 text-sm">代碼：{shift.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-white/80 text-sm">日切時間：{shift.day_cut_time}</div>
                    <div className="text-white/80 text-sm">週期天數：{shift.cycle_days} 天</div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        編輯
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                        onClick={() => handleDeleteShift(shift.slug)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 新增班次對話框 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">新增班次</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-white/80 text-sm">班次名稱</Label>
                <Input
                  value={newShift.name}
                  onChange={e => setNewShift({ ...newShift, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="例如：早班"
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">班次代碼</Label>
                <Input
                  value={newShift.code}
                  onChange={e => setNewShift({ ...newShift, code: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="例如：MORNING"
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">日切時間</Label>
                <Input
                  type="time"
                  value={newShift.day_cut_time}
                  onChange={e => setNewShift({ ...newShift, day_cut_time: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/80 text-sm">週期天數</Label>
                <Input
                  type="number"
                  value={newShift.cycle_days}
                  onChange={e => setNewShift({ ...newShift, cycle_days: Number(e.target.value) })}
                  className="bg-white/10 border-white/20 text-white"
                  min="1"
                  step="1"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateShift}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600"
                >
                  新增
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-white/10 border-white/20 text-white"
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ShiftManagement;
