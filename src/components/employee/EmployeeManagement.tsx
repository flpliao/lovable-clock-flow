import DeleteConfirmDialog from '@/components/common/dialogs/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/employee';
import { Plus, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import CreateEmployeeForm from './CreateEmployeeForm';
import EditEmployeeForm from './EditEmployeeForm';
import { EmployeeList } from './EmployeeList';

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // 對話框狀態
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employeeToChangePassword, setEmployeeToChangePassword] = useState<Employee | null>(null);

  // 使用操作 hook
  const {
    employees,
    isLoading,
    loadEmployees,
    handleCreateEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleChangePassword,
  } = useEmployees();

  useEffect(() => {
    loadEmployees();
  }, []);

  // 篩選員工列表
  const filteredEmployees = employees.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roles?.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理編輯員工
  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  // 處理刪除員工點擊
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  // 處理變更密碼點擊
  const handleChangePasswordClick = (employee: Employee) => {
    setEmployeeToChangePassword(employee);
    setIsChangePasswordDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 主要內容卡片 */}
      <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl text-gray-900 drop-shadow-sm">
              <div className="p-2 bg-purple-500/90 rounded-lg shadow-md mr-3">
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
            </div>
          </div>

          {/* 員工列表 */}
          <EmployeeList
            employeeList={filteredEmployees}
            loading={isLoading}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteClick}
            onChangePassword={handleChangePasswordClick}
          />
        </CardContent>
      </Card>

      {/* 新增和編輯員工對話框 */}
      <CreateEmployeeForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateEmployee}
      />
      <EditEmployeeForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateEmployee}
        employee={currentEmployee}
        setEmployee={setCurrentEmployee}
      />
      {/* 密碼變更對話框 */}
      <ChangePasswordForm
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
        onSubmit={handleChangePassword}
        employee={employeeToChangePassword}
      />

      {/* 刪除確認對話框 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => handleDeleteEmployee(employeeToDelete?.slug)}
        title="確認刪除員工"
        description={`確定要刪除員工「${employeeToDelete?.name}」嗎？此操作無法復原。`}
      />
    </div>
  );
};

export default EmployeeManagement;
