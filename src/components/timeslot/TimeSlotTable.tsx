
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { TimeSlot } from '@/services/timeSlotService';

interface TimeSlotTableProps {
  timeSlots: TimeSlot[];
  loading: boolean;
  onEdit: (timeSlot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

const TimeSlotTable = ({ timeSlots, loading, onEdit, onDelete }: TimeSlotTableProps) => {
  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名稱</TableHead>
          <TableHead>開始時間</TableHead>
          <TableHead>結束時間</TableHead>
          <TableHead>需要打卡</TableHead>
          <TableHead>狀態</TableHead>
          <TableHead>排序</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeSlots.map((timeSlot) => (
          <TableRow key={timeSlot.id}>
            <TableCell className="font-medium">{timeSlot.name}</TableCell>
            <TableCell>{timeSlot.start_time}</TableCell>
            <TableCell>{timeSlot.end_time}</TableCell>
            <TableCell>
              <Badge variant={timeSlot.requires_checkin ? 'default' : 'secondary'}>
                {timeSlot.requires_checkin ? '需要' : '不需要'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={timeSlot.is_active ? 'default' : 'destructive'}>
                {timeSlot.is_active ? '啟用' : '停用'}
              </Badge>
            </TableCell>
            <TableCell>{timeSlot.sort_order}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(timeSlot)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(timeSlot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TimeSlotTable;
