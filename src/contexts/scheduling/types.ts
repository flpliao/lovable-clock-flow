
export interface Schedule {
  id: string;
  userId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  createdBy?: string;
}

export interface SchedulingContextType {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  addSchedules: (newSchedules: Omit<Schedule, 'id'>[]) => Promise<void>;
  getSchedulesForDate: (date: string) => Schedule[];
  removeSchedule: (id: string) => Promise<void>;
  updateSchedule: (id: string, updates: Partial<Omit<Schedule, 'id'>>) => Promise<void>;
  refreshSchedules: () => Promise<void>;
}
