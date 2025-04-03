
import React from 'react';
import { getUserCheckInRecords, CheckInRecord } from './LocationCheckIn';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CheckInHistoryProps {
  userId: string;
  limit?: number;
}

const CheckInHistory: React.FC<CheckInHistoryProps> = ({ userId, limit }) => {
  const records = getUserCheckInRecords(userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const displayRecords = limit ? records.slice(0, limit) : records;

  if (displayRecords.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        尚無打卡記錄
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日期</TableHead>
          <TableHead>時間</TableHead>
          <TableHead>打卡方式</TableHead>
          <TableHead>位置/網路</TableHead>
          <TableHead>狀態</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayRecords.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {new Date(record.timestamp).toLocaleDateString('zh-TW')}
            </TableCell>
            <TableCell>
              {new Date(record.timestamp).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                {record.type === 'location' ? (
                  <>
                    <MapPin className="h-3.5 w-3.5" />
                    <span>位置打卡</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-3.5 w-3.5" />
                    <span>IP打卡</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              {record.type === 'location' 
                ? `${record.details.locationName || '未知位置'} (${record.details.distance ? Math.round(record.details.distance) + 'm' : '未知距離'})`
                : record.details.locationName || record.details.ip || '未知網路'
              }
            </TableCell>
            <TableCell>
              {record.status === 'success' ? (
                <Badge className="bg-green-500">成功</Badge>
              ) : (
                <Badge className="bg-red-500">失敗</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CheckInHistory;
