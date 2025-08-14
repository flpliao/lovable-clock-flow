import type { Employee } from '@/types/employee';
import type { WorkSchedule } from '@/types/workSchedule';
import { isWeekend } from '@/utils/dateUtils';
import { getWorkTimeRange } from '@/utils/scheduleUtils';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';

interface EmployeeWorkScheduleRowsProps {
  employee: Employee;
  selectedMonth: string;
  isEditMode: boolean;
  daysInMonth: number;
  expandedEmployees: Set<string>;
  onEmployeeToggle: (employeeSlug: string) => void;
  onCellClick: (employeeSlug: string, day: number) => void;
  onContextMenu: (event: React.MouseEvent, employee: Employee, workSchedule?: WorkSchedule) => void;
}

const EmployeeWorkScheduleRows: React.FC<EmployeeWorkScheduleRowsProps> = ({
  employee,
  selectedMonth,
  isEditMode,
  daysInMonth,
  expandedEmployees,
  onEmployeeToggle,
  onCellClick,
  onContextMenu,
}) => {
  const isExpanded = expandedEmployees.has(employee.slug);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 輔助函數：根據日期查找工作排程
  const getWorkScheduleByDay = (day: number) => {
    const dateStr = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
    return employee.work_schedules?.find(ws => ws.pivot?.date === dateStr);
  };

  return (
    <>
      {/* 主行 */}
      <tr key={`${employee.slug}-main`} className="border-t border-white/10 hover:bg-white/5">
        <td className="px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <span>{employee.name}</span>
            <button
              onClick={() => onEmployeeToggle(employee.slug)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-white/60" />
              ) : (
                <ChevronRight className="h-4 w-4 text-white/60" />
              )}
            </button>
          </div>
        </td>
        {days.map(day => {
          const isWeekendDay = isWeekend(selectedMonth, day);
          const workSchedule = getWorkScheduleByDay(day);
          const shift = workSchedule?.shift;

          return (
            <td
              key={`${employee.slug}-${day}`}
              className={`px-2 py-3 text-center min-w-[40px] ${
                isWeekendDay ? 'bg-pink-500/10' : ''
              } ${isEditMode ? 'cursor-pointer hover:bg-white/10' : ''}`}
              onClick={() => onCellClick(employee.slug, day)}
              onContextMenu={
                workSchedule && isEditMode
                  ? e => onContextMenu(e, employee, workSchedule)
                  : undefined
              }
            >
              {workSchedule && shift && (
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: shift.color || '#6B7280',
                    }}
                    title={shift.name || '未知班次'}
                  ></div>
                  {/* 如果 pivot 中有時間資料，表示這是修改過的排班，顯示一條線 */}
                  {(workSchedule.pivot?.clock_in_time || workSchedule.pivot?.clock_out_time) && (
                    <div className="w-4 h-0.5 bg-white/60 mt-1 rounded-full"></div>
                  )}
                </div>
              )}
            </td>
          );
        })}
      </tr>

      {/* 詳細資訊行 - 只在展開時顯示 */}
      {isExpanded && (
        <>
          {/* 排班時間 */}
          <tr key={`${employee.slug}-worktime`} className="bg-white/5 border-t border-white/10">
            <td className="px-4 py-2 text-white text-sm font-medium text-right">排班時間</td>
            {days.map(day => {
              const workSchedule = getWorkScheduleByDay(day);
              return (
                <td
                  key={`${employee.slug}-worktime-${day}`}
                  className="px-2 py-2 text-center min-w-[40px]"
                  onContextMenu={
                    workSchedule && isEditMode
                      ? e => onContextMenu(e, employee, workSchedule)
                      : undefined
                  }
                >
                  {workSchedule ? (
                    <div className="text-xs text-white/80">{getWorkTimeRange(workSchedule)}</div>
                  ) : (
                    <div className="text-xs text-white/40">-</div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* 班表狀態 */}
          <tr key={`${employee.slug}-status`} className="bg-white/5 border-t border-white/10">
            <td className="px-4 py-2 text-white text-sm font-medium text-right">班表狀態</td>
            {days.map(day => {
              const workSchedule = getWorkScheduleByDay(day);
              return (
                <td
                  key={`${employee.slug}-status-${day}`}
                  className="px-2 py-2 text-center min-w-[40px]"
                  onContextMenu={
                    workSchedule && isEditMode
                      ? e => onContextMenu(e, employee, workSchedule)
                      : undefined
                  }
                >
                  {workSchedule ? (
                    <div className="flex justify-center">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="text-xs text-white/40">-</div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* 請假 */}
          <tr key={`${employee.slug}-leave`} className="bg-white/5 border-t border-white/10">
            <td className="px-4 py-2 text-white text-sm font-medium text-right">請假</td>
            {days.map(day => {
              const workSchedule = getWorkScheduleByDay(day);
              return (
                <td
                  key={`${employee.slug}-leave-${day}`}
                  className="px-2 py-2 text-center min-w-[40px]"
                  onContextMenu={
                    workSchedule && isEditMode
                      ? e => onContextMenu(e, employee, workSchedule)
                      : undefined
                  }
                >
                  {workSchedule && workSchedule.pivot?.status === '請假' ? (
                    <div className="text-xs text-red-400">請假</div>
                  ) : (
                    <div className="text-xs text-white/40">-</div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* 加班 */}
          <tr key={`${employee.slug}-overtime`} className="bg-white/5 border-t border-white/10">
            <td className="px-4 py-2 text-white text-sm font-medium text-right">加班</td>
            {days.map(day => {
              const workSchedule = getWorkScheduleByDay(day);
              return (
                <td
                  key={`${employee.slug}-overtime-${day}`}
                  className="px-2 py-2 text-center min-w-[40px]"
                  onContextMenu={
                    workSchedule && isEditMode
                      ? e => onContextMenu(e, employee, workSchedule)
                      : undefined
                  }
                >
                  {workSchedule && workSchedule.pivot?.status === '加班' ? (
                    <div className="text-xs text-yellow-400">加班</div>
                  ) : (
                    <div className="text-xs text-white/40">-</div>
                  )}
                </td>
              );
            })}
          </tr>

          {/* 出差 */}
          <tr key={`${employee.slug}-trip`} className="bg-white/5 border-t border-white/10">
            <td className="px-4 py-2 text-white text-sm font-medium text-right">出差</td>
            {days.map(day => {
              const workSchedule = getWorkScheduleByDay(day);
              return (
                <td
                  key={`${employee.slug}-trip-${day}`}
                  className="px-2 py-2 text-center min-w-[40px]"
                  onContextMenu={
                    workSchedule && isEditMode
                      ? e => onContextMenu(e, employee, workSchedule)
                      : undefined
                  }
                >
                  {workSchedule && workSchedule.pivot?.status === '出差' ? (
                    <div className="text-xs text-blue-400">出差</div>
                  ) : (
                    <div className="text-xs text-white/40">-</div>
                  )}
                </td>
              );
            })}
          </tr>
        </>
      )}
    </>
  );
};

export default EmployeeWorkScheduleRows;
