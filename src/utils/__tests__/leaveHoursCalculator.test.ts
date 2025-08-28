import dayjs from 'dayjs';
import {
  calculateLeaveHoursBySchedule,
  calculateLeaveHoursSimple,
  validateLeaveTimeWithSchedule,
} from '../leaveHoursCalculator';
import { WorkSchedule } from '@/types/workSchedule';
import { WorkScheduleStatus } from '@/constants/workSchedule';

// 測試用的工作排程資料
const mockWorkSchedule: WorkSchedule = {
  slug: 'test-schedule',
  shift_id: 'test-shift',
  status: WorkScheduleStatus.WORK,
  clock_in_time: '09:00',
  clock_out_time: '18:00',
  ot_start_after_hours: 0,
  ot_start_after_minutes: 0,
  pivot: {
    status: 'active',
    date: '2024-01-15',
    clock_in_time: '09:00',
    clock_out_time: '18:00',
    comment: '',
  },
};

describe('leaveHoursCalculator', () => {
  describe('validateLeaveTimeWithSchedule', () => {
    it('should validate valid leave time', () => {
      const startDateTime = dayjs('2024-01-15 10:00');
      const endDateTime = dayjs('2024-01-15 16:00');
      const workSchedules = [mockWorkSchedule];

      const result = validateLeaveTimeWithSchedule(startDateTime, endDateTime, workSchedules);

      expect(result.isValid).toBe(true);
    });

    it('should reject invalid time range', () => {
      const startDateTime = dayjs('2024-01-15 16:00');
      const endDateTime = dayjs('2024-01-15 10:00'); // end before start

      const result = validateLeaveTimeWithSchedule(startDateTime, endDateTime, []);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('結束時間必須晚於開始時間');
    });
  });

  describe('calculateLeaveHoursSimple', () => {
    it('should calculate simple leave hours for weekdays', () => {
      const startDateTime = dayjs('2024-01-15 09:00'); // Monday
      const endDateTime = dayjs('2024-01-15 17:00');

      const result = calculateLeaveHoursSimple(startDateTime, endDateTime);

      expect(result).toBe(8); // 8 hours for one day
    });

    it('should skip weekends', () => {
      const startDateTime = dayjs('2024-01-13 09:00'); // Saturday
      const endDateTime = dayjs('2024-01-14 17:00'); // Sunday

      const result = calculateLeaveHoursSimple(startDateTime, endDateTime);

      expect(result).toBe(0); // No work hours on weekends
    });
  });

  describe('calculateLeaveHoursBySchedule', () => {
    it('should calculate hours based on work schedule', () => {
      const startDateTime = dayjs('2024-01-15 10:00');
      const endDateTime = dayjs('2024-01-15 16:00');
      const workSchedules = [mockWorkSchedule];

      const result = calculateLeaveHoursBySchedule(startDateTime, endDateTime, workSchedules);

      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for invalid inputs', () => {
      const result = calculateLeaveHoursBySchedule(
        null as unknown as dayjs.Dayjs,
        null as unknown as dayjs.Dayjs,
        []
      );

      expect(result).toBe(0);
    });
  });
});
