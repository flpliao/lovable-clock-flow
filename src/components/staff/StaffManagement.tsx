
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Plus, Search } from 'lucide-react';
import { useSupabaseStaffOperations } from './hooks/useSupabaseStaffOperations';
import { StaffList } from './StaffList';
import { AddStaffDialog } from './AddStaffDialog';
import { StaffRLSStatus } from './StaffRLSStatus';

const StaffManagement: React.FC = () => {
  console.log('🎯 StaffManagement rendering');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    staffList,
    roles,
    loading,
    addStaff,
    updateStaff,
    deleteStaff,
    refreshData
  } = useSupabaseStaffOperations();

  // 過濾員工列表
  const filteredStaff = staffList.filter(staff => 
    staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* RLS 狀態監控 */}
      <StaffRLSStatus />
      
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
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜尋員工姓名、部門或職位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 border-white/40 backdrop-blur-sm"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={refreshData}
              className="bg-white/60 border-white/40 hover:bg-white/80"
            >
              重新整理
            </Button>
          </div>

          {/* 員工列表 */}
          <StaffList
            staffList={filteredStaff}
            loading={loading}
            onUpdateStaff={updateStaff}
            onDeleteStaff={deleteStaff}
            roles={roles}
          />
        </CardContent>
      </Card>

      {/* 新增員工對話框 */}
      <AddStaffDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStaff={addStaff}
        roles={roles}
      />
    </div>
  );
};

export default StaffManagement;
