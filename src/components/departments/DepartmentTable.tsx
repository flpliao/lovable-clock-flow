
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
import { Edit2, Trash2, Building, Store } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useDepartmentManagementContext } from './DepartmentManagementContext';
import { Badge } from '@/components/ui/badge';

const DepartmentTable = () => {
  const { isAdmin } = useUser();
  const { filteredDepartments, openEditDialog, handleDeleteDepartment } = useDepartmentManagementContext();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名稱</TableHead>
          <TableHead>類型</TableHead>
          <TableHead>地點</TableHead>
          <TableHead>負責人</TableHead>
          <TableHead>聯絡方式</TableHead>
          <TableHead>人數</TableHead>
          {isAdmin() && <TableHead className="text-right">操作</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDepartments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin() ? 7 : 6} className="h-24 text-center">
              目前沒有部門/門市資料
            </TableCell>
          </TableRow>
        ) : (
          filteredDepartments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell>
                <Badge className={department.type === 'department' ? 'bg-blue-500' : 'bg-emerald-500'}>
                  {department.type === 'department' ? (
                    <><Building className="h-3 w-3 mr-1" /> 部門</>
                  ) : (
                    <><Store className="h-3 w-3 mr-1" /> 門市</>
                  )}
                </Badge>
              </TableCell>
              <TableCell>{department.location || '未設定'}</TableCell>
              <TableCell>{department.managerName || '未指派'}</TableCell>
              <TableCell>{department.managerContact || '未設定'}</TableCell>
              <TableCell>{department.staffCount} 人</TableCell>
              {isAdmin() && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(department)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DepartmentTable;
