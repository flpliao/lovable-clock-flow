import type { EmployeeWithWorkSchedules } from '@/types/employee';
import { getChineseWeekday, getMonthDays, isWeekend } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EmployeeWorkScheduleRows from './EmployeeWorkScheduleRows';

interface ScheduleGridProps {
  employees: EmployeeWithWorkSchedules[];
  selectedMonth: string;
  isEditMode: boolean;
  onCellClick: (employeeName: string, day: number) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  employees,
  selectedMonth,
  isEditMode,
  onCellClick,
}) => {
  // 內部狀態：展開的員工
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(new Set());

  // 處理員工展開/收合
  const handleEmployeeToggle = (employeeSlug: string) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeSlug)) {
      newExpanded.delete(employeeSlug);
    } else {
      newExpanded.add(employeeSlug);
    }
    setExpandedEmployees(newExpanded);
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
            {employees.map(employee => (
              <EmployeeWorkScheduleRows
                key={employee.slug}
                employee={employee}
                selectedMonth={selectedMonth}
                isEditMode={isEditMode}
                daysInMonth={daysInMonth}
                expandedEmployees={expandedEmployees}
                onEmployeeToggle={handleEmployeeToggle}
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
