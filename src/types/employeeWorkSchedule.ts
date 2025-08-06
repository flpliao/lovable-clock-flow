import { WorkSchedule } from './workSchedule';

export interface EmployeeWorkSchedule {
  employee_id: number;
  work_schedule_id: number;
  work_schedule?: WorkSchedule;
  date: string;
  status: string;
}

export interface EmployeeWorkScheduleData {
  [employeeName: string]: {
    [date: string]: EmployeeWorkSchedule;
  };
}
