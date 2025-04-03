
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/contexts/UserContext';
import { CheckInRecord } from '@/types';
// Import from utils/checkInUtils instead of LocationCheckIn
import { getUserCheckInRecords, formatDate, formatTime } from '@/utils/checkInUtils';

const CheckInHistory: React.FC = () => {
  const { currentUser } = useUser();
  const userId = currentUser?.id || '';
  
  // Get the user's check-in records
  const checkInRecords = getUserCheckInRecords(userId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>打卡記錄</CardTitle>
      </CardHeader>
      <CardContent>
        {checkInRecords.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            沒有找到任何打卡記錄
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>時間</TableHead>
                <TableHead>類型</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>詳情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkInRecords.map((record: CheckInRecord) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.timestamp)}</TableCell>
                  <TableCell>{formatTime(record.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {record.type === 'location' ? (
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Wifi className="h-3.5 w-3.5 mr-1" />
                      )}
                      <span>
                        {record.type === 'location' ? '位置打卡' : 'IP打卡'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.status === 'success' ? (
                      <Badge className="bg-green-500">成功</Badge>
                    ) : (
                      <Badge className="bg-red-500">失敗</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.type === 'location' ? (
                      <span>
                        {record.details.locationName} 
                        {record.details.distance && ` (${Math.round(record.details.distance)}公尺)`}
                      </span>
                    ) : (
                      <span>IP: {record.details.ip}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckInHistory;
