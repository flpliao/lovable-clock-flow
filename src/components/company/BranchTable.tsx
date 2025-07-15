import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { branchService } from '@/services/branchService';
import { useBranchStore } from '@/stores/branchStore';
import { Branch } from '@/types/company';
import { Building, Edit, MapPin, Phone, Trash2, User } from 'lucide-react';

interface BranchTableProps {
  onEdit: (branch: Branch) => void;
  loading: boolean;
}

const BranchTable = ({ onEdit, loading }: BranchTableProps) => {
  const { branches, removeBranch } = useBranchStore();
  const isMobile = useIsMobile();

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm('確定要刪除此單位嗎？')) {
      try {
        await branchService.deleteBranch(id);
        removeBranch(id);
      } catch (error) {
        console.error('刪除單位失敗:', error);
      }
    }
  };

  const handleEdit = (branch: Branch) => {
    onEdit(branch);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/70">正在載入單位資料...</p>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 mx-auto text-white/50 mb-4" />
        <p className="text-white/70">尚未建立單位資料</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {branches.map(branch => (
          <div key={branch.id} className="border border-white/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-white" />
                <span className="text-white font-medium">{branch.name}</span>
              </div>
              <span className="text-white/70 text-sm">{branch.code}</span>
            </div>
            <div className="space-y-1 text-sm text-white/80">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>{branch.manager_name || '未設定'}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(branch)}
                className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Edit className="h-3 w-3 mr-1" />
                編輯
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteBranch(branch.id)}
                className="flex-1 bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                刪除
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-3 px-4 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                單位
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
            <th className="text-right py-3 px-4 text-white/80 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr
              key={branch.id}
              className="border-b border-white/10 hover:bg-white/10 transition-colors"
            >
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
              <td className="py-3 px-4 text-white/80">{branch.address}</td>
              <td className="py-3 px-4 text-white/80">{branch.phone}</td>
              <td className="py-3 px-4 text-white/80">{branch.manager_name || '未設定'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/25 border-white/40 text-white hover:bg-white/35 rounded-lg"
                    onClick={() => handleEdit(branch)}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTable;
