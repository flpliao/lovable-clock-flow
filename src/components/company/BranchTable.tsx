
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';

const BranchTable = () => {
  const { filteredBranches, openEditBranchDialog, handleDeleteBranch } = useCompanyManagementContext();
  const { isAdmin } = useUser();

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

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'headquarters':
        return 'default';
      case 'branch':
        return 'secondary';
      case 'store':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (filteredBranches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>目前沒有營業處資料</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>營業處名稱</TableHead>
            <TableHead>代碼</TableHead>
            <TableHead>類型</TableHead>
            <TableHead>地址</TableHead>
            <TableHead>負責人</TableHead>
            <TableHead>員工數</TableHead>
            <TableHead>狀態</TableHead>
            {isAdmin() && <TableHead className="text-right">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBranches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell>{branch.code}</TableCell>
              <TableCell>
                <Badge variant={getTypeBadgeVariant(branch.type)}>
                  {getTypeLabel(branch.type)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{branch.address}</TableCell>
              <TableCell>{branch.manager_name || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {branch.staff_count}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                  {branch.is_active ? '營運中' : '停用'}
                </Badge>
              </TableCell>
              {isAdmin() && (
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditBranchDialog(branch)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBranch(branch.id)}
                      disabled={branch.staff_count > 0}
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
  );
};

export default BranchTable;
