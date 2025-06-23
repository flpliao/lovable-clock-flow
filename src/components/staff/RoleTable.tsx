
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
import { Edit2, Trash2, Shield } from 'lucide-react';
import { StaffRole } from './types';
import { useSupabaseRoleManagement } from './hooks/useSupabaseRoleManagement';
import { Badge } from '@/components/ui/badge';

interface RoleTableProps {
  roles: StaffRole[];
  onEdit: (role: StaffRole) => void;
}

const RoleTable = ({ roles, onEdit }: RoleTableProps) => {
  const { deleteRole } = useSupabaseRoleManagement();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white/90">角色名稱</TableHead>
          <TableHead className="text-white/90">描述</TableHead>
          <TableHead className="text-white/90">權限數量</TableHead>
          <TableHead className="text-white/90">類型</TableHead>
          <TableHead className="text-right text-white/90">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-white/80">
              尚未設定任何角色
            </TableCell>
          </TableRow>
        ) : (
          roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium text-white/90">
                <div className="flex items-center">
                  {role.is_system_role && <Shield className="h-3.5 w-3.5 mr-2 text-blue-400" />}
                  {role.name}
                </div>
              </TableCell>
              <TableCell className="text-white/80">{role.description}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-white/20 text-white/90">
                  {role.permissions.length} 個權限
                </Badge>
              </TableCell>
              <TableCell>
                {role.is_system_role ? (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                    系統預設
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                    自訂角色
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(role)}
                  className="text-white/80 hover:text-white hover:bg-white/20"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRole(role.id)}
                  disabled={role.is_system_role}
                  className="text-white/80 hover:text-white hover:bg-white/20 disabled:opacity-50"
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
