
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
import { useUser } from '@/contexts/UserContext';
import { useStaffManagement } from './StaffManagementContext';

const StaffTable = () => {
  const { isAdmin, canManageUser } = useUser();
  const { filteredStaffList, openEditDialog, handleDeleteStaff } = useStaffManagement();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>姓名</TableHead>
          <TableHead>職位</TableHead>
          <TableHead>部門</TableHead>
          <TableHead>聯絡電話</TableHead>
          {isAdmin() && <TableHead>角色</TableHead>}
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStaffList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin() ? 6 : 5} className="h-24 text-center">
              目前沒有人員資料
            </TableCell>
          </TableRow>
        ) : (
          filteredStaffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>{staff.department}</TableCell>
              <TableCell>{staff.contact || '未設定'}</TableCell>
              {isAdmin() && (
                <TableCell>
                  <div className="flex items-center">
                    {staff.role === 'admin' && <Shield className="h-4 w-4 mr-1 text-blue-500" />}
                    {staff.role === 'admin' ? '管理員' : '一般使用者'}
                  </div>
                </TableCell>
              )}
              <TableCell className="text-right">
                {canManageUser(staff.id) && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(staff)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default StaffTable;
