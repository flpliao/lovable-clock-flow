
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import RoleTable from './RoleTable';
import AddRoleDialog from './AddRoleDialog';
import EditRoleDialog from './EditRoleDialog';
import { StaffRole, NewStaffRole } from './types';

const RoleManagement = () => {
  const { roles } = useStaffManagementContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<StaffRole | null>(null);
  
  const openEditDialog = (role: StaffRole) => {
    setCurrentRole(role);
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>角色管理</CardTitle>
            <CardDescription>
              管理系統角色和權限設定
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> 新增角色
          </Button>
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
