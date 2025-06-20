
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, Building, Settings, MapPin } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useIsMobile } from '@/hooks/use-mobile';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';
import { RLSSettingsCard } from './components/RLSSettingsCard';
import CheckInDistanceSettings from './components/CheckInDistanceSettings';

const CompanyManagementRedesigned = () => {
  const { currentUser } = useUser();
  const { setIsAddBranchDialogOpen, branches } = useCompanyManagementContext();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('company');
  
  // 允許廖俊雄和管理員管理營業處
  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  const tabs = [
    {
      id: 'company',
      label: '公司資訊',
      icon: Building2,
      description: '管理公司基本資訊'
    },
    {
      id: 'branches',
      label: '分店管理',
      icon: Building,
      description: '管理分店與分部'
    },
    {
      id: 'settings',
      label: '系統設定',
      icon: Settings,
      description: '系統參數設定'
    },
    {
      id: 'checkin',
      label: '打卡設定',
      icon: MapPin,
      description: 'GPS打卡距離設定'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyInfoCard />;
      case 'branches':
        return (
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    營業處管理 ({branches?.length || 0})
                  </h3>
                  <p className="text-white/80 text-sm mt-1">管理所有營業處資訊</p>
                </div>
              </div>
              {canManageBranches && (
                <Button
                  onClick={handleAddBranch}
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新增營業處
                </Button>
              )}
            </div>
            <BranchTable />
          </div>
        );
      case 'settings':
        return <RLSSettingsCard />;
      case 'checkin':
        return <CheckInDistanceSettings />;
      default:
        return <CompanyInfoCard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 標籤導航 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">公司管理</h1>
            <p className="text-white/80 mt-1">管理公司資訊、分店和系統設定</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/20 backdrop-blur-xl border border-white/30">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.substring(0, 2)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* 標籤內容 */}
      {renderTabContent()}

      {/* 對話框 */}
      <AddBranchDialog />
      <EditBranchDialog />
      <EditCompanyDialog />
    </div>
  );
};

export default CompanyManagementRedesigned;
