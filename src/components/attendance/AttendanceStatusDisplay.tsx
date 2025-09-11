/* eslint-disable react/prop-types */
import React, { memo, useMemo } from 'react';
import { AttendanceRecord } from '@/types/attendance';
import { attendanceStatusConfig } from '@/constants/attendanceStatus';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Moon,
} from 'lucide-react';

interface AttendanceStatusDisplayProps {
  record: AttendanceRecord | null;
  date: Date;
}

const AttendanceStatusDisplay: React.FC<AttendanceStatusDisplayProps> = memo(({ record, date }) => {
  // 優化：使用 useMemo 計算格式化的日期
  const formattedDate = useMemo(() => {
    return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhTW });
  }, [date]);

  // 優化：使用 useMemo 計算狀態配置
  const statusConfig = useMemo(() => {
    return (
      attendanceStatusConfig[record?.attendance_status || 'off'] || attendanceStatusConfig['off']
    );
  }, [record?.attendance_status]);

  // 優化：使用 useMemo 計算狀態圖標
  const statusIcon = useMemo(() => {
    const iconProps = { className: 'h-5 w-5' };

    switch (record?.attendance_status) {
      case 'scheduled':
        return <Calendar {...iconProps} />;
      case 'pending':
        return <Clock {...iconProps} />;
      case 'in_progress':
        return <PlayCircle {...iconProps} />;
      case 'normal':
        return <CheckCircle {...iconProps} />;
      case 'abnormal':
        return <AlertTriangle {...iconProps} />;
      case 'absent':
        return <XCircle {...iconProps} />;
      case 'incomplete':
        return <AlertCircle {...iconProps} />;
      case 'off':
        return <Moon {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  }, [record?.attendance_status]);

  if (!record) {
    return (
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{formattedDate}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>選擇日期查看詳細出勤資訊</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{formattedDate}</h3>

      {/* 狀態顯示 */}
      <div
        className="rounded-lg p-3 mb-4"
        style={{
          backgroundColor: statusConfig.bgColor,
          borderLeft: `4px solid ${statusConfig.borderColor}`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div style={{ color: statusConfig.color }}>{statusIcon}</div>
          <span className="font-medium" style={{ color: statusConfig.color }}>
            {statusConfig.text}
          </span>
        </div>
        <p className="text-sm text-gray-600">{statusConfig.description}</p>
      </div>

      {/* 班表資訊 */}
      {record.work_schedule && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-700">班表資訊</h4>
          <div className="text-sm text-gray-600">
            <p>班次: {record.work_schedule.shift.name}</p>
            <p>上班時間: {record.work_schedule.clock_in_time}</p>
            <p>下班時間: {record.work_schedule.clock_out_time}</p>
          </div>
        </div>
      )}

      {/* 打卡記錄 */}
      {(record.check_in_time || record.check_out_time) && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-gray-700">打卡記錄</h4>
          <div className="text-sm text-gray-600">
            {record.check_in_time && <p>上班打卡: {record.check_in_time}</p>}
            {record.check_out_time && <p>下班打卡: {record.check_out_time}</p>}
          </div>
        </div>
      )}

      {/* 工作時數 */}
      {record.work_hours > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">工作時數</h4>
          <div className="text-sm text-gray-600">
            <p>工作時數: {record.work_hours} 小時</p>
            {record.overtime_hours > 0 && <p>加班時數: {record.overtime_hours} 小時</p>}
          </div>
        </div>
      )}

      {/* 異常標記 */}
      {(record.is_late || record.is_early_leave) && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <div className="text-sm text-yellow-800">
            {record.is_late && <p>⚠️ 遲到</p>}
            {record.is_early_leave && <p>⚠️ 早退</p>}
          </div>
        </div>
      )}
    </div>
  );
});

AttendanceStatusDisplay.displayName = 'AttendanceStatusDisplay';

export default AttendanceStatusDisplay;
