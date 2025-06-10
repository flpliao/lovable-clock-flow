
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, Calendar, DollarSign, FileText, Timer } from 'lucide-react';
import { getOvertimeTypeText, getCompensationTypeText } from '@/utils/overtimeUtils';
import { getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';

const OvertimeHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 模擬當前用戶的加班記錄
  const overtimes = [
    {
      id: '1',
      overtime_date: '2024-01-15',
      start_time: '2024-01-15T18:00:00Z',
      end_time: '2024-01-15T21:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '專案趕工',
      status: 'approved' as const,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      overtime_date: '2024-01-14',
      start_time: '2024-01-14T09:00:00Z',
      end_time: '2024-01-14T17:00:00Z',
      hours: 8,
      overtime_type: 'weekend' as const,
      compensation_type: 'time_off' as const,
      reason: '系統維護',
      status: 'pending' as const,
      created_at: '2024-01-14T08:00:00Z'
    },
    {
      id: '3',
      overtime_date: '2024-01-10',
      start_time: '2024-01-10T19:00:00Z',
      end_time: '2024-01-10T22:00:00Z',
      hours: 3,
      overtime_type: 'weekday' as const,
      compensation_type: 'pay' as const,
      reason: '客戶需求變更',
      status: 'rejected' as const,
      created_at: '2024-01-10T15:00:00Z'
    }
  ];

  const filteredOvertimes = overtimes.filter(overtime => {
    const matchesSearch = overtime.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;
    const matchesType = typeFilter === 'all' || overtime.overtime_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* 搜尋和篩選卡片 */}
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
            <Search className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white drop-shadow-md">搜尋篩選</h3>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              placeholder="搜尋加班原因..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="pending">待審核</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="rejected">已拒絕</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
                <SelectValue placeholder="類型" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="all">全部類型</SelectItem>
                <SelectItem value="weekday">平日加班</SelectItem>
                <SelectItem value="weekend">假日加班</SelectItem>
                <SelectItem value="holiday">國定假日加班</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 加班記錄列表 */}
      <div className="space-y-4">
        {filteredOvertimes.map((overtime) => (
          <div key={overtime.id} className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/80 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/50">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <Badge className={`${getExceptionStatusColor(overtime.status)} text-sm px-3 py-1 rounded-full`}>
                      {getExceptionStatusText(overtime.status)}
                    </Badge>
                    <span className="text-white/80 text-sm font-medium">
                      {getOvertimeTypeText(overtime.overtime_type)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-white/70" />
                  <div>
                    <span className="text-white/70 text-sm">日期:</span>
                    <p className="font-medium text-white">{overtime.overtime_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Timer className="h-4 w-4 text-white/70" />
                  <div>
                    <span className="text-white/70 text-sm">時數:</span>
                    <p className="font-bold text-purple-200">{overtime.hours} 小時</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-white/70" />
                  <div>
                    <span className="text-white/70 text-sm">補償方式:</span>
                    <p className="font-medium text-white">{getCompensationTypeText(overtime.compensation_type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-white/70" />
                  <div>
                    <span className="text-white/70 text-sm">時間:</span>
                    <p className="font-medium text-white">
                      {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/20">
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-white/70 mt-1" />
                  <div className="flex-1">
                    <span className="text-white/70 text-sm">原因:</span>
                    <p className="mt-1 text-white">{overtime.reason}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-white/60 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                申請時間: {new Date(overtime.created_at).toLocaleString('zh-TW')}
              </div>
            </div>
          </div>
        ))}
        {filteredOvertimes.length === 0 && (
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
            <div className="text-center text-white/70">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg">沒有找到相關的加班記錄</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OvertimeHistory;
