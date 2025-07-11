import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { staffService } from '@/services/staffService';
import { Filter, Plus, Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddStaffDialog from './AddStaffDialog';
import { ROLE_ID_MAP } from './constants/roleIdMap';
import EditStaffDialog from './EditStaffDialog';
import { StaffList } from './StaffList';
import { NewStaff, Staff } from './types';

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<
    'all' | 'name' | 'email' | 'role' | 'department' | 'position'
  >('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const { toast } = useToast();

  // 載入員工列表
  const loadStaffList = async () => {
    try {
      setLoading(true);
      const data = await staffService.loadStaffList();
      setStaffList(data);
    } catch (error) {
      console.error('載入員工列表失敗:', error);
      toast({
        title: '載入失敗',
        description: error instanceof Error ? error.message : '無法載入員工列表',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始載入
  useEffect(() => {
    loadStaffList();
  }, []);

  // 進階多條件搜尋欄位與運算子定義
  const SEARCH_FIELDS = [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '信箱' },
    { value: 'role', label: '角色' },
    { value: 'department', label: '部門' },
    { value: 'position', label: '職位' },
  ];
  const OPERATORS = [
    { value: 'contains', label: '包含' },
    { value: 'not_contains', label: '不包含' },
    { value: 'equals', label: '等於' },
    { value: 'not_equals', label: '不等於' },
    { value: 'starts_with', label: '開頭為' },
    { value: 'ends_with', label: '結尾為' },
  ];

  // 多條件搜尋 state
  const [conditions, setConditions] = useState([
    { field: 'name', operator: 'contains', value: '' },
  ]);
  const [logic, setLogic] = useState<'AND' | 'OR'>('AND');

  // 新增條件
  const addCondition = () => {
    setConditions([...conditions, { field: 'name', operator: 'contains', value: '' }]);
  };
  // 刪除條件
  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };
  // 更新條件
  const updateCondition = (idx: number, key: string, val: string) => {
    setConditions(conditions.map((c, i) => (i === idx ? { ...c, [key]: val } : c)));
  };
  // 清除全部條件
  const clearAllConditions = () => {
    setConditions([{ field: 'name', operator: 'contains', value: '' }]);
  };
  // 計算已套用條件數
  const appliedConditionCount = conditions.filter(c => c.value.trim() !== '').length;

  // 多條件組合 filter function
  const applyMultiConditionFilter = (staff: Staff) => {
    // 若所有條件皆為空，直接通過
    if (conditions.every(c => !c.value.trim())) return true;
    // 依據 AND/OR 決定邏輯
    const results = conditions.map(cond => {
      const val = cond.value.trim().toLowerCase();
      let target = '';
      if (cond.field === 'role') {
        target = (ROLE_ID_MAP[staff.role_id || ''] || '').toLowerCase();
      } else {
        target = (staff[cond.field as keyof Staff] || '').toString().toLowerCase();
      }
      switch (cond.operator) {
        case 'contains':
          return target.includes(val);
        case 'not_contains':
          return !target.includes(val);
        case 'equals':
          return target === val;
        case 'not_equals':
          return target !== val;
        case 'starts_with':
          return target.startsWith(val);
        case 'ends_with':
          return target.endsWith(val);
        default:
          return true;
      }
    });
    return logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
  };

  // 進階過濾員工列表
  const filteredStaff = staffList.filter(staff => {
    // 若進階篩選展開且有條件，優先用多條件組合搜尋
    if (showAdvancedFilters && appliedConditionCount > 0) {
      return applyMultiConditionFilter(staff);
    }
    // 否則維持原本搜尋與篩選
    const searchLower = searchTerm.toLowerCase();
    let matchesSearch = false;
    if (searchField === 'all') {
      matchesSearch =
        staff.name?.toLowerCase().includes(searchLower) ||
        staff.email?.toLowerCase().includes(searchLower) ||
        ROLE_ID_MAP[staff.role_id || '']?.toLowerCase().includes(searchLower) ||
        staff.department?.toLowerCase().includes(searchLower) ||
        staff.position?.toLowerCase().includes(searchLower);
    } else {
      switch (searchField) {
        case 'name':
          matchesSearch = staff.name?.toLowerCase().includes(searchLower);
          break;
        case 'email':
          matchesSearch = staff.email?.toLowerCase().includes(searchLower);
          break;
        case 'role':
          matchesSearch = ROLE_ID_MAP[staff.role_id || '']?.toLowerCase().includes(searchLower);
          break;
        case 'department':
          matchesSearch = staff.department?.toLowerCase().includes(searchLower);
          break;
        case 'position':
          matchesSearch = staff.position?.toLowerCase().includes(searchLower);
          break;
      }
    }
    const matchesRole = roleFilter === 'all' || staff.role_id === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;

    try {
      setLoading(true);
      await staffService.deleteStaff(staffToDelete.id);
      toast({
        title: '刪除成功',
        description: `員工「${staffToDelete.name}」資料已刪除`,
      });
      await loadStaffList();
    } catch (error) {
      console.error('刪除員工失敗:', error);
      toast({
        title: '刪除失敗',
        description: error instanceof Error ? error.message : '無法刪除員工資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleAddSuccess = async (newStaff: NewStaff) => {
    try {
      setLoading(true);
      await staffService.addStaff(newStaff);
      toast({
        title: '新增成功',
        description: `員工 ${newStaff.name} 已新增`,
      });
      setIsAddDialogOpen(false);
      await loadStaffList();
    } catch (error) {
      console.error('新增員工失敗:', error);
      toast({
        title: '新增失敗',
        description: error instanceof Error ? error.message : '無法新增員工',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = async (updatedStaff: Staff) => {
    try {
      setLoading(true);
      await staffService.updateStaff(updatedStaff.id, updatedStaff);
      toast({
        title: '更新成功',
        description: `員工 ${updatedStaff.name} 資料已更新`,
      });
      setIsEditDialogOpen(false);
      await loadStaffList();
    } catch (error) {
      console.error('更新員工失敗:', error);
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '無法更新員工資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 主要管理介面 */}
      <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl text-gray-900 drop-shadow-sm">
              <div className="p-2 bg-blue-500/90 rounded-lg shadow-md mr-3">
                <Users className="h-5 w-5 text-white" />
              </div>
              員工管理
            </CardTitle>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-500/90 hover:bg-green-600/90 text-white shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增員工
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 搜尋區域 */}
          <div className="space-y-3">
            {/* 主要搜尋列 */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={
                    searchField === 'all'
                      ? '搜尋姓名、信箱、角色、部門或職位...'
                      : searchField === 'email'
                        ? '搜尋信箱...'
                        : searchField === 'role'
                          ? '搜尋角色...'
                          : searchField === 'name'
                            ? '搜尋姓名...'
                            : searchField === 'department'
                              ? '搜尋部門...'
                              : '搜尋職位...'
                  }
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-white/40 backdrop-blur-sm"
                />
              </div>

              {/* 搜尋欄位選擇 */}
              <Select
                value={searchField}
                onValueChange={(
                  value: 'all' | 'name' | 'email' | 'role' | 'department' | 'position'
                ) => setSearchField(value)}
              >
                <SelectTrigger className="w-32 bg-white/70 border-white/40 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部欄位</SelectItem>
                  <SelectItem value="name">姓名</SelectItem>
                  <SelectItem value="email">信箱</SelectItem>
                  <SelectItem value="role">角色</SelectItem>
                  <SelectItem value="department">部門</SelectItem>
                  <SelectItem value="position">職位</SelectItem>
                </SelectContent>
              </Select>

              {/* 進階篩選按鈕 */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`bg-white/60 border-white/40 hover:bg-white/80 ${showAdvancedFilters ? 'bg-blue-100/80 border-blue-300/60' : ''}`}
              >
                <Filter className="h-4 w-4 mr-1" />
                篩選
              </Button>

              {/* 重新整理按鈕 */}
              <Button
                variant="outline"
                onClick={loadStaffList}
                className="bg-white/60 border-white/40 hover:bg-white/80"
              >
                重新整理
              </Button>
            </div>

            {/* 進階篩選區域 */}
            {showAdvancedFilters && (
              <div className="bg-white/40 rounded-lg p-4 border border-white/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    進階篩選
                  </h3>
                  {appliedConditionCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllConditions}
                      className="text-gray-500 hover:text-gray-700 h-6 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      清除全部
                    </Button>
                  )}
                </div>

                {/* 多條件組合搜尋 UI */}
                <div className="space-y-2 mb-3">
                  {conditions.map((cond, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {/* 欄位選擇 */}
                      <Select
                        value={cond.field}
                        onValueChange={val => updateCondition(idx, 'field', val)}
                      >
                        <SelectTrigger className="w-28 bg-white/70 border-white/40 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SEARCH_FIELDS.map(f => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* 運算子選擇 */}
                      <Select
                        value={cond.operator}
                        onValueChange={val => updateCondition(idx, 'operator', val)}
                      >
                        <SelectTrigger className="w-24 bg-white/70 border-white/40 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* 值輸入 */}
                      <Input
                        value={cond.value}
                        onChange={e => updateCondition(idx, 'value', e.target.value)}
                        className="w-40 bg-white/70 border-white/40 backdrop-blur-sm"
                        placeholder="請輸入內容"
                      />
                      {/* 移除條件 */}
                      {conditions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCondition(idx)}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {/* AND/OR 切換（僅第一條件不顯示） */}
                      {idx > 0 && (
                        <Button
                          variant={logic === 'AND' ? 'outline' : 'secondary'}
                          size="sm"
                          onClick={() => setLogic(logic === 'AND' ? 'OR' : 'AND')}
                          className="ml-2"
                        >
                          {logic}
                        </Button>
                      )}
                    </div>
                  ))}
                  {/* 新增條件 */}
                  <Button variant="outline" size="sm" onClick={addCondition} className="mt-1">
                    + 新增條件
                  </Button>
                </div>

                {/* 篩選結果統計 */}
                <div className="mt-3 pt-3 border-t border-white/30">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      搜尋結果：{filteredStaff.length} / {staffList.length} 筆資料
                    </span>
                    {appliedConditionCount > 0 && (
                      <span className="text-blue-600 font-medium">
                        已套用 {appliedConditionCount} 個條件
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 篩選狀態指示器 */}
            {appliedConditionCount > 0 && !showAdvancedFilters && (
              <div className="flex items-center justify-between bg-blue-50/60 rounded-lg p-2 border border-blue-200/40">
                <div className="flex items-center space-x-2">
                  <Filter className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">已套用篩選條件</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllConditions}
                  className="text-blue-600 hover:text-blue-800 h-6 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  清除
                </Button>
              </div>
            )}
          </div>

          {/* 員工列表 */}
          <StaffList
            staffList={filteredStaff}
            loading={loading}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* 新增和編輯員工對話框 */}
      <AddStaffDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />
      <EditStaffDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        staff={selectedStaff}
        onSuccess={handleEditSuccess}
      />

      {/* 刪除確認對話框 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="確認刪除員工"
        description={`確定要刪除員工「${staffToDelete?.name}」嗎？此操作無法復原，將永久刪除該員工的所有資料。`}
      />
    </div>
  );
};

export default StaffManagement;
