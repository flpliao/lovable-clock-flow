import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBranches } from '@/hooks/useBranches';
import { Checkpoint, useCheckpoints } from '@/hooks/useCheckInPoints';
import { useCompany } from '@/hooks/useCompany';
import { Branch } from '@/types/company';
import { Building, MapPin, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddBranchDialog from './AddBranchDialog';
import BranchTable from './BranchTable';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';
import AddCheckpointDialog from './components/AddCheckpointDialog';
import CheckpointTable from './components/CheckpointTable';
import EditCheckpointDialog from './components/EditCheckpointDialog';

const CompanyManagement = () => {
  // 使用 Zustand store
  const { company, loadCompany } = useCompany();
  const { data: branches, loading: branchesLoading, loadBranches } = useBranches();

  // 本地狀態
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [activeTab, setActiveTab] = useState('branches');
  const [isAddCheckpointOpen, setIsAddCheckpointOpen] = useState(false);
  const [editCheckpoint, setEditCheckpoint] = useState<Checkpoint | null>(null);
  const { data: checkpoints, loading: checkpointsLoading, loadCheckpoints } = useCheckpoints();

  useEffect(() => {
    loadCompany();
  }, []);

  useEffect(() => {
    loadBranches(company?.id);
  }, [company?.id]);

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsEditBranchDialogOpen(true);
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
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'branches':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">單位管理</h3>
                    <p className="text-white/80 text-sm mt-1">管理所有單位資訊</p>
                  </div>
                </div>
                <Button
                  onClick={handleAddBranch}
                  className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新增單位
                </Button>
              </div>
              <BranchTable
                branches={branches}
                onEdit={handleEditBranch}
                loading={branchesLoading}
              />
            </div>
          </div>
        );
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
                <Button
                  onClick={() => setIsAddCheckpointOpen(true)}
                  className="bg-green-500/80 hover:bg-green-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新增打卡點
                </Button>
              </div>
              <CheckpointTable
                onEdit={setEditCheckpoint}
                data={checkpoints}
                loading={checkpointsLoading}
                refresh={loadCheckpoints}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 標籤導航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-xl border border-white/30">
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
      <AddBranchDialog
        open={isAddBranchDialogOpen}
        onClose={() => setIsAddBranchDialogOpen(false)}
      />
      <EditBranchDialog
        open={isEditBranchDialogOpen}
        onClose={() => {
          setIsEditBranchDialogOpen(false);
          setCurrentBranch(null);
        }}
        branch={currentBranch}
      />
      <EditCompanyDialog
        open={isEditCompanyDialogOpen}
        onClose={() => setIsEditCompanyDialogOpen(false)}
      />
      <AddCheckpointDialog
        open={isAddCheckpointOpen}
        onClose={() => setIsAddCheckpointOpen(false)}
        onSuccess={loadCheckpoints}
      />
      <EditCheckpointDialog
        open={!!editCheckpoint}
        onClose={() => setEditCheckpoint(null)}
        checkpoint={editCheckpoint}
        onSuccess={loadCheckpoints}
      />
    </div>
  );
};

export default CompanyManagement;
