
import React, { useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, UserCog, Users, RefreshCw } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import CredentialManagementDialog from './CredentialManagementDialog';
import AddStaffDialog from './AddStaffDialog';

const StaffTable: React.FC = () => {
  const { 
    staffList,
    loading,
    openEditDialog, 
    handleDeleteStaff,
    getSupervisorName,
    refreshData
  } = useStaffManagementContext();
  
  const { isAdmin, currentUser } = useUser();

  useEffect(() => {
    console.log('📋 員工表格渲染狀態:', {
      staffCount: staffList.length,
      currentUser: currentUser?.name,
      isAdmin: isAdmin(),
      loading
    });
  }, [staffList.length, currentUser, isAdmin, loading]);

  const handleRefresh = async () => {
    console.log('🔄 廖俊雄手動重新載入員工資料');
    await refreshData();
  };
  
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-100/70 rounded-full">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">正在載入員工資料</h3>
        <p className="text-gray-700">請稍等，正在從後台載入員工資料...</p>
      </div>
    );
  }
  
  if (staffList.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100/70 rounded-full">
            <Users className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未載入到後台員工資料</h3>
        <p className="text-gray-700 mb-4">後台有員工資料但前台顯示為空，請點擊重新載入按鈕</p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="bg-white/25 border-white/40 text-gray-700 hover:bg-white/35"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入後台資料
          </Button>
          <AddStaffDialog />
        </div>
      </div>
    );
  }
  
  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-white/20">
        <div className="flex justify-between items-center">
          <div className="text-gray-800">
            <p className="text-sm">後台連線狀態：✅ 已連接</p>
            <p className="text-sm">載入的員工數量：{staffList.length} 人</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-white/25 border-white/40 text-gray-700 hover:bg-white/35"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入後台資料
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/40 bg-white/20">
              <TableHead className="text-gray-900 font-semibold py-4 px-6">姓名</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">職位</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">部門</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">營業處</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">主管</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6 text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((staff, index) => (
              <TableRow 
                key={staff.id} 
                className={`border-white/30 hover:bg-white/40 transition-colors ${
                  index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'
                }`}
              >
                <TableCell className="font-medium text-gray-900 py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100/70 rounded-lg">
                      <UserCog className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold">{staff.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-800 py-4 px-6 font-medium">{staff.position}</TableCell>
                <TableCell className="text-gray-800 py-4 px-6 font-medium">{staff.department}</TableCell>
                <TableCell className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100/70 text-blue-800 border border-blue-200/50">
                    {staff.branch_name || '未設定'}
                  </span>
                </TableCell>
                <TableCell className="text-gray-800 py-4 px-6 font-medium">{getSupervisorName(staff.supervisor_id)}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(staff)}
                      className="h-9 w-9 p-0 hover:bg-blue-100/70 text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <CredentialManagementDialog staff={staff}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-green-100/70 text-green-600 hover:text-green-700"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </CredentialManagementDialog>
                    
                    {isAdmin() && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-red-100/70 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffTable;
