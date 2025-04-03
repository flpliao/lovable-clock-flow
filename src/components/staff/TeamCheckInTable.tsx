
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Wifi } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TeamMemberCheckInData } from './hooks/useTeamCheckInData';

interface TeamCheckInTableProps {
  teamCheckInData: TeamMemberCheckInData[];
}

const TeamCheckInTable: React.FC<TeamCheckInTableProps> = ({ teamCheckInData }) => {
  if (teamCheckInData.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        沒有找到任何打卡記錄
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>員工姓名</TableHead>
          <TableHead>部門</TableHead>
          <TableHead>打卡次數</TableHead>
          <TableHead>成功率</TableHead>
          <TableHead>最近打卡</TableHead>
          <TableHead>狀態</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teamCheckInData.map(data => (
          <TableRow key={data.staff.id}>
            <TableCell className="font-medium">{data.staff.name}</TableCell>
            <TableCell>{data.staff.department}</TableCell>
            <TableCell>{data.totalRecords}</TableCell>
            <TableCell>
              {data.totalRecords === 0 
                ? '-' 
                : `${Math.round((data.successRecords / data.totalRecords) * 100)}%`
              }
            </TableCell>
            <TableCell>
              {data.latestRecord ? (
                <div className="flex items-center">
                  {data.latestRecord.type === 'location' ? (
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Wifi className="h-3.5 w-3.5 mr-1" />
                  )}
                  <span>
                    {format(new Date(data.latestRecord.timestamp), 'MM/dd HH:mm')}
                  </span>
                </div>
              ) : (
                '尚未打卡'
              )}
            </TableCell>
            <TableCell>
              {data.latestRecord ? (
                data.latestRecord.status === 'success' ? (
                  <Badge className="bg-green-500">正常</Badge>
                ) : (
                  <Badge className="bg-red-500">失敗</Badge>
                )
              ) : (
                <Badge className="bg-gray-400">無記錄</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamCheckInTable;
