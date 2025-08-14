import type { Employee } from './employee';
import type { WorkSchedule } from './workSchedule';

// ScheduleGrid 相關介面
export interface ScheduleGridProps {
  employees: Employee[];
  selectedMonth: string;
  isEditMode: boolean;
  setHasChanges: (hasChanges: boolean) => void;
  onCellClick: (employeeName: string, day: number) => void;
  expandedEmployees: Set<string>;
  onEmployeeToggle: (employeeSlug: string) => void;
  setEmployees: (employees: Employee[]) => void; // 簡化的狀態更新函數類型
}

// 右鍵選單狀態介面
export interface ScheduleContextMenuState {
  isVisible: boolean;
  x: number;
  y: number;
  employee: Employee;
  workSchedule?: WorkSchedule;
}

// 排班表單資料介面
export interface ScheduleFormData {
  shift_id: string;
  clock_in_time: string;
  clock_out_time: string;
  status: string;
  notes?: string;
}

// 編輯排班表單資料介面 (與 EditScheduleForm 一致)
export interface EditScheduleFormData {
  clock_in_time: string;
  clock_out_time: string;
  comment?: string;
}

// 編輯排班表單 Props 介面
export interface EditScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  workSchedule?: WorkSchedule;
  employee: Employee;
  onSave: (data: EditScheduleFormData) => void;
}
