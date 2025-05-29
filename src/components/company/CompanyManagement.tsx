
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { CompanyManagementProvider } from './CompanyManagementContext';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';

const CompanyManagement = () => {
  const { isAdmin } = useUser();

  return (
    <CompanyManagementProvider>
      <div className="space-y-6">
        {/* Company Basic Information */}
        <CompanyInfoCard />
        
        {/* Branch Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>營業處與門市管理</CardTitle>
              <CardDescription>
                {isAdmin() 
                  ? "管理所有營業處和門市資料，建立組織架構" 
                  : "查看營業處和門市資料"}
              </CardDescription>
            </div>
            <AddBranchDialog />
          </CardHeader>
          <CardContent>
            <BranchTable />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <EditBranchDialog />
        <EditCompanyDialog />
      </div>
    </CompanyManagementProvider>
  );
};

export default CompanyManagement;
