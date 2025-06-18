
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface StaffAttendanceRecord {
  id: string;
  name: string;
  workHours: number;
  leaveHours: number;
  abnormalCheckIns: number;
  tardyCount: number;
}

interface StaffAttendanceTableProps {
  data: StaffAttendanceRecord[];
}

const StaffAttendanceTable: React.FC<StaffAttendanceTableProps> = ({ data }) => {
  return (
    <div className="w-full">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/20 bg-white/10">
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-6">員工</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4 text-center">工時</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4 text-center">請假</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4 text-center">異常</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4 text-center">遲到</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-6 text-center">狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((record) => (
              <TableRow 
                key={record.id} 
                className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
              >
                <TableCell className="text-sm font-semibold text-gray-900 py-4 px-6">
                  {record.name}
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4 px-4 text-center font-medium">
                  {record.workHours}h
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4 px-4 text-center font-medium">
                  {record.leaveHours}h
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4 px-4 text-center font-medium">
                  {record.abnormalCheckIns}
                </TableCell>
                <TableCell className="text-sm text-gray-800 py-4 px-4 text-center font-medium">
                  {record.tardyCount}
                </TableCell>
                <TableCell className="py-4 px-6 text-center">
                  {record.abnormalCheckIns === 0 && record.tardyCount === 0 ? (
                    <Badge className="bg-green-500/90 text-white text-xs px-3 py-1 font-medium border-0 shadow-md">
                      正常
                    </Badge>
                  ) : record.abnormalCheckIns > 2 || record.tardyCount > 3 ? (
                    <Badge className="bg-red-500/90 text-white text-xs px-3 py-1 font-medium border-0 shadow-md">
                      需關注
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/90 text-white text-xs px-3 py-1 font-medium border-0 shadow-md">
                      輕微異常
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffAttendanceTable;
