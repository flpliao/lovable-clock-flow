
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { DepartmentManagementProvider } from './DepartmentManagementContext';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import { Database, RefreshCw } from 'lucide-react';
import { useDepartmentManagementContext } from './DepartmentManagementContext';

const DepartmentManagementContent = () => {
  const { isAdmin } = useUser();
  const { departments, loading, refreshDepartments } = useDepartmentManagementContext();

  const handleRefresh = async () => {
    console.log('🔄 手動重新整理部門資料...');
    await refreshDepartments();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-600" />
              部門/門市管理
            </CardTitle>
            <CardDescription>
              {isAdmin() 
                ? `管理所有部門和門市資料 (已與後台同步) - 目前有 ${departments.length} 個部門/門市` 
                : `查看部門和門市資料 (已與後台同步) - 目前有 ${departments.length} 個部門/門市`}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              重新整理
            </Button>
            <AddDepartmentDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DepartmentTable />
        </CardContent>
      </Card>

      <EditDepartmentDialog />
    </div>
  );
};

const DepartmentManagement = () => {
  return (
    <DepartmentManagementProvider>
      <DepartmentManagementContent />
    </DepartmentManagementProvider>
  );
};

export default DepartmentManagement;
