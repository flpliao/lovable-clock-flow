import { Employee } from './employee';
import { WorkSchedule } from './workSchedule';

export interface EmployeeWorkSchedule {
  employee_slug: string;
  work_schedule_slug: string;
  employee?: Employee;
  work_schedule?: WorkSchedule;
  date: string;
  status: string;
}

export interface EmployeeWorkScheduleData {
  [employeeSlug: string]: {
    [date: string]: EmployeeWorkSchedule;
  };
}
