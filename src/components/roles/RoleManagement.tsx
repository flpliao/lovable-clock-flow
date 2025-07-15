import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/services/roleService';
import { useRoleStore } from '@/stores/roleStore';
import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddRoleDialog from './AddRoleDialog';
import RoleFilters from './RoleFilters';
import RoleTable from './RoleTable';

const RoleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const { roles, setRoles } = useRoleStore();
  const { toast } = useToast();

  useEffect(() => {
    if (roles.length > 0) {
      setLoading(false);
      return;
    }

    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = await roleService.getRoles();
        setRoles(data);
      } catch {
        toast({
          title: '載入失敗',
          description: '無法載入職位資料，請稍後再試',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [roles, setRoles, toast, setLoading]);

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
        <AddRoleDialog />
      </div>

      <div className="space-y-6">
        <RoleFilters
          onSearchChange={handleSearchChange}
          onSortOrderChange={handleSortOrderChange}
        />
        <RoleTable roles={roles} loading={loading} searchTerm={searchTerm} sortOrder={sortOrder} />
      </div>
    </div>
  );
};

export default RoleManagement;
