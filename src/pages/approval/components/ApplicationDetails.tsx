
import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { MyApplication } from '@/types/myApplication';
import ApplicationStatusBadge from './ApplicationStatusBadge';

interface ApplicationDetailsProps {
  application: MyApplication;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application }) => {
  const renderApplicationDetails = (application: MyApplication) => {
    const { type, details } = application;
    
    console.log('🎨 渲染申請詳情:', { type, details, status: details.status });
    
    switch (type) {
      case 'overtime':
        const overtimeDate = details.overtime_date || '未知日期';
        const overtimeHours = details.hours || 0;
        const compensationType = details.compensation_type || 'unknown';
        const overtimeType = details.overtime_type || 'unknown';
        
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-white/70">加班日期</span>
                <div className="text-white font-medium">{overtimeDate}</div>
              </div>
              <div>
                <span className="text-white/70">加班時數</span>
                <div className="text-white font-medium">{overtimeHours} 小時</div>
              </div>
              <div>
                <span className="text-white/70">補償方式</span>
                <div className="text-white font-medium">
                  {compensationType === 'overtime_pay' ? '加班費' : 
                   compensationType === 'pay' ? '加班費' :
                   compensationType === 'time_off' ? '補休' : 
                   compensationType === 'both' ? '加班費+補休' : '未指定'}
                </div>
              </div>
              {details.start_time && details.end_time && (
                <div className="md:col-span-3">
                  <span className="text-white/70">加班時間</span>
                  <div className="text-white font-medium">
                    {details.start_time} ~ {details.end_time}
                  </div>
                </div>
              )}
              <div className="md:col-span-3">
                <span className="text-white/70">加班類型</span>
                <div className="text-white font-medium">
                  {overtimeType === 'weekday' ? '平日加班' :
                   overtimeType === 'weekend' ? '假日加班' :
                   overtimeType === 'holiday' ? '國定假日加班' : overtimeType}
                </div>
              </div>
            </div>
            
            {/* 審核記錄顯示 */}
            {details.overtime_approval_records && details.overtime_approval_records.length > 0 && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-white/80" />
                  <span className="text-white/70 text-sm font-medium">審核記錄</span>
                </div>
                <div className="space-y-2">
                  {details.overtime_approval_records.map((record: any, index: number) => (
                    <div key={record.id || index} className="flex items-center justify-between p-2 bg-white/5 rounded text-xs">
                      <div className="flex items-center gap-2">
                        <ApplicationStatusBadge status={record.status} />
                        <span className="text-white">
                          第{record.level}級 - {record.approver_name}
                        </span>
                      </div>
                      <div className="text-white/70">
                        {record.approval_date ? 
                          format(new Date(record.approval_date), 'MM/dd HH:mm') : 
                          '待審核'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {details.status === 'pending' && (
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-300" />
                  <span className="text-yellow-200 text-sm font-medium">此加班申請正在審核中</span>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'missed_checkin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">申請日期</span>
              <div className="text-white font-medium">{details.request_date}</div>
            </div>
            <div>
              <span className="text-white/70">申請類型</span>
              <div className="text-white font-medium">
                {details.missed_type === 'check_in' ? '忘記上班打卡' :
                 details.missed_type === 'check_out' ? '忘記下班打卡' : '忘記上下班打卡'}
              </div>
            </div>
          </div>
        );
      
      case 'leave':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/70">請假類型</span>
              <div className="text-white font-medium">{details.leave_type}</div>
            </div>
            <div>
              <span className="text-white/70">請假期間</span>
              <div className="text-white font-medium">
                {details.start_date} ~ {details.end_date}
              </div>
            </div>
            <div>
              <span className="text-white/70">請假時數</span>
              <div className="text-white font-medium">{details.hours} 小時</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderApplicationDetails(application);
};

export default ApplicationDetails;
