import { useToast } from '@/hooks/use-toast';
import { useRoles } from '@/hooks/useRoles';
import { Briefcase, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import AddRoleDialog from './AddRoleDialog';
import RoleFilters from './RoleFilters';
import RoleTable from './RoleTable';

const RoleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: roles, loading, loadRoles } = useRoles();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        await loadRoles();
      } catch {
        toast({
          title: '載入失敗',
          description: '無法載入職位資料，請稍後再試',
          variant: 'destructive',
        });
      }
    };
    fetch();
  }, [toast]);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleSortOrderChange = (newSortOrder: 'asc' | 'desc') => {
    setSortOrder(newSortOrder);
  };

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">職位管理</h2>
        </div>
        <Button
          size="sm"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          新增職位
        </Button>
      </div>

      <div className="space-y-6">
        <RoleFilters
          onSearchChange={handleSearchChange}
          onSortOrderChange={handleSortOrderChange}
        />
        <RoleTable roles={roles} loading={loading} searchTerm={searchTerm} sortOrder={sortOrder} />
      </div>
      <AddRoleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onRoleAdded={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};

export default RoleManagement;
