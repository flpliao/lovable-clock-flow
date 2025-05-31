
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, UserCog } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import CredentialManagementDialog from './CredentialManagementDialog';

const StaffTable: React.FC = () => {
  const { 
    filteredStaffList, 
    openEditDialog, 
    handleDeleteStaff,
    getSupervisorName
  } = useStaffManagementContext();
  
  const { isAdmin, currentUser } = useUser();
  
  return (
    <div className="rounded-md border overflow-hidden">
      {filteredStaffList.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="text-xs font-medium">姓名</TableHead>
                <TableHead className="text-xs font-medium">職位</TableHead>
                <TableHead className="text-xs font-medium">部門</TableHead>
                <TableHead className="text-xs font-medium">營業處</TableHead>
                <TableHead className="text-xs font-medium">主管</TableHead>
                <TableHead className="text-xs font-medium">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaffList.map((staff) => (
                <TableRow key={staff.id} className="h-10">
                  <TableCell className="font-medium text-sm py-1">{staff.name}</TableCell>
                  <TableCell className="text-sm py-1">{staff.position}</TableCell>
                  <TableCell className="text-sm py-1">{staff.department}</TableCell>
                  <TableCell className="py-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                      {staff.branch_name || '未設定'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm py-1">{getSupervisorName(staff.supervisor_id)}</TableCell>
                  <TableCell className="py-1">
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(staff)}
                        className="h-7 px-2 text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        編輯
                      </Button>
                      
                      <CredentialManagementDialog staff={staff}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          <UserCog className="h-3 w-3 mr-1" />
                          帳號
                        </Button>
                      </CredentialManagementDialog>
                      
                      {isAdmin() && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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
        <div className="p-4 text-center">
          <p className="text-muted-foreground text-sm">沒有員工資料</p>
        </div>
      )}
    </div>
  );
};

export default StaffTable;
