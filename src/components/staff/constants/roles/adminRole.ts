
import { StaffRole } from '../../types';
import { 
  STAFF_PERMISSIONS, 
  LEAVE_PERMISSIONS, 
  ANNOUNCEMENT_PERMISSIONS,
  HOLIDAY_PERMISSIONS,
  SCHEDULE_PERMISSIONS
} from '../permissions';

export const ADMIN_ROLE: StaffRole = {
  id: 'admin',
  name: '系統管理員',
  description: '擁有系統完整管理權限',
  is_system_role: true,
  permissions: [
    {
      id: STAFF_PERMISSIONS.VIEW,
      name: '查看員工',
      code: STAFF_PERMISSIONS.VIEW,
      category: 'staff'
    },
    {
      id: STAFF_PERMISSIONS.CREATE,
      name: '新增員工',
      code: STAFF_PERMISSIONS.CREATE,
      category: 'staff'
    },
    {
      id: STAFF_PERMISSIONS.EDIT,
      name: '編輯員工',
      code: STAFF_PERMISSIONS.EDIT,
      category: 'staff'
    },
    {
      id: STAFF_PERMISSIONS.DELETE,
      name: '刪除員工',
      code: STAFF_PERMISSIONS.DELETE,
      category: 'staff'
    },
    {
      id: STAFF_PERMISSIONS.MANAGE,
      name: '管理角色',
      code: STAFF_PERMISSIONS.MANAGE,
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
      id: HOLIDAY_PERMISSIONS.MANAGE,
      name: '管理國定假日',
      code: HOLIDAY_PERMISSIONS.MANAGE,
      category: 'holiday'
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
    },
    {
      id: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE,
      name: '完整排班管理',
      code: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE,
      category: 'schedule'
    }
  ]
};
