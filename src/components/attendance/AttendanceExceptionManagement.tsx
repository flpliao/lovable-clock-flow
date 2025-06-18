
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getExceptionTypeText, getExceptionStatusText, getExceptionStatusColor } from '@/utils/attendanceExceptionUtils';
import { useStaffManagementSafe } from '@/components/company/hooks/useStaffManagementSafe';

const AttendanceExceptionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 使用真實的員工資料
  const { staffList } = useStaffManagementSafe();

  // 模擬異常資料，但使用真實員工資料
  const exceptions = staffList.length > 0 ? [
    {
      id: '1',
      staff_id: staffList[0]?.id || '',
      staff_name: staffList[0]?.name || '張小明',
      staff_department: staffList[0]?.department || 'IT部',
      staff_position: staffList[0]?.position || '工程師',
      exception_date: '2024-01-15',
      exception_type: 'missing_check_in' as const,
      reason: '忘記打卡',
      status: 'pending' as const,
      created_at: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      staff_id: staffList[1]?.id || '',
      staff_name: staffList[1]?.name || '李小華',
      staff_department: staffList[1]?.department || 'HR部',
      staff_position: staffList[1]?.position || '人事專員',
      exception_date: '2024-01-14',
      exception_type: 'late_check_in' as const,
      reason: '交通堵塞',
      status: 'approved' as const,
      created_at: '2024-01-14T10:30:00Z'
    }
  ] : [];

  const filteredExceptions = exceptions.filter(exception => {
    const matchesSearch = exception.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exception.staff_department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter;
    const matchesType = typeFilter === 'all' || exception.exception_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center">
          <Clock className="h-5 w-5 mr-3 text-white" />
          打卡異常處理
        </h2>
        <Button className="bg-blue-500/90 hover:bg-blue-600/90 text-white shadow-lg backdrop-blur-xl border border-blue-400/50">
          <Plus className="h-4 w-4 mr-2" />
          新增異常
        </Button>
      </div>

      {/* 搜尋和篩選區域 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <Input
              placeholder="搜尋員工姓名、部門或原因..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/40 text-gray-900 placeholder:text-gray-600"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/50 border-white/40 text-gray-900">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="狀態篩選" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="pending">待審核</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="rejected">已拒絕</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white/50 border-white/40 text-gray-900">
                <SelectValue placeholder="類型篩選" />
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
      </div>

      {/* 異常記錄列表 */}
      <div className="space-y-4">
        {filteredExceptions.map((exception) => (
          <div key={exception.id} className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{exception.staff_name}</h3>
                    <Badge className={`${getExceptionStatusColor(exception.status)} shadow-md`}>
                      {getExceptionStatusText(exception.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700 font-medium">部門職位:</span>
                      <p className="text-gray-900 mt-1">{exception.staff_department} - {exception.staff_position}</p>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">異常類型:</span>
                      <p className="text-gray-900 mt-1">{getExceptionTypeText(exception.exception_type)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-700 font-medium">異常日期:</span>
                  <p className="text-gray-900 font-medium mt-1">{exception.exception_date}</p>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">申請時間:</span>
                  <p className="text-gray-900 mt-1">{new Date(exception.created_at).toLocaleString('zh-TW')}</p>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <span className="text-gray-700 font-medium">異常原因:</span>
                <p className="text-gray-900 mt-2 bg-white/30 rounded-lg p-3">{exception.reason}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" className="bg-white/50 border-white/60 text-gray-900 hover:bg-white/70">
                  查看詳情
                </Button>
                {exception.status === 'pending' && (
                  <>
                    <Button className="bg-green-500/90 hover:bg-green-600/90 text-white shadow-md">
                      核准申請
                    </Button>
                    <Button variant="outline" className="bg-red-500/20 border-red-500/50 text-red-700 hover:bg-red-500/30">
                      拒絕申請
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredExceptions.length === 0 && (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {staffList.length === 0 ? '尚未載入員工資料' : '沒有找到相關的異常記錄'}
              </h3>
              <p className="text-gray-700">
                {staffList.length === 0 ? '請稍候系統載入員工資料' : '請嘗試調整搜尋條件或篩選器'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceExceptionManagement;
