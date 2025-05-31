
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Briefcase } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';
import { useUser } from '@/contexts/UserContext';

const PositionTable = () => {
  const { 
    filteredPositions, 
    openEditDialog, 
    handleDeletePosition 
  } = usePositionManagementContext();
  
  const { isAdmin } = useUser();

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'bg-purple-100 text-purple-800';
    if (level >= 5) return 'bg-blue-100 text-blue-800';
    if (level >= 3) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="rounded-md border overflow-hidden">
      {filteredPositions.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-6">
                <TableHead className="text-xs font-medium py-1 px-2">職位名稱</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2">職級</TableHead>
                <TableHead className="text-xs font-medium py-1 px-2 hidden sm:table-cell">說明</TableHead>
                {isAdmin() && <TableHead className="text-xs font-medium py-1 px-2">操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id} className="h-7">
                  <TableCell className="font-medium text-xs py-1 px-2">
                    <div className="flex items-center">
                      <Briefcase className="h-3 w-3 mr-1 text-gray-500" />
                      {position.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-2">
                    <Badge className={`text-xs px-1 py-0 ${getLevelColor(position.level)}`}>
                      Level {position.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs py-1 px-2 hidden sm:table-cell">
                    {position.description || '無說明'}
                  </TableCell>
                  {isAdmin() && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(position)}
                          className="h-5 px-1 text-xs"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 h-5 px-1 text-xs"
                          onClick={() => handleDeletePosition(position.id)}
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
          <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-muted-foreground text-sm">尚未建立職位資料</p>
        </div>
      )}
    </div>
  );
};

export default PositionTable;
