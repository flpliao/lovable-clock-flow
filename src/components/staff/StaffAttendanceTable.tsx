
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>員工姓名</TableHead>
          <TableHead>工時</TableHead>
          <TableHead>請假時數</TableHead>
          <TableHead>異常打卡</TableHead>
          <TableHead>遲到次數</TableHead>
          <TableHead>狀態</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-medium">{record.name}</TableCell>
            <TableCell>{record.workHours}小時</TableCell>
            <TableCell>{record.leaveHours}小時</TableCell>
            <TableCell>{record.abnormalCheckIns}次</TableCell>
            <TableCell>{record.tardyCount}次</TableCell>
            <TableCell>
              {record.abnormalCheckIns === 0 && record.tardyCount === 0 ? (
                <Badge className="bg-green-500">正常</Badge>
              ) : record.abnormalCheckIns > 2 || record.tardyCount > 3 ? (
                <Badge className="bg-red-500">需關注</Badge>
              ) : (
                <Badge className="bg-yellow-500">輕微異常</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StaffAttendanceTable;
