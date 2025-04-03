
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
import { Badge } from '@/components/ui/badge';

interface RoleTableProps {
  roles: StaffRole[];
  onEdit: (role: StaffRole) => void;
}

const RoleTable = ({ roles, onEdit }: RoleTableProps) => {
  const { deleteRole } = useStaffManagementContext();
  
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
          roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {role.is_system_role && <Lock className="h-3.5 w-3.5 mr-2 text-blue-500" />}
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
                {role.is_system_role ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    系統預設
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    自訂角色
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(role)}
                  disabled={role.is_system_role}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRole(role.id)}
                  disabled={role.is_system_role}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RoleTable;
