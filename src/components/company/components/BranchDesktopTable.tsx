
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { Branch } from '@/types/company';
import { getBranchTypeLabel, getBranchTypeColor } from '../utils/branchTypeUtils';
import { BranchStaffDisplay } from './BranchStaffDisplay';

interface BranchDesktopTableProps {
  branches: Branch[];
  canManage: boolean;
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

export const BranchDesktopTable: React.FC<BranchDesktopTableProps> = ({
  branches,
  canManage,
  onEdit,
  onDelete
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
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
              {canManage && <TableHead>操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                    {branch.name}
                  </div>
                </TableCell>
                <TableCell>{branch.code}</TableCell>
                <TableCell>
                  <Badge className={getBranchTypeColor(branch.type)}>
                    {getBranchTypeLabel(branch.type)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={branch.address}>
                  {branch.address}
                </TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>
                  <BranchStaffDisplay branchId={branch.id} />
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
                {canManage && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(branch)}
                        className="flex items-center"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        編輯
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 flex items-center"
                        onClick={() => onDelete(branch.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        刪除
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
  );
};
