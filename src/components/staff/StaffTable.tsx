
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Settings, Key } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { Staff } from './types';
import { useUser } from '@/contexts/UserContext';
import CredentialManagementDialog from './CredentialManagementDialog';

const StaffTable = () => {
  const { 
    filteredStaffList, 
    loading, 
    openEditDialog, 
    handleDeleteStaff,
    hasPermission,
    getSupervisorName
  } = useStaffManagementContext();
  const { currentUser, isAdmin } = useUser();
  const [selectedStaffForCredentials, setSelectedStaffForCredentials] = useState<Staff | null>(null);
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false);

  // 檢查是否有帳號管理權限 - 系統管理員應該擁有權限
  const canManageAccounts = currentUser && (
    isAdmin() || // 系統管理員直接允許
    hasPermission(currentUser.id, 'account:email:manage') ||
    hasPermission(currentUser.id, 'account:password:manage')
  );

  console.log('👥 人員列表帳號管理權限檢查:', {
    currentUser: currentUser?.name,
    role: currentUser?.role,
    isAdmin: isAdmin(),
    canManageAccounts
  });

  const handleCredentialManagement = (staff: Staff) => {
    console.log('🔐 開啟帳號設定對話框:', staff.name);
    setSelectedStaffForCredentials(staff);
    setIsCredentialDialogOpen(true);
  };

  const handleCredentialDialogClose = () => {
    console.log('🔐 關閉帳號設定對話框');
    setIsCredentialDialogOpen(false);
    setSelectedStaffForCredentials(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (filteredStaffList.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">目前沒有員工資料</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-white/70 backdrop-blur-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>職位</TableHead>
              <TableHead>部門</TableHead>
              <TableHead>分店/分部</TableHead>
              <TableHead>直屬主管</TableHead>
              <TableHead>聯絡方式</TableHead>
              <TableHead>角色</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaffList.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.branch_name}</TableCell>
                <TableCell>
                  <span className={`text-sm ${
                    staff.supervisor_id ? 'text-gray-900' : 'text-gray-500 italic'
                  }`}>
                    {getSupervisorName(staff.supervisor_id)}
                  </span>
                </TableCell>
                <TableCell>{staff.contact}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    staff.role === 'admin' ? 'bg-red-100 text-red-800' :
                    staff.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.role === 'admin' ? '管理員' : 
                     staff.role === 'manager' ? '主管' : '員工'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(staff)}>
                        <Edit className="mr-2 h-4 w-4" />
                        編輯
                      </DropdownMenuItem>
                      {canManageAccounts && (
                        <DropdownMenuItem onClick={() => handleCredentialManagement(staff)}>
                          <Key className="mr-2 h-4 w-4" />
                          帳號設定
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        刪除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 帳號設定對話框 */}
      {selectedStaffForCredentials && (
        <CredentialManagementDialog
          staff={selectedStaffForCredentials}
          open={isCredentialDialogOpen}
          onOpenChange={setIsCredentialDialogOpen}
        />
      )}
    </>
  );
};

export default StaffTable;
