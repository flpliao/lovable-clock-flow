
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Briefcase } from 'lucide-react';
import { usePositionManagementContext } from './PositionManagementContext';
import { useUser } from '@/contexts/UserContext';
import AddPositionDialog from './AddPositionDialog';

const PositionTable = () => {
  const { 
    filteredPositions, 
    openEditDialog, 
    handleDeletePosition 
  } = usePositionManagementContext();
  
  const { isAdmin } = useUser();

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'bg-purple-100/70 text-purple-800 border-purple-200/50';
    if (level >= 5) return 'bg-blue-100/70 text-blue-800 border-blue-200/50';
    if (level >= 3) return 'bg-green-100/70 text-green-800 border-green-200/50';
    return 'bg-gray-100/70 text-gray-800 border-gray-200/50';
  };

  if (filteredPositions.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100/70 rounded-full">
            <Briefcase className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未建立職位資料</h3>
        <p className="text-gray-700 mb-4">開始建立您的職位架構，管理組織職級與權限</p>
        <AddPositionDialog />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/40 bg-white/20">
              <TableHead className="text-gray-900 font-semibold py-4 px-6">職位名稱</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6">職級</TableHead>
              <TableHead className="text-gray-900 font-semibold py-4 px-6 hidden sm:table-cell">說明</TableHead>
              {isAdmin() && <TableHead className="text-gray-900 font-semibold py-4 px-6 text-center">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPositions.map((position, index) => (
              <TableRow 
                key={position.id} 
                className={`border-white/30 hover:bg-white/40 transition-colors ${
                  index % 2 === 0 ? 'bg-white/10' : 'bg-white/5'
                }`}
              >
                <TableCell className="font-medium text-gray-900 py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100/70 rounded-lg">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-semibold">{position.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Badge className={`font-semibold px-3 py-1 ${getLevelColor(position.level)}`}>
                    Level {position.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-800 py-4 px-6 hidden sm:table-cell">
                  <span className="line-clamp-2">
                    {position.description || '無說明'}
                  </span>
                </TableCell>
                {isAdmin() && (
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(position)}
                        className="h-9 w-9 p-0 hover:bg-blue-100/70 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 hover:bg-red-100/70 text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePosition(position.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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

export default PositionTable;
