// 基礎服務
export { BaseFilterService } from './BaseFilterService';
export type { FilterOption, OptionsProvider } from './BaseFilterService';

// 各模組篩選服務
export { StaffFilterService, staffFilterService } from './StaffFilterService';
export { OvertimeFilterService, overtimeFilterService } from './OvertimeFilterService';
export { PositionFilterService, positionFilterService } from './PositionFilterService';
export { AnnouncementFilterService, announcementFilterService } from './AnnouncementFilterService';

// 服務映射表（方便動態選擇服務）
export const filterServices = {
  staff: 'staffFilterService',
  overtime: 'overtimeFilterService',
  position: 'positionFilterService',
  announcement: 'announcementFilterService',
} as const;

// 服務實例映射
export const filterServiceInstances = {
  staff: () => import('./StaffFilterService').then(m => m.staffFilterService),
  overtime: () => import('./OvertimeFilterService').then(m => m.overtimeFilterService),
  position: () => import('./PositionFilterService').then(m => m.positionFilterService),
  announcement: () => import('./AnnouncementFilterService').then(m => m.announcementFilterService),
} as const;
