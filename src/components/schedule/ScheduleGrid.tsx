import type { Employee } from '@/types/employee';
import type {
  EditScheduleFormData,
  ScheduleContextMenuState,
  ScheduleGridProps,
} from '@/types/schedule';
import type { WorkSchedule } from '@/types/workSchedule';
import { getChineseWeekday, getMonthDays, isWeekend } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EditScheduleForm from './EditScheduleForm';
import EmployeeWorkScheduleRows from './EmployeeWorkScheduleRows';
import ScheduleContextMenu from './ScheduleContextMenu';

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  employees,
  selectedMonth,
  isEditMode,
  setHasChanges,
  onCellClick,
  expandedEmployees,
  onEmployeeToggle,
  setEmployees,
}) => {
  const { daysInMonth } = getMonthDays(selectedMonth);

  // 右鍵選單狀態
  const [contextMenu, setContextMenu] = useState<ScheduleContextMenuState>({
    isVisible: false,
    x: 0,
    y: 0,
    employee: {} as Employee, // 初始化為空的 Employee 物件
    workSchedule: undefined,
  });

  // 編輯表單狀態
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // 處理右鍵點擊事件
  const handleContextMenu = (
    event: React.MouseEvent,
    employee: Employee,
    workSchedule?: WorkSchedule
  ) => {
    event.preventDefault();
    setContextMenu({
      isVisible: true,
      x: event.clientX,
      y: event.clientY,
      employee,
      workSchedule,
    });
  };

  // 關閉右鍵選單
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };

  // 處理選單動作
  const handleEditSchedule = () => {
    setIsEditFormOpen(true);
    closeContextMenu();
  };

  const handleDeleteSchedule = () => {
    if (!contextMenu.workSchedule?.pivot?.date || !contextMenu.employee) {
      console.error('無法刪除班表：缺少必要的資料');
      closeContextMenu();
      return;
    }

    const dateToDelete = contextMenu.workSchedule.pivot.date;
    const employeeSlug = contextMenu.employee.slug;

    // 直接更新 employees 狀態，刪除指定日期的班表
    const updatedEmployees = employees.map(employee =>
      employee.slug === employeeSlug
        ? {
            ...employee,
            work_schedules:
              employee.work_schedules?.filter(
                workSchedule => workSchedule.pivot?.date !== dateToDelete
              ) || [],
          }
        : employee
    );

    setEmployees(updatedEmployees);
    setHasChanges(true);
    closeContextMenu();
  };

  // 處理表單儲存
  const handleSaveSchedule = (formData: EditScheduleFormData) => {
    if (!contextMenu.workSchedule || !contextMenu.employee) {
      console.error('缺少必要的資料來更新排班');
      return;
    }

    const employeeSlug = contextMenu.employee.slug;
    const dateToUpdate = contextMenu.workSchedule.pivot?.date;

    if (!dateToUpdate) {
      console.error('無法更新班表：缺少日期資訊');
      return;
    }

    // 更新 employees 狀態，修改指定日期的班表
    const updatedEmployees = employees.map(employee =>
      employee.slug === employeeSlug
        ? {
            ...employee,
            work_schedules:
              employee.work_schedules?.map(ws =>
                ws.pivot?.date === dateToUpdate
                  ? {
                      ...ws,
                      pivot: {
                        ...ws.pivot,
                        clock_in_time: formData.clock_in_time,
                        clock_out_time: formData.clock_out_time,
                        ...(formData.comment && { comment: formData.comment }),
                      },
                    }
                  : ws
              ) || [],
          }
        : employee
    );

    setEmployees(updatedEmployees);
    setHasChanges(true);
    setIsEditFormOpen(false);
  };

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
    <>
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
                  <th
                    key={day}
                    className="px-2 py-3 text-center text-white font-medium min-w-[40px]"
                  >
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
                  onContextMenu={handleContextMenu}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 右鍵選單 */}
      <ScheduleContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        onClose={closeContextMenu}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
        employeeName={contextMenu.employee.name}
        workSchedule={contextMenu.workSchedule}
      />

      {/* 編輯表單 */}
      <EditScheduleForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={handleSaveSchedule}
        employee={contextMenu.employee}
        workSchedule={contextMenu.workSchedule}
      />
    </>
  );
};

export default ScheduleGrid;
