
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { TimeSlot } from '@/services/timeSlotService';
import { TimeSlotIcon } from '../schedule/utils/timeSlotIcons';

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
          <TableHead>圖示</TableHead>
          <TableHead>名稱</TableHead>
          <TableHead>開始時間</TableHead>
          <TableHead>結束時間</TableHead>
          <TableHead className="hidden sm:table-cell">需要打卡</TableHead>
          <TableHead className="hidden sm:table-cell">狀態</TableHead>
          <TableHead className="hidden sm:table-cell">排序</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeSlots.map((timeSlot) => (
          <TableRow key={timeSlot.id}>
            <TableCell>
              <TimeSlotIcon 
                timeSlotName={timeSlot.name} 
                size="md"
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col">
                <span className="text-sm sm:text-base">{timeSlot.name}</span>
                <span className="text-xs text-gray-500 sm:hidden">
                  {timeSlot.start_time} - {timeSlot.end_time}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{timeSlot.start_time}</TableCell>
            <TableCell className="hidden sm:table-cell">{timeSlot.end_time}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant={timeSlot.requires_checkin ? 'default' : 'secondary'}>
                {timeSlot.requires_checkin ? '需要' : '不需要'}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant={timeSlot.is_active ? 'default' : 'destructive'}>
                {timeSlot.is_active ? '啟用' : '停用'}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{timeSlot.sort_order}</TableCell>
            <TableCell>
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(timeSlot)}
                  className="p-1 sm:p-2"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(timeSlot.id)}
                  className="text-red-600 hover:text-red-700 p-1 sm:p-2"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
