
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2 text-purple-600" />
          加班管理
        </h2>
        <Button size="sm" className="text-xs">
          <Plus className="h-3 w-3 mr-1" />
          新增
        </Button>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜尋員工姓名或原因..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
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
                <SelectTrigger className="h-9 text-xs">
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
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredOvertimes.map((overtime) => (
          <Card key={overtime.id}>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-sm">{overtime.staff_name}</h3>
                      <Badge className={`${getExceptionStatusColor(overtime.status)} text-xs`}>
                        {getExceptionStatusText(overtime.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {getOvertimeTypeText(overtime.overtime_type)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">日期:</span>
                    <p className="font-medium">{overtime.overtime_date}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">時數:</span>
                    <p className="font-bold text-purple-600">{overtime.hours} 小時</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">補償方式:</span>
                    <p className="font-medium">{getCompensationTypeText(overtime.compensation_type)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">時間:</span>
                    <p className="font-medium">
                      {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="pt-1 border-t border-gray-100">
                  <div className="text-xs">
                    <span className="text-gray-500">原因:</span>
                    <p className="mt-1">{overtime.reason}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    查看詳情
                  </Button>
                  {overtime.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 text-xs">
                        核准
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 text-xs">
                        拒絕
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredOvertimes.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500 text-sm">
                沒有找到相關的加班記錄
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OvertimeManagement;
