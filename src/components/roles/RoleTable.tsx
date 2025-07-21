import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { deleteRole } from '@/hooks/useRole';
import { useIsAdmin } from '@/hooks/useStores';
import { Role } from '@/services/roleService';
import { Briefcase, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddRoleDialog from './AddRoleDialog';
import EditRoleDialog from './EditRoleDialog';

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
}

const RoleTable = ({ roles, loading, searchTerm = '', sortOrder = 'asc' }: RoleTableProps) => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const isAdmin = useIsAdmin();

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRole = async (id: string) => {
    const role = roles.find(r => r.id === id);
    if (!role) return;

    if (!confirm(`確定要刪除職位「${role.name}」嗎？`)) {
      return;
    }

    try {
      await deleteRole(id);
      toast({
        title: '刪除成功',
        description: `職位「${role.name}」已刪除`,
      });
    } catch (error) {
      console.error('❌ 刪除職位失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除職位，請稍後再試',
        variant: 'destructive',
      });
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRole(null);
  };

  // 在組件內部進行篩選和排序
  const filteredRoles = roles
    .filter(
      p =>
        searchTerm === '' ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a.name;
      const bValue = b.name;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-700">載入中...</p>
      </div>
    );
  }

  if (filteredRoles.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100/70 rounded-full">
            <Briefcase className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未建立職位資料</h3>
        <p className="text-gray-700 mb-4">開始建立您的職位架構，管理組織權限</p>
        <AddRoleDialog />
      </div>
    );
  }

  return (
    <>
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg overflow-hidden">
        {/* 添加水平滾動容器 */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-white/40 bg-white/20">
                  <TableHead className="text-gray-900 font-semibold py-4 px-6 min-w-[120px] whitespace-nowrap">
                    職位代碼
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold py-4 px-6 min-w-[120px] whitespace-nowrap">
                    職位名稱
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold py-4 px-6 hidden sm:table-cell min-w-[150px] whitespace-nowrap">
                    說明
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold py-4 px-6 text-center min-w-[80px] whitespace-nowrap">
                    系統角色
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="text-gray-900 font-semibold py-4 px-6 text-center min-w-[100px] whitespace-nowrap">
                      操作
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role, index) => (
                  <TableRow
                    key={role.id}
                    className={`border-white/30 hover:bg-white/40 transition-colors ${
                      index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'
                    }`}
                  >
                    <TableCell className="font-medium text-gray-900 py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100/70 rounded-lg flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-mono text-sm font-semibold truncate">{role.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold truncate">{role.name}</span>
                    </TableCell>
                    <TableCell className="text-gray-800 py-4 px-6 hidden sm:table-cell whitespace-nowrap">
                      <span
                        className="truncate block max-w-[150px]"
                        title={role.description || '無說明'}
                      >
                        {role.description || '無說明'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.is_system_role
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {role.is_system_role ? '是' : '否'}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="h-9 w-9 p-0 hover:bg-blue-100/70 text-blue-600 hover:text-blue-700 flex-shrink-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-red-100/70 text-red-600 hover:text-red-700 flex-shrink-0"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <EditRoleDialog
        role={editingRole}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
      />
    </>
  );
};

export default RoleTable;
