import {
  Employee,
  EmployeeWorkSchedule,
  EmployeeWorkScheduleData,
  ScheduleShift,
} from '@/types/schedule';
import { formatTimeString } from '@/utils/dateTimeUtils';
import { getChineseWeekday, getMonthDays, isWeekend } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

// 模擬班次資料
const mockShifts: ScheduleShift[] = [
  { id: 2, name: '診所早班', color: '#10B981', code: 'MORNING' },
  { id: 3, name: '診所晚班', color: '#F59E0B', code: 'EVENING' },
  { id: 4, name: '請假', color: '#EF4444', code: 'LEAVE' },
];

interface ScheduleGridProps {
  employees: Employee[];
  employeeWorkScheduleData: EmployeeWorkScheduleData;
  selectedMonth: string;
  isEditMode: boolean;
  onCellClick: (employeeName: string, day: number) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  employees,
  employeeWorkScheduleData,
  selectedMonth,
  isEditMode,
  onCellClick,
}) => {
  // 內部狀態：展開的員工
  const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(new Set());

  // 處理員工展開/收合
  const handleEmployeeToggle = (employeeId: number) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  // 獲取員工某天的工作排程
  const getEmployeeWorkSchedule = (employeeName: string, day: number) => {
    return employeeWorkScheduleData[employeeName]?.[day];
  };

  // 獲取班次顏色
  const getShiftColor = (workScheduleId: number) => {
    const shift = mockShifts.find(s => s.id === workScheduleId);
    return shift?.color || '#6B7280';
  };

  // 獲取班次名稱
  const getShiftName = (workScheduleId: number) => {
    const shift = mockShifts.find(s => s.id === workScheduleId);
    return shift?.name || '未知班次';
  };

  // 獲取工作時間範圍
  const getWorkTimeRange = (workSchedule: EmployeeWorkSchedule | undefined) => {
    if (!workSchedule?.work_schedule) return '-';

    const { clock_in_time, clock_out_time } = workSchedule.work_schedule;
    if (!clock_in_time || !clock_out_time) return '-';

    const startTime = formatTimeString(clock_in_time);
    const endTime = formatTimeString(clock_out_time);

    return `${startTime}-${endTime}`;
  };

  const { daysInMonth } = getMonthDays(selectedMonth);

  return (
    <div className="border border-white/20 rounded-2xl backdrop-blur-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              <th className="px-4 py-3 text-white font-medium min-w-[150px]">
                <div className="flex justify-between items-center">
                  <span>員工</span>
                  <span>{dayjs(selectedMonth).format('M')} 月</span>
                </div>
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <th key={day} className="px-2 py-3 text-center text-white font-medium min-w-[40px]">
                  <div
                    className={`${isWeekend(selectedMonth, day) ? 'text-red-400' : 'text-white'}`}
                  >
                    {day}
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {getChineseWeekday(selectedMonth, day)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => {
              const isExpanded = expandedEmployees.has(employee.id);
              return (
                <React.Fragment key={employee.id}>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">
                      <div className="flex items-center justify-between">
                        <span>{employee.name}</span>
                        <button
                          onClick={() => handleEmployeeToggle(employee.id)}
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
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const isWeekendDay = isWeekend(selectedMonth, day);
                      const workSchedule = getEmployeeWorkSchedule(employee.name, day);

                      return (
                        <td
                          key={day}
                          className={`px-2 py-3 text-center min-w-[40px] ${
                            isWeekendDay ? 'bg-pink-500/10' : ''
                          } ${isEditMode ? 'cursor-pointer hover:bg-white/10' : ''}`}
                          onClick={() => onCellClick(employee.name, day)}
                        >
                          {workSchedule && (
                            <div
                              className="w-3 h-3 rounded-full mx-auto"
                              style={{
                                backgroundColor: getShiftColor(workSchedule.work_schedule_id),
                              }}
                              title={getShiftName(workSchedule.work_schedule_id)}
                            ></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {/* 展開的詳細資訊 */}
                  {isExpanded && (
                    <>
                      {/* 排班時間 */}
                      <tr className="bg-white/5 border-t border-white/10">
                        <td className="px-4 py-2 text-white text-sm font-medium text-right">
                          排班時間
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const workSchedule = getEmployeeWorkSchedule(employee.name, day);
                          return (
                            <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                              {workSchedule ? (
                                <div className="text-xs text-white/80">
                                  {getWorkTimeRange(workSchedule)}
                                </div>
                              ) : (
                                <div className="text-xs text-white/40">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {/* 班表狀態 */}
                      <tr className="bg-white/5 border-t border-white/10">
                        <td className="px-4 py-2 text-white text-sm font-medium text-right">
                          班表狀態
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const workSchedule = getEmployeeWorkSchedule(employee.name, day);
                          return (
                            <td key={day} className="px-2 py-2 text-center min-w-[40px]">
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
                      <tr className="bg-white/5 border-t border-white/10">
                        <td className="px-4 py-2 text-white text-sm font-medium text-right">
                          請假
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const workSchedule = getEmployeeWorkSchedule(employee.name, day);
                          return (
                            <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                              {workSchedule && workSchedule.status === '請假' ? (
                                <div className="text-xs text-red-400">請假</div>
                              ) : (
                                <div className="text-xs text-white/40">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {/* 加班 */}
                      <tr className="bg-white/5 border-t border-white/10">
                        <td className="px-4 py-2 text-white text-sm font-medium text-right">
                          加班
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const workSchedule = getEmployeeWorkSchedule(employee.name, day);
                          return (
                            <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                              {workSchedule && workSchedule.status === '加班' ? (
                                <div className="text-xs text-yellow-400">加班</div>
                              ) : (
                                <div className="text-xs text-white/40">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {/* 出差 */}
                      <tr className="bg-white/5 border-t border-white/10">
                        <td className="px-4 py-2 text-white text-sm font-medium text-right">
                          出差
                        </td>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const workSchedule = getEmployeeWorkSchedule(employee.name, day);
                          return (
                            <td key={day} className="px-2 py-2 text-center min-w-[40px]">
                              {workSchedule && workSchedule.status === '出差' ? (
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
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleGrid;
