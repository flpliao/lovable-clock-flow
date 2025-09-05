import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employee } from '@/types/employee';
import { Edit, Key, Trash2 } from 'lucide-react';
import React from 'react';

interface EmployeeListProps {
  employeeList: Employee[];
  loading: boolean;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onChangePassword: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employeeList,
  loading,
  onEditEmployee,
  onDeleteEmployee,
  onChangePassword,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (employeeList.length === 0) {
    return (
      <div className="bg-white/60 rounded-lg border border-white/40 p-8 text-center">
        <div className="text-gray-500">暫無員工資料</div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 rounded-lg border border-white/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>單位</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>職位</TableHead>
            <TableHead>角色</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeList.map(employee => (
            <TableRow key={employee.slug}>
              <TableCell className="font-medium">{employee.name || '未設定姓名'}</TableCell>
              <TableCell>{employee.department?.name || '未設定'}</TableCell>
              <TableCell>{employee.email || '未設定'}</TableCell>
              <TableCell>{employee.position || '未設定'}</TableCell>
              <TableCell>{employee.roles?.map(role => role.name).join(', ') || '未設定'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditEmployee(employee)}
                    className="bg-white/60 border-white/40 hover:bg-white/80 text-gray-700"
                    title="編輯員工"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChangePassword(employee)}
                    className="bg-white/60 border-white/40 hover:bg-white/80 text-gray-700"
                    title="變更密碼"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteEmployee(employee)}
                    title="刪除員工"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
