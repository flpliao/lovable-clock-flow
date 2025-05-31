
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Building } from 'lucide-react';
import { useDepartmentManagement } from './useDepartmentManagement';
import { useUser } from '@/contexts/UserContext';

const DepartmentTable = () => {
  const { 
    filteredDepartments, 
    openEditDialog, 
    handleDeleteDepartment 
  } = useDepartmentManagement();
  
  const { isAdmin } = useUser();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'headquarters':
        return '總部';
      case 'branch':
        return '分部';
      case 'store':
        return '門市';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'headquarters':
        return 'bg-blue-100 text-blue-800';
      case 'branch':
        return 'bg-green-100 text-green-800';
      case 'store':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      {filteredDepartments.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-6">
                <TableHead className="text-xs font-medium py-1 px-2">部門</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2">類型</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2 hidden sm:table-cell">地點</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2 hidden md:table-cell">負責人</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2">人數</TableHead>
                {isAdmin() && <TableHead className="text-xs font-medium py-1 px-2">操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id} className="h-7">
                  <TableCell className="font-medium text-xs py-1 px-2">
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1 text-gray-500" />
                      {department.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Badge className={`text-xs px-1 py-0 ${getTypeColor(department.type)}`}>
                      {getTypeLabel(department.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs py-1 px-2 hidden sm:table-cell">
                    {department.location || '未設定'}
                  </TableCell>
                  <TableCell className="text-xs py-1 px-2 hidden md:table-cell">
                    {department.manager_name ? (
                      <div>
                        <div className="font-medium">{department.manager_name}</div>
                        {department.manager_contact && (
                          <div className="text-xs text-gray-500">{department.manager_contact}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">未設定</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs py-1 px-2">
                    <span className="font-medium">{department.staff_count || 0}</span>
                  </TableCell>
                  {isAdmin() && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(department)}
                          className="h-5 px-1 text-xs"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 h-5 px-1 text-xs"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-4 text-center">
          <Building className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-muted-foreground text-sm">尚未建立部門資料</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentTable;
