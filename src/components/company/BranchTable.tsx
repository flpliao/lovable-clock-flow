
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Building2, MapPin, Phone, User, Users } from 'lucide-react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

// 安全地使用 StaffManagementContext
const useStaffManagementContextSafely = () => {
  try {
    // 動態導入 context hook
    const { useStaffManagementContext } = require('@/contexts/StaffManagementContext');
    return useStaffManagementContext();
  } catch (error) {
    console.log('⚠️ BranchTable: StaffManagementContext 不可用，返回空數據');
    return { staffList: [] };
  }
};

const BranchTable = () => {
  const { 
    filteredBranches,
    handleDeleteBranch,
    openEditBranchDialog
  } = useCompanyManagementContext();
  
  const { currentUser } = useUser();
  const isMobile = useIsMobile();
  
  // 安全地獲取員工數據
  const { staffList } = useStaffManagementContextSafely();

  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  // 安全地取得營業處員工數量，避免 RLS 錯誤
  const getBranchStaffCount = (branchId: string) => {
    try {
      if (!staffList || !Array.isArray(staffList)) {
        return 0;
      }
      return staffList.filter(staff => staff.branch_id === branchId).length;
    } catch (error) {
      console.log('⚠️ BranchTable: 無法取得員工數量，可能是 RLS 限制:', error);
      return 0;
    }
  };

  const getBranchStaffList = (branchId: string) => {
    try {
      if (!staffList || !Array.isArray(staffList)) {
        return [];
      }
      return staffList.filter(staff => staff.branch_id === branchId);
    } catch (error) {
      console.log('⚠️ BranchTable: 無法取得員工列表，可能是 RLS 限制:', error);
      return [];
    }
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

  // 手機版卡片視圖
  if (isMobile) {
    return (
      <div className="space-y-2">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => {
            const staffCount = getBranchStaffCount(branch.id);
            const branchStaff = getBranchStaffList(branch.id);
            
            return (
              <Card key={branch.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* 標題列 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium text-sm">{branch.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge className={`text-xs ${getTypeColor(branch.type)}`}>
                          {getTypeLabel(branch.type)}
                        </Badge>
                        <Badge variant={branch.is_active ? "default" : "secondary"} className="text-xs">
                          {branch.is_active ? "營運中" : "暫停"}
                        </Badge>
                      </div>
                    </div>

                    {/* 代碼 */}
                    <div className="text-xs text-gray-600">
                      代碼: {branch.code}
                    </div>

                    {/* 地址 */}
                    <div className="flex items-start text-xs">
                      <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-gray-500" />
                      <span className="break-words">{branch.address}</span>
                    </div>

                    {/* 電話 */}
                    <div className="flex items-center text-xs">
                      <Phone className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
                      <span>{branch.phone}</span>
                    </div>

                    {/* 人員數量 */}
                    <div className="flex items-center text-xs">
                      <Users className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
                      <span className="font-medium">{staffCount} 人</span>
                      {staffCount > 0 && branchStaff.length > 0 && (
                        <span className="text-gray-500 ml-1">
                          ({branchStaff.slice(0, 2).map(staff => staff.name).join(', ')}
                          {staffCount > 2 && `等 ${staffCount} 人`})
                        </span>
                      )}
                    </div>

                    {/* 負責人 */}
                    {branch.manager_name && (
                      <div className="flex items-center text-xs">
                        <User className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
                        <div>
                          <span className="font-medium">{branch.manager_name}</span>
                          {branch.manager_contact && (
                            <span className="text-gray-500 ml-1">({branch.manager_contact})</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 操作按鈕 */}
                    {canManageBranches && (
                      <div className="flex gap-2 pt-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditBranchDialog(branch)}
                          className="flex-1 flex items-center justify-center text-xs h-7"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          編輯
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-500 hover:text-red-700 flex items-center justify-center text-xs h-7"
                          onClick={() => handleDeleteBranch(branch.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          刪除
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground text-sm">尚未建立營業處資料</p>
            <p className="text-xs text-gray-400 mt-2">請新增營業處以開始管理組織架構</p>
          </div>
        )}
      </div>
    );
  }

  // 桌面版表格視圖
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
                        {staffCount > 0 && branchStaff.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {branchStaff.slice(0, 2).map(staff => staff.name).join(', ')}
                            {staffCount > 2 && `等 ${staffCount} 人`}
                          </div>
                        )}
                        {staffCount === 0 && (
                          <span className="text-xs text-gray-400">尚無員工</span>
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
