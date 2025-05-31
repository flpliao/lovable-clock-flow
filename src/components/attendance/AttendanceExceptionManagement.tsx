
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getExceptionTypeText, getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

const AttendanceExceptionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 模擬資料，實際使用時會從 Supabase 獲取
  const exceptions = [
    {
      id: '1',
      staff_name: '張小明',
      exception_date: '2024-01-15',
      exception_type: 'missing_check_in' as const,
      reason: '忘記打卡',
      status: 'pending' as const,
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      staff_name: '李小華',
      exception_date: '2024-01-14',
      exception_type: 'late_check_in' as const,
      reason: '交通堵塞',
      status: 'approved' as const,
      created_at: '2024-01-14T10:30:00Z'
    }
  ];

  const filteredExceptions = exceptions.filter(exception => {
    const matchesSearch = exception.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter;
    const matchesType = typeFilter === 'all' || exception.exception_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          打卡異常處理
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
                  <SelectItem value="missing_check_in">漏打上班卡</SelectItem>
                  <SelectItem value="missing_check_out">漏打下班卡</SelectItem>
                  <SelectItem value="late_check_in">遲到</SelectItem>
                  <SelectItem value="early_check_out">早退</SelectItem>
                  <SelectItem value="manual_adjustment">人工調整</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredExceptions.map((exception) => (
          <Card key={exception.id}>
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-sm">{exception.staff_name}</h3>
                      <Badge className={`${getExceptionStatusColor(exception.status)} text-xs`}>
                        {getExceptionStatusText(exception.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {getExceptionTypeText(exception.exception_type)}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs">
                  <span className="text-gray-500">異常日期:</span>
                  <p className="font-medium mt-1">{exception.exception_date}</p>
                </div>
                
                <div className="pt-1 border-t border-gray-100">
                  <div className="text-xs">
                    <span className="text-gray-500">原因:</span>
                    <p className="mt-1">{exception.reason}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    查看詳情
                  </Button>
                  {exception.status === 'pending' && (
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
        {filteredExceptions.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500 text-sm">
                沒有找到相關的異常記錄
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttendanceExceptionManagement;
