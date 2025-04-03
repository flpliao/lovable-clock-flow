
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useStaffManagement } from '@/components/staff/useStaffManagement';
import { useUser } from '@/contexts/UserContext';
import CredentialManagementDialog from './CredentialManagementDialog';

const StaffTable: React.FC = () => {
  const { 
    filteredStaffList, 
    openEditDialog, 
    handleDeleteStaff,
    getSupervisorName
  } = useStaffManagement();
  
  const { isAdmin, currentUser } = useUser();
  
  return (
    <div className="rounded-md border overflow-hidden">
      {filteredStaffList.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>職位</TableHead>
                <TableHead>部門</TableHead>
                <TableHead>上級主管</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{getSupervisorName(staff.supervisor_id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(staff)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        編輯
                      </Button>
                      
                      {/* 新增帳號管理按鈕 */}
                      <CredentialManagementDialog staff={staff} />
                      
                      {isAdmin() && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          刪除
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">沒有員工資料</p>
        </div>
      )}
    </div>
  );
};

export default StaffTable;
