
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs text-gray-800 font-semibold">員工</TableHead>
            <TableHead className="text-xs text-gray-800 font-semibold">工時</TableHead>
            <TableHead className="text-xs text-gray-800 font-semibold">請假</TableHead>
            <TableHead className="text-xs text-gray-800 font-semibold">異常</TableHead>
            <TableHead className="text-xs text-gray-800 font-semibold">遲到</TableHead>
            <TableHead className="text-xs text-gray-800 font-semibold">狀態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="text-xs font-medium text-gray-900">{record.name}</TableCell>
              <TableCell className="text-xs text-gray-800">{record.workHours}h</TableCell>
              <TableCell className="text-xs text-gray-800">{record.leaveHours}h</TableCell>
              <TableCell className="text-xs text-gray-800">{record.abnormalCheckIns}</TableCell>
              <TableCell className="text-xs text-gray-800">{record.tardyCount}</TableCell>
              <TableCell>
                {record.abnormalCheckIns === 0 && record.tardyCount === 0 ? (
                  <Badge className="bg-green-500 text-xs px-1 py-0 text-white">正常</Badge>
                ) : record.abnormalCheckIns > 2 || record.tardyCount > 3 ? (
                  <Badge className="bg-red-500 text-xs px-1 py-0 text-white">需關注</Badge>
                ) : (
                  <Badge className="bg-yellow-500 text-xs px-1 py-0 text-white">輕微異常</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffAttendanceTable;
