
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Shield, Lock } from 'lucide-react';
import { StaffRole } from './types';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

interface RoleTableProps {
  roles: StaffRole[];
  onEdit: (role: StaffRole) => void;
}

const RoleTable = ({ roles, onEdit }: RoleTableProps) => {
  const { deleteRole } = useStaffManagementContext();
  const { isAdmin } = useUser();
  
  // 根據權限數量判斷角色類型
  const getRoleType = (role: StaffRole) => {
    const permissionCount = role.permissions.length;
    
    if (role.is_system_role) {
      // 系統角色根據權限數量動態判斷
      if (permissionCount >= 20) {
        return { label: '系統管理', color: 'bg-red-50 text-red-700 hover:bg-red-50' };
      } else if (permissionCount >= 10) {
        return { label: '部門管理', color: 'bg-blue-50 text-blue-700 hover:bg-blue-50' };
      } else {
        return { label: '一般權限', color: 'bg-gray-50 text-gray-700 hover:bg-gray-50' };
      }
    } else {
      // 自訂角色根據權限數量判斷
      if (permissionCount >= 15) {
        return { label: '高級權限', color: 'bg-purple-50 text-purple-700 hover:bg-purple-50' };
      } else if (permissionCount >= 5) {
        return { label: '中級權限', color: 'bg-green-50 text-green-700 hover:bg-green-50' };
      } else {
        return { label: '基礎權限', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50' };
      }
    }
  };
  
  return (
    /* 添加水平滾動容器 */
    <div className="w-full overflow-x-auto">
      <div className="min-w-full rounded-lg border bg-white/70 backdrop-blur-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px] whitespace-nowrap">角色名稱</TableHead>
              <TableHead className="min-w-[150px] whitespace-nowrap">描述</TableHead>
              <TableHead className="min-w-[100px] whitespace-nowrap">權限數量</TableHead>
              <TableHead className="min-w-[100px] whitespace-nowrap">類型</TableHead>
              <TableHead className="min-w-[80px] whitespace-nowrap text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center whitespace-nowrap">
                  尚未設定任何角色
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => {
                const roleType = getRoleType(role);
                
                return (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <div className="flex items-center">
                        {role.is_system_role && <Shield className="h-3.5 w-3.5 mr-2 text-blue-500 flex-shrink-0" />}
                        <span className="truncate">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="truncate block max-w-[150px]" title={role.description}>
                        {role.description}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="secondary">
                        {role.permissions.length} 個權限
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className={roleType.color}>
                        {roleType.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(role)}
                          title={role.is_system_role ? "編輯系統角色權限" : "編輯角色"}
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRole(role.id)}
                          disabled={role.is_system_role && !isAdmin()}
                          title={role.is_system_role ? "系統管理員可刪除系統角色" : "刪除角色"}
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoleTable;
