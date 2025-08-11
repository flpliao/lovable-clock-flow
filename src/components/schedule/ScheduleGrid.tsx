import type { Employee } from '@/types/employee';
import { getChineseWeekday, getMonthDays, isWeekend } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import React from 'react';
import EmployeeWorkScheduleRows from './EmployeeWorkScheduleRows';

interface ScheduleGridProps {
  employees: Employee[];
  selectedMonth: string;
  isEditMode: boolean;
  onCellClick: (employeeName: string, day: number) => void;
  expandedEmployees: Set<string>;
  onEmployeeToggle: (employeeSlug: string) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  employees,
  selectedMonth,
  isEditMode,
  onCellClick,
  expandedEmployees,
  onEmployeeToggle,
}) => {
  const { daysInMonth } = getMonthDays(selectedMonth);

  // 如果沒有員工資料，顯示提示訊息
  if (employees.length === 0) {
    return (
      <div className="border border-white/20 rounded-2xl backdrop-blur-xl p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">暫無員工資料</h3>
        <p className="text-white/60">
          目前沒有符合篩選條件的員工，請調整篩選條件或確認資料載入狀態
        </p>
      </div>
    );
  }

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
            {employees.map(employee => (
              <EmployeeWorkScheduleRows
                key={employee.slug}
                employee={employee}
                selectedMonth={selectedMonth}
                isEditMode={isEditMode}
                daysInMonth={daysInMonth}
                expandedEmployees={expandedEmployees}
                onEmployeeToggle={onEmployeeToggle}
                onCellClick={onCellClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleGrid;
