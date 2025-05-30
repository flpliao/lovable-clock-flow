
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Building2 } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';

const BranchTable = () => {
  const { 
    filteredBranches,
    handleDeleteBranch,
    openEditBranchDialog
  } = useCompanyManagementContext();
  
  const { staffList } = useStaffManagementContext();
  const { currentUser } = useUser();

  // 允許廖俊雄和管理員進行編輯和刪除操作
  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  const getBranchStaffCount = (branchId: string) => {
    return staffList.filter(staff => staff.branch_id === branchId).length;
  };

  const getBranchStaffList = (branchId: string) => {
    return staffList.filter(staff => staff.branch_id === branchId);
  };

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
        return 'bg-blue-100 text-blue-800';
      case 'branch':
        return 'bg-green-100 text-green-800';
      case 'store':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      {filteredBranches.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>營業處名稱</TableHead>
                <TableHead>代碼</TableHead>
                <TableHead>類型</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>電話</TableHead>
                <TableHead>人員數量</TableHead>
                <TableHead>負責人</TableHead>
                <TableHead>狀態</TableHead>
                {canManageBranches && <TableHead>操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map((branch) => {
                const staffCount = getBranchStaffCount(branch.id);
                const branchStaff = getBranchStaffList(branch.id);
                
                return (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        {branch.name}
                      </div>
                    </TableCell>
                    <TableCell>{branch.code}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(branch.type)}>
                        {getTypeLabel(branch.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={branch.address}>
                      {branch.address}
                    </TableCell>
                    <TableCell>{branch.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{staffCount} 人</span>
                        {staffCount > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {branchStaff.slice(0, 2).map(staff => staff.name).join(', ')}
                            {staffCount > 2 && `等 ${staffCount} 人`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {branch.manager_name ? (
                        <div>
                          <div className="font-medium">{branch.manager_name}</div>
                          {branch.manager_contact && (
                            <div className="text-xs text-gray-500">{branch.manager_contact}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">未設定</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={branch.is_active ? "default" : "secondary"}>
                        {branch.is_active ? "營運中" : "暫停營運"}
                      </Badge>
                    </TableCell>
                    {canManageBranches && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditBranchDialog(branch)}
                            className="flex items-center"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            編輯
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 flex items-center"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            刪除
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground">尚未建立營業處資料</p>
          <p className="text-sm text-gray-400 mt-2">請新增營業處以開始管理組織架構</p>
        </div>
      )}
    </div>
  );
};

export default BranchTable;
