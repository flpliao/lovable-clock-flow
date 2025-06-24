
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>角色名稱</TableHead>
          <TableHead>描述</TableHead>
          <TableHead>權限數量</TableHead>
          <TableHead>類型</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              尚未設定任何角色
            </TableCell>
          </TableRow>
        ) : (
          roles.map((role) => {
            const roleType = getRoleType(role);
            
            return (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {role.is_system_role && <Shield className="h-3.5 w-3.5 mr-2 text-blue-500" />}
                    {role.name}
                  </div>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {role.permissions.length} 個權限
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleType.color}>
                    {roleType.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(role)}
                    title={role.is_system_role ? "編輯系統角色權限" : "編輯角色"}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRole(role.id)}
                    disabled={role.is_system_role && !isAdmin()}
                    title={role.is_system_role ? "系統管理員可刪除系統角色" : "刪除角色"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default RoleTable;
