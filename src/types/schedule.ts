import { WorkSchedule } from './workSchedule';

export interface Employee {
  id: number;
  name: string;
  department: string;
}

export interface EmployeeWorkSchedule {
  employee_id: number;
  work_schedule_id: number;
  work_schedule?: WorkSchedule;
  date: string;
  status: string;
}

export interface EmployeeWorkScheduleData {
  [employeeName: string]: {
    [day: number]: EmployeeWorkSchedule;
  };
}

export interface ScheduleShift {
  id: number;
  name: string;
  color: string;
  code: string;
}
