import AddDepartmentDialog from '@/components/departments/AddDepartmentDialog';
import EditDepartmentDialog from '@/components/departments/EditDepartmentDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsAdmin } from '@/hooks/useStores';
import { Building, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import AddBranchDialog from './AddBranchDialog';
import BranchTable from './BranchTable';
import CompanyInfoCard from './CompanyInfoCard';
import { useCompanyManagementContext } from './CompanyManagementContext';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';
import CheckInDistanceSettings from './components/CheckInDistanceSettings';
import CheckpointTable from './components/CheckpointTable';
import AddCheckpointDialog from './components/AddCheckpointDialog';
import EditCheckpointDialog from './components/EditCheckpointDialog';
import { useCheckpoints, Checkpoint } from './components/useCheckpoints';

const CompanyManagementRedesigned = () => {
  const isAdmin = useIsAdmin();
  const { setIsAddBranchDialogOpen, branches } = useCompanyManagementContext();
  const [activeTab, setActiveTab] = useState('branches');
  const [isAddCheckpointOpen, setIsAddCheckpointOpen] = useState(false);
  const [editCheckpoint, setEditCheckpoint] = useState<Checkpoint | null>(null);
  const {
    data: checkpoints,
    loading: checkpointsLoading,
    refresh: refreshCheckpoints,
  } = useCheckpoints();

  const canManageBranches = isAdmin;

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  const tabs = [
    {
      id: 'branches',
      label: '單位管理',
      icon: Building,
      description: '管理單位資訊',
    },
    {
      id: 'checkpoints',
      label: '打卡點管理',
      icon: MapPin,
      description: '管理打卡點',
    },
    {
      id: 'checkin',
      label: '打卡設定',
      icon: Plus,
      description: 'GPS打卡距離設定',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyInfoCard />;
      case 'branches':
        return (
          <div className="space-y-6">
            {/* 營業處管理區塊 */}
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">
                      單位管理 ({branches?.length || 0})
                    </h3>
                    <p className="text-white/80 text-sm mt-1">管理所有單位資訊</p>
                  </div>
                </div>
                {canManageBranches && (
                  <Button
                    onClick={handleAddBranch}
                    className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新增單位
                  </Button>
                )}
              </div>
              <BranchTable />
            </div>
          </div>
        );
      case 'checkin':
        return <CheckInDistanceSettings />;
      case 'checkpoints':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">打卡點管理</h3>
                    <p className="text-white/80 text-sm mt-1">管理所有打卡點</p>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    onClick={() => setIsAddCheckpointOpen(true)}
                    className="bg-green-500/80 hover:bg-green-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新增打卡點
                  </Button>
                )}
              </div>
              <CheckpointTable
                onEdit={setEditCheckpoint}
                data={checkpoints}
                loading={checkpointsLoading}
                refresh={refreshCheckpoints}
              />
            </div>
          </div>
        );
      default:
        return <CompanyInfoCard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 標籤導航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-xl border border-white/30">
          {tabs.map(tab => {
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

      {/* 標籤內容 */}
      {renderTabContent()}

      {/* 對話框 */}
      <AddBranchDialog />
      <AddDepartmentDialog />
      <EditBranchDialog />
      <EditDepartmentDialog />
      <EditCompanyDialog />
      <AddCheckpointDialog
        open={isAddCheckpointOpen}
        onClose={() => setIsAddCheckpointOpen(false)}
        onSuccess={refreshCheckpoints}
      />
      <EditCheckpointDialog
        open={!!editCheckpoint}
        onClose={() => setEditCheckpoint(null)}
        checkpoint={editCheckpoint}
        onSuccess={refreshCheckpoints}
      />
    </div>
  );
};

export default CompanyManagementRedesigned;
