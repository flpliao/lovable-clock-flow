
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Building2, Settings } from 'lucide-react';
import { useSupabaseCompanyOperations } from './hooks/useSupabaseCompanyOperations';
import { CompanyInfoCard } from './CompanyInfoCard';
import { BranchTable } from './BranchTable';
import { ComprehensiveDiagnostics } from './diagnostics/ComprehensiveDiagnostics';

const CompanyManagementRedesigned = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    company,
    branches,
    loading,
    updateCompany,
    addBranch,
    updateBranch,
    deleteBranch,
    refreshData
  } = useSupabaseCompanyOperations();

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700">
          重新設計的公司管理系統，提供更可靠的資料同步和安全性診斷功能
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            公司總覽
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            營業處管理
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            系統診斷
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CompanyInfoCard
            company={company}
            loading={loading}
            onUpdate={updateCompany}
            onRefresh={refreshData}
          />
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <BranchTable
            branches={branches}
            loading={loading}
            onAdd={addBranch}
            onUpdate={updateBranch}
            onDelete={deleteBranch}
            onRefresh={refreshData}
          />
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <ComprehensiveDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyManagementRedesigned;
