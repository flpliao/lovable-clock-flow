
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useSupabaseRoleManagement } from './hooks/useSupabaseRoleManagement';
import RoleTable from './RoleTable';
import AddRoleDialog from './AddRoleDialog';
import EditRoleDialog from './EditRoleDialog';
import { StaffRole } from './types';

const RoleManagement = () => {
  const { roles, loading, refreshRoles } = useSupabaseRoleManagement();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<StaffRole | null>(null);
  
  const openEditDialog = (role: StaffRole) => {
    setCurrentRole(role);
    setIsEditDialogOpen(true);
  };

  const handleRefresh = () => {
    console.log('🔄 手動重新載入角色資料');
    refreshRoles();
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-32">
              <div className="text-white/80">載入角色資料中...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-white">角色管理</CardTitle>
            <CardDescription className="text-white/80">
              管理系統角色和權限設定
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> 重新載入
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-1" /> 新增角色
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RoleTable 
            roles={roles} 
            onEdit={openEditDialog}
          />
        </CardContent>
      </Card>
      
      <AddRoleDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
      
      {currentRole && (
        <EditRoleDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
          role={currentRole}
        />
      )}
    </div>
  );
};

export default RoleManagement;
