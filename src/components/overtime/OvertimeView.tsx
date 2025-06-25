
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { queryOvertimeService } from '@/services/overtime/queryOvertimeService';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { OvertimeRecord, SupervisorHierarchyItem } from '@/services/overtime/types';

const OvertimeView: React.FC = () => {
  const { currentUser } = useUser();
  const [overtimes, setOvertimes] = useState<OvertimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOvertimes = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 載入加班申請...');
        
        const records = await queryOvertimeService.getOvertimeRequestsByCurrentUser(currentUser.id);
        
        // 只顯示待審核和最近的已處理申請
        const filteredRecords = records.filter(record => 
          record.status === 'pending' || 
          (record.status !== 'pending' && new Date(record.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        );
        
        // 確保資料結構正確，處理類型轉換
        const formattedRecords: OvertimeRecord[] = filteredRecords.map(record => ({
          ...record,
          staff: Array.isArray(record.staff) ? record.staff[0] : record.staff,
          supervisor_hierarchy: Array.isArray(record.supervisor_hierarchy) 
            ? record.supervisor_hierarchy as SupervisorHierarchyItem[]
            : [],
          overtime_approval_records: Array.isArray(record.overtime_approval_records) 
            ? record.overtime_approval_records.map(approvalRecord => ({
                ...approvalRecord,
                overtime_id: record.id // 使用 record.id 作為 overtime_id
              }))
            : []
        }));
        
        setOvertimes(formattedRecords);
        console.log('✅ 載入完成:', formattedRecords.length, '筆記錄');
      } catch (error) {
        console.error('❌ 載入加班申請失敗:', error);
        setOvertimes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOvertimes();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/80 text-white">待審核</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/80 text-white">已核准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/80 text-white">已拒絕</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500/80 text-white">已取消</Badge>;
      default:
        return <Badge className="bg-gray-500/80 text-white">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getOvertimeTypeText = (type: string) => {
    switch (type) {
      case 'weekday':
        return '平日加班';
      case 'weekend':
        return '假日加班';
      case 'holiday':
        return '國定假日加班';
      default:
        return type;
    }
  };

  const getCompensationTypeText = (type: string) => {
    switch (type) {
      case 'pay':
        return '加班費';
      case 'time_off':
        return '補休';
      case 'both':
        return '加班費+補休';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-center">
            <div className="text-white">載入中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 頁面標題 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">查看加班</h1>
            <p className="text-white/80 text-lg">查看您的加班申請狀態</p>
          </div>
        </div>
      </div>

      {/* 加班申請列表 */}
      <div className="space-y-4">
        {overtimes.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8 text-center">
            <Clock className="h-16 w-16 text-white/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">暫無加班申請</h3>
            <p className="text-white/80">您目前沒有任何加班申請記錄</p>
          </div>
        ) : (
          overtimes.map((overtime) => (
            <div key={overtime.id} className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6 hover:bg-white/25 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(overtime.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getOvertimeTypeText(overtime.overtime_type)}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {overtime.overtime_date} | {overtime.hours} 小時
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(overtime.status)}
                  <p className="text-white/60 text-xs mt-1">
                    {format(new Date(overtime.created_at), 'MM/dd HH:mm')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="text-white/70 text-sm block mb-1">時間範圍</span>
                  <div className="text-white text-sm">
                    {new Date(overtime.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(overtime.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <span className="text-white/70 text-sm block mb-1">補償方式</span>
                  <div className="text-white text-sm">
                    {getCompensationTypeText(overtime.compensation_type)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-white/70 text-sm block mb-2">申請原因</span>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white text-sm">{overtime.reason}</div>
                </div>
              </div>

              {/* 審核狀態 */}
              {overtime.status === 'approved' && overtime.approved_by_name && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm font-medium">已核准</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    核准人：{overtime.approved_by_name}
                  </p>
                  {overtime.approval_comment && (
                    <p className="text-green-100 text-sm mt-1">
                      備註：{overtime.approval_comment}
                    </p>
                  )}
                </div>
              )}

              {overtime.status === 'rejected' && overtime.rejection_reason && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-200 text-sm font-medium">已拒絕</span>
                  </div>
                  <p className="text-red-100 text-sm">
                    拒絕原因：{overtime.rejection_reason}
                  </p>
                </div>
              )}

              {overtime.status === 'pending' && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-200 text-sm">
                      申請已提交，正在等待主管審核中...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OvertimeView;
