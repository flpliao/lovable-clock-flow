
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

const OvertimeManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 模擬資料
  const overtimes = [
    {
      id: '1',
      staff_name: '王小強',
      overtime_date: '2024-01-15',
      start_time: '2024-01-15T18:00:00Z',
      end_time: '2024-01-15T21:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '專案趕工',
      status: 'pending' as const
    },
    {
      id: '2',
      staff_name: '陳小美',
      overtime_date: '2024-01-14',
      start_time: '2024-01-14T09:00:00Z',
      end_time: '2024-01-14T17:00:00Z',
      hours: 8,
      overtime_type: 'weekend' as const,
      compensation_type: 'time_off' as const,
      reason: '系統維護',
      status: 'approved' as const
    }
  ];

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-600" />
          加班管理
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增加班申請
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋員工姓名或原因..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="pending">待審核</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="rejected">已拒絕</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部類型</SelectItem>
                <SelectItem value="weekday">平日加班</SelectItem>
                <SelectItem value="weekend">假日加班</SelectItem>
                <SelectItem value="holiday">國定假日加班</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOvertimes.map((overtime) => (
              <div key={overtime.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{overtime.staff_name}</h3>
                      <Badge className={getExceptionStatusColor(overtime.status)}>
                        {getExceptionStatusText(overtime.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {getOvertimeTypeText(overtime.overtime_type)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="font-medium">日期:</span> {overtime.overtime_date}
                      </div>
                      <div>
                        <span className="font-medium">時數:</span> {overtime.hours} 小時
                      </div>
                      <div>
                        <span className="font-medium">補償方式:</span> {getCompensationTypeText(overtime.compensation_type)}
                      </div>
                      <div>
                        <span className="font-medium">時間:</span> 
                        {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      原因: {overtime.reason}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      查看詳情
                    </Button>
                    {overtime.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600">
                          核准
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          拒絕
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredOvertimes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                沒有找到相關的加班記錄
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OvertimeManagement;
