import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { deleteStaff, loadStaff } from '@/hooks/useStaff';
import { useStaffStore } from '@/stores/staffStore';
import { Plus, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';
import { StaffList } from './StaffList';
import { Staff } from './types';

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // 對話框狀態
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  // 使用操作 hook
  const { staff } = useStaffStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleLoadStaff();
  }, []);

  // 篩選員工列表
  const filteredStaff = staff.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理編輯員工
  const handleEditStaff = (staff: Staff) => {
    setCurrentStaff(staff);
    setIsEditDialogOpen(true);
  };

  // 處理刪除員工點擊
  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff);
    setIsDeleteDialogOpen(true);
  };

  // 處理刪除確認
  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaff(staffToDelete.id);
      toast({
        title: '刪除成功',
        description: '員工已成功刪除',
      });
    } catch (error) {
      console.error('刪除員工失敗:', error);
      toast({
        title: '刪除失敗',
        description: error instanceof Error ? error.message : '無法刪除員工',
        variant: 'destructive',
      });
    }
  };

  // 處理新增成功
  const handleAddSuccess = () => {
    toast({
      title: '新增成功',
      description: '員工已成功新增',
    });
  };

  // 處理編輯成功
  const handleEditSuccess = () => {
    toast({
      title: '更新成功',
      description: '員工資料已成功更新',
    });
  };

  const handleLoadStaff = async () => {
    setLoading(true);
    await loadStaff();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* 主要內容卡片 */}
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
                  placeholder="搜尋姓名、信箱、角色、部門或職位..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 border-white/40 backdrop-blur-sm"
                />
              </div>

              {/* 重新整理按鈕 */}
              <Button
                variant="outline"
                onClick={handleLoadStaff}
                className="bg-white/60 border-white/40 hover:bg-white/80"
              >
                重新整理
              </Button>
            </div>
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
        staff={currentStaff}
        onSuccess={handleEditSuccess}
      />

      {/* 刪除確認對話框 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="確認刪除員工"
        description={`確定要刪除員工「${staffToDelete?.name}」嗎？此操作無法復原。`}
      />
    </div>
  );
};

export default StaffManagement;
