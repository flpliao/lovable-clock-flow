
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, UserCog, Users } from 'lucide-react';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import CredentialManagementDialog from './CredentialManagementDialog';
import AddStaffDialog from './AddStaffDialog';

const StaffTable: React.FC = () => {
  const { 
    filteredStaffList, 
    openEditDialog, 
    handleDeleteStaff,
    getSupervisorName
  } = useStaffManagementContext();
  
  const { isAdmin, currentUser } = useUser();
  
  if (filteredStaffList.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未建立員工資料</h3>
          <p className="text-gray-600 mb-4">開始建立您的團隊，管理員工資訊與組織架構</p>
          <AddStaffDialog />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/30 bg-white/40">
              <TableHead className="text-gray-900 font-semibold py-4 px-6">姓名</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">職位</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">部門</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">營業處</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">主管</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6 text-center">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaffList.map((staff, index) => (
              <TableRow 
                key={staff.id} 
                className={`border-white/30 hover:bg-white/40 transition-colors ${
                  index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <TableCell className="font-medium text-gray-900 py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCog className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold">{staff.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-6 font-medium">{staff.position}</TableCell>
                <TableCell className="text-gray-700 py-4 px-6 font-medium">{staff.department}</TableCell>
                <TableCell className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {staff.branch_name || '未設定'}
                  </span>
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-6 font-medium">{getSupervisorName(staff.supervisor_id)}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(staff)}
                      className="h-9 w-9 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    <CredentialManagementDialog staff={staff}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-green-100 text-green-600 hover:text-green-700"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </CredentialManagementDialog>
                    
                    {isAdmin() && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-red-100 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default StaffTable;
