
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ScheduleTableProps {
  selectedDate: Date;
  shifts: any[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => void;
  currentUser: any;
}

const ScheduleTable = ({
  selectedDate,
  shifts,
  getUserName,
  getUserRelation,
  canDeleteSchedule,
  onRemoveSchedule,
  currentUser,
}: ScheduleTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })} 排班表
          {shifts.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({shifts.length} 個班次)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shifts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>員工</TableHead>
                <TableHead>關係</TableHead>
                <TableHead>時間段</TableHead>
                <TableHead>開始時間</TableHead>
                <TableHead>結束時間</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{getUserName(shift.userId)}</TableCell>
                  <TableCell>
                    <Badge variant={shift.userId === currentUser?.id ? 'default' : 'secondary'}>
                      {getUserRelation(shift.userId)}
                    </Badge>
                  </TableCell>
                  <TableCell>{shift.timeSlot}</TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell>
                    {canDeleteSchedule(shift) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSchedule(shift.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">該日期沒有排班記錄</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleTable;
