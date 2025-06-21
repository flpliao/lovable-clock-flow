import { StaffRole } from '../../types';
import { 
  STAFF_PERMISSIONS, 
  LEAVE_PERMISSIONS, 
  ANNOUNCEMENT_PERMISSIONS,
  SCHEDULE_PERMISSIONS
} from '../permissions/index';

export const HR_MANAGER_ROLE: StaffRole = {
  id: 'hr_manager',
  name: 'HR主管',
  description: 'HR部門主管權限',
  is_system_role: true,
  permissions: [
    {
      id: STAFF_PERMISSIONS.VIEW,
      name: '查看員工',
      code: STAFF_PERMISSIONS.VIEW,
      category: 'staff'
    },
    {
      id: LEAVE_PERMISSIONS.APPROVE,
      name: '審核請假',
      code: LEAVE_PERMISSIONS.APPROVE,
      category: 'leave'
    },
    {
      id: LEAVE_PERMISSIONS.VIEW,
      name: '查看請假申請',
      code: LEAVE_PERMISSIONS.VIEW,
      category: 'leave'
    },
    {
      id: ANNOUNCEMENT_PERMISSIONS.CREATE,
      name: '建立公告',
      code: ANNOUNCEMENT_PERMISSIONS.CREATE,
      category: 'announcement'
    },
    {
      id: ANNOUNCEMENT_PERMISSIONS.EDIT,
      name: '編輯公告',
      code: ANNOUNCEMENT_PERMISSIONS.EDIT,
      category: 'announcement'
    },
    {
      id: ANNOUNCEMENT_PERMISSIONS.DELETE,
      name: '刪除公告',
      code: ANNOUNCEMENT_PERMISSIONS.DELETE,
      category: 'announcement'
    },
    {
      id: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
      name: '發布公告',
      code: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
      category: 'announcement'
    },
    {
      id: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
      name: '查看所有排班',
      code: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
      category: 'schedule'
    },
    {
      id: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
      name: '創建排班',
      code: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
      category: 'schedule'
    },
    {
      id: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
      name: '編輯排班',
      code: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
      category: 'schedule'
    },
    {
      id: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
      name: '刪除排班',
      code: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
      category: 'schedule'
    }
  ]
};
