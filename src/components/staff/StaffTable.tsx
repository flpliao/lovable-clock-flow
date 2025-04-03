
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
import { Edit2, Trash2, Shield, UserRound } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { Badge } from '@/components/ui/badge';

const StaffTable = () => {
  const { isAdmin, canManageUser } = useUser();
  const { 
    filteredStaffList, 
    openEditDialog, 
    handleDeleteStaff, 
    getSupervisorName,
    roles,
    getRole 
  } = useStaffManagementContext();

  // Function to get role name display
  const getRoleDisplay = (staff: any) => {
    // If using new role_id reference
    if (staff.role_id) {
      const role = getRole(staff.role_id);
      if (role) {
        return role.name;
      }
    }
    
    // Fallback to legacy role
    if (staff.role === 'admin') {
      return '系統管理員';
    } else if (staff.role === 'user') {
      return '一般使用者';
    }
    
    // If custom role name stored in role property
    return staff.role;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>姓名</TableHead>
          <TableHead>職位</TableHead>
          <TableHead>部門</TableHead>
          <TableHead>上級主管</TableHead>
          <TableHead>聯絡電話</TableHead>
          {isAdmin() && <TableHead>角色</TableHead>}
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStaffList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin() ? 7 : 6} className="h-24 text-center">
              目前沒有人員資料
            </TableCell>
          </TableRow>
        ) : (
          filteredStaffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>{staff.department}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <UserRound className="h-3 w-3 mr-1 text-gray-400" />
                  {getSupervisorName(staff.supervisor_id)}
                </div>
              </TableCell>
              <TableCell>{staff.contact || '未設定'}</TableCell>
              {isAdmin() && (
                <TableCell>
                  <div className="flex items-center">
                    {(staff.role === 'admin' || staff.role_id === 'admin') && (
                      <Shield className="h-4 w-4 mr-1 text-blue-500" />
                    )}
                    <Badge variant="outline" className="font-normal">
                      {getRoleDisplay(staff)}
                    </Badge>
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
