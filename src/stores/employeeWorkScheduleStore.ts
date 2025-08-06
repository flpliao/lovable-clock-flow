import { EmployeeWorkSchedule } from '@/types/employeeWorkSchedule';
import { create } from 'zustand';

interface EmployeeWorkScheduleState {
  employeeWorkSchedules: EmployeeWorkSchedule[];
  isLoading: boolean;
  error: string | null;

  // 基本 CRUD 操作
  setEmployeeWorkSchedules: (employeeWorkSchedules: EmployeeWorkSchedule[]) => void;
  addEmployeeWorkSchedule: (employeeWorkSchedule: EmployeeWorkSchedule) => void;
  setEmployeeWorkSchedule: (id: number, updates: Partial<EmployeeWorkSchedule>) => void;
  removeEmployeeWorkSchedule: (id: number) => void;
  reset: () => void;

  // 查詢方法
  getEmployeeWorkScheduleById: (id: number) => EmployeeWorkSchedule | undefined;
  getEmployeeWorkSchedulesByEmployeeId: (employeeId: number) => EmployeeWorkSchedule[];
  getEmployeeWorkSchedulesByDate: (date: string) => EmployeeWorkSchedule[];

  // 狀態管理
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEmployeeWorkScheduleStore = create<EmployeeWorkScheduleState>()((set, get) => ({
  employeeWorkSchedules: [],
  isLoading: false,
  error: null,

  setEmployeeWorkSchedules: (employeeWorkSchedules: EmployeeWorkSchedule[]) =>
    set({ employeeWorkSchedules, error: null }),

  addEmployeeWorkSchedule: (employeeWorkSchedule: EmployeeWorkSchedule) => {
    const { employeeWorkSchedules } = get();
    set({
      employeeWorkSchedules: [...employeeWorkSchedules, employeeWorkSchedule],
      error: null,
    });
  },

  setEmployeeWorkSchedule: (id: number, updates: Partial<EmployeeWorkSchedule>) => {
    const { employeeWorkSchedules } = get();
    const updatedSchedules = employeeWorkSchedules.map(schedule =>
      schedule.work_schedule_id === id ? { ...schedule, ...updates } : schedule
    );
    set({ employeeWorkSchedules: updatedSchedules, error: null });
  },

  removeEmployeeWorkSchedule: (id: number) => {
    const { employeeWorkSchedules } = get();
    const filteredSchedules = employeeWorkSchedules.filter(
      schedule => schedule.work_schedule_id !== id
    );
    set({ employeeWorkSchedules: filteredSchedules, error: null });
  },

  reset: () => {
    set({ employeeWorkSchedules: [], error: null });
  },

  getEmployeeWorkScheduleById: (id: number) => {
    const { employeeWorkSchedules } = get();
    return employeeWorkSchedules.find(schedule => schedule.work_schedule_id === id);
  },

  getEmployeeWorkSchedulesByEmployeeId: (employeeId: number) => {
    const { employeeWorkSchedules } = get();
    return employeeWorkSchedules.filter(schedule => schedule.employee_id === employeeId);
  },

  getEmployeeWorkSchedulesByDate: (date: string) => {
    const { employeeWorkSchedules } = get();
    return employeeWorkSchedules.filter(schedule => schedule.date === date);
  },

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
