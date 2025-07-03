import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsAdmin } from '@/hooks/useStores';
import { Badge, Building, Edit, MapPin, Phone, Trash2, User } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';

const BranchTable = () => {
  const { 
    filteredBranches,
    handleDeleteBranch,
    openEditBranchDialog
  } = useCompanyManagementContext();
  
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();

  const canManageBranches = isAdmin;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'headquarters':
        return '總公司';
      case 'branch':
        return '分公司';
      case 'store':
        return '門市';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'headquarters':
        return 'bg-blue-500/70 text-white';
      case 'branch':
        return 'bg-green-500/70 text-white';
      case 'store':
        return 'bg-orange-500/70 text-white';
      default:
        return 'bg-gray-500/70 text-white';
    }
  };

  // 如果沒有營業處資料
  if (filteredBranches.length === 0) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 mx-auto text-white/50 mb-4" />
        <p className="text-white/70">尚未建立營業處資料</p>
      </div>
    );
  }

  // 手機版卡片視圖
  if (isMobile) {
    return (
      <div className="space-y-4">
        {filteredBranches.map((branch) => (
          <div key={branch.id} className="backdrop-blur-sm bg-white/20 border border-white/30 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/70 rounded-lg">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{branch.name}</h4>
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs ${getTypeColor(branch.type)}`}>
                    {getTypeLabel(branch.type)}
                  </div>
                </div>
              </div>
              {canManageBranches && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg h-8 w-8 p-0"
                    onClick={() => openEditBranchDialog(branch)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg h-8 w-8 p-0"
                    onClick={() => handleDeleteBranch(branch.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-3 w-3" />
                {branch.address}
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="h-3 w-3" />
                {branch.phone}
              </div>
              {branch.manager_name && (
                <div className="flex items-center gap-2 text-white/80">
                  <User className="h-3 w-3" />
                  {branch.manager_name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 桌面版表格視圖
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                營業處
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4" />
                類型
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                地址
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                電話
              </div>
            </th>
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                負責人
              </div>
            </th>
            {canManageBranches && (
              <th className="text-left py-3 px-4 text-white/80 font-medium">操作</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredBranches.map((branch) => (
            <tr key={branch.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/70 rounded-lg">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{branch.name}</div>
                    <div className="text-sm text-white/70">{branch.code}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`inline-block px-3 py-1 rounded-lg text-sm ${getTypeColor(branch.type)}`}>
                  {getTypeLabel(branch.type)}
                </div>
              </td>
              <td className="py-3 px-4 text-white/80">{branch.address}</td>
              <td className="py-3 px-4 text-white/80">{branch.phone}</td>
              <td className="py-3 px-4 text-white/80">
                {branch.manager_name || '未設定'}
              </td>
              {canManageBranches && (
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg"
                      onClick={() => openEditBranchDialog(branch)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500/25 border-red-400/40 text-red-200 hover:bg-red-500/35 rounded-lg"
                      onClick={() => handleDeleteBranch(branch.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTable;
