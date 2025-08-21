import type { WorkSchedule } from '@/types/workSchedule';
import { getWorkTimeRange } from '@/utils/scheduleUtils';
import dayjs from 'dayjs';
import { Calendar, Clock, Edit, Trash2, User, X } from 'lucide-react';
import React from 'react';

interface ScheduleContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  employeeName?: string;
  workSchedule?: WorkSchedule;
}

const ScheduleContextMenu: React.FC<ScheduleContextMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onEdit,
  onDelete,
  employeeName,
  workSchedule,
}) => {
  if (!isVisible) return null;

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action();
    }
    onClose();
  };

  // 格式化日期顯示
  const formatDate = () => {
    if (!workSchedule?.pivot?.date)
      return {
        fullDate: '',
        chineseWeekday: '',
      };

    const date = dayjs(workSchedule.pivot.date);

    return {
      fullDate: date.format('YYYY年M月D日'),
      chineseWeekday: getChineseWeekday(date),
    };
  };

  const dateInfo = formatDate();

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 右鍵選單 */}
      <div
        className="fixed z-50 bg-white/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl min-w-[220px] py-2"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {/* 關閉按鈕 - 右上角 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }}
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>

        {/* 標題區域 */}
        <div className="px-4 py-2 border-b border-white/10 pr-8">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User className="h-4 w-4" />
            <span className="font-medium">{employeeName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Calendar className="h-3 w-3" />
            <span>{dateInfo.fullDate}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{dateInfo.chineseWeekday}</div>
        </div>

        {/* 班表資訊區域 */}
        {workSchedule && (
          <div className="px-4 py-2 border-b border-white/10 bg-gray-50/50">
            <div className="space-y-1">
              {workSchedule.shift && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: workSchedule.shift.color }}
                  />
                  <span className="text-xs text-gray-600">{workSchedule.shift.name}</span>
                </div>
              )}
              {workSchedule.clock_in_time && workSchedule.clock_out_time && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{getWorkTimeRange(workSchedule)}</span>
                </div>
              )}
              {workSchedule.pivot?.status && (
                <div className="text-xs text-gray-600">狀態: {workSchedule.pivot.status}</div>
              )}
            </div>
          </div>
        )}

        {/* 選單項目 */}
        <div className="py-1">
          {onEdit && (
            <button
              onClick={() => handleAction(onEdit)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              <Edit className="h-4 w-4" />
              編輯
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              刪除
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// 輔助函數：獲取中文星期
const getChineseWeekday = (date: dayjs.Dayjs): string => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${weekdays[date.day()]}`;
};

export default ScheduleContextMenu;
