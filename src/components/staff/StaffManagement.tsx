import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { staffService } from '@/services/staffService';
import { Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';
import { StaffList } from './StaffList';
import { NewStaff, Staff } from './types';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { ROLE_ID_MAP } from './constants/roleIdMap';
import {
  AdvancedFilter,
  useAdvancedFilter,
  applyMultiConditionFilter,
  DEFAULT_OPERATORS,
  SearchField,
  FilterGroup,
} from '@/components/common/AdvancedFilter';

const StaffManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const { toast } = useToast();

  // 定義搜尋欄位
  const SEARCH_FIELDS: SearchField[] = [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '信箱' },
    { value: 'role', label: '角色' },
    { value: 'department', label: '部門' },
    { value: 'position', label: '職位' },
  ];

  // 篩選函數
  const applyStaffFilter = (staff: Staff, conditionGroups: FilterGroup[]) => {
    return applyMultiConditionFilter(staff, conditionGroups, (item, field) => {
      if (field === 'role') {
        return ROLE_ID_MAP[item.role_id || ''] || '';
      }
      return (item[field as keyof Staff] || '').toString();
    });
  };

  // 使用通用篩選 Hook
  const {
    conditionGroups,
    filteredData: filteredStaff,
    appliedConditionCount,
    showAdvancedFilters,
    setConditionGroups,
    setShowAdvancedFilters,
    clearAllConditions,
  } = useAdvancedFilter({
    data: staffList,
    searchFields: SEARCH_FIELDS,
    operators: DEFAULT_OPERATORS,
    applyFilter: applyStaffFilter,
  });

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
          {/* 使用通用篩選組件 */}
          <AdvancedFilter
            searchFields={SEARCH_FIELDS}
            operators={DEFAULT_OPERATORS}
            conditionGroups={conditionGroups}
            onConditionGroupsChange={setConditionGroups}
            data={staffList}
            filteredData={filteredStaff}
            applyFilter={applyStaffFilter}
            title="員工篩選"
            showAdvancedFilters={showAdvancedFilters}
            onShowAdvancedFiltersChange={setShowAdvancedFilters}
            onClearAll={clearAllConditions}
            onRefresh={loadStaffList}
          />

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
