
// Re-export all permission constants and definitions
export { STAFF_PERMISSIONS, STAFF_PERMISSION_DEFINITIONS } from './staffPermissions';
export { LEAVE_PERMISSIONS, LEAVE_PERMISSION_DEFINITIONS } from './leavePermissions';
export { ANNOUNCEMENT_PERMISSIONS, ANNOUNCEMENT_PERMISSION_DEFINITIONS } from './announcementPermissions';
export { HOLIDAY_PERMISSIONS, HOLIDAY_PERMISSION_DEFINITIONS } from './holidayPermissions';
export { DEPARTMENT_PERMISSIONS, DEPARTMENT_PERMISSION_DEFINITIONS } from './departmentPermissions';
export { SCHEDULE_PERMISSIONS, SCHEDULE_PERMISSION_DEFINITIONS } from './schedulePermissions';
export { OVERTIME_PERMISSIONS, OVERTIME_PERMISSION_DEFINITIONS } from './overtimePermissions';

// Import the permission definitions to create the combined array
import { STAFF_PERMISSION_DEFINITIONS } from './staffPermissions';
import { LEAVE_PERMISSION_DEFINITIONS } from './leavePermissions';
import { ANNOUNCEMENT_PERMISSION_DEFINITIONS } from './announcementPermissions';
import { HOLIDAY_PERMISSION_DEFINITIONS } from './holidayPermissions';
import { DEPARTMENT_PERMISSION_DEFINITIONS } from './departmentPermissions';
import { SCHEDULE_PERMISSION_DEFINITIONS } from './schedulePermissions';
import { OVERTIME_PERMISSION_DEFINITIONS } from './overtimePermissions';

// Combine all permission definitions
export const ALL_PERMISSIONS = [
  ...STAFF_PERMISSION_DEFINITIONS,
  ...LEAVE_PERMISSION_DEFINITIONS,
  ...ANNOUNCEMENT_PERMISSION_DEFINITIONS,
  ...HOLIDAY_PERMISSION_DEFINITIONS,
  ...DEPARTMENT_PERMISSION_DEFINITIONS,
  ...SCHEDULE_PERMISSION_DEFINITIONS,
  ...OVERTIME_PERMISSION_DEFINITIONS
] as const;
