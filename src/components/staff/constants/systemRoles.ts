import { StaffRole } from '../types';
import { 
  STAFF_PERMISSIONS, 
  LEAVE_PERMISSIONS, 
  ANNOUNCEMENT_PERMISSIONS,
  HOLIDAY_PERMISSIONS,
  SCHEDULE_PERMISSIONS
} from './permissions';

export const SYSTEM_ROLES: StaffRole[] = [
  {
    id: 'admin',
    name: '系統管理員',
    description: '擁有系統完整管理權限',
    permissions: [
      {
        id: STAFF_PERMISSIONS.VIEW_STAFF,
        name: '查看員工',
        code: STAFF_PERMISSIONS.VIEW_STAFF
      },
      {
        id: STAFF_PERMISSIONS.CREATE_STAFF,
        name: '新增員工',
        code: STAFF_PERMISSIONS.CREATE_STAFF
      },
      {
        id: STAFF_PERMISSIONS.EDIT_STAFF,
        name: '編輯員工',
        code: STAFF_PERMISSIONS.EDIT_STAFF
      },
      {
        id: STAFF_PERMISSIONS.DELETE_STAFF,
        name: '刪除員工',
        code: STAFF_PERMISSIONS.DELETE_STAFF
      },
      {
        id: STAFF_PERMISSIONS.MANAGE_ROLES,
        name: '管理角色',
        code: STAFF_PERMISSIONS.MANAGE_ROLES
      },
      {
        id: LEAVE_PERMISSIONS.APPROVE_LEAVE,
        name: '審核請假',
        code: LEAVE_PERMISSIONS.APPROVE_LEAVE
      },
      {
        id: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS,
        name: '查看請假申請',
        code: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.CREATE_ANNOUNCEMENT,
        name: '建立公告',
        code: ANNOUNCEMENT_PERMISSIONS.CREATE_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.EDIT_ANNOUNCEMENT,
        name: '編輯公告',
        code: ANNOUNCEMENT_PERMISSIONS.EDIT_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.DELETE_ANNOUNCEMENT,
        name: '刪除公告',
        code: ANNOUNCEMENT_PERMISSIONS.DELETE_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.PUBLISH_ANNOUNCEMENT,
        name: '發布公告',
        code: ANNOUNCEMENT_PERMISSIONS.PUBLISH_ANNOUNCEMENT
      },
      {
        id: HOLIDAY_PERMISSIONS.MANAGE_HOLIDAYS,
        name: '管理國定假日',
        code: HOLIDAY_PERMISSIONS.MANAGE_HOLIDAYS
      },
      
      {
        id: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
        name: '查看所有排班',
        code: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES
      },
      {
        id: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
        name: '創建排班',
        code: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE
      },
      {
        id: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
        name: '編輯排班',
        code: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE
      },
      {
        id: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
        name: '刪除排班',
        code: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE
      },
      {
        id: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE,
        name: '完整排班管理',
        code: SCHEDULE_PERMISSIONS.MANAGE_SCHEDULE
      }
    ]
  },
  {
    id: 'hr_manager',
    name: 'HR主管',
    description: 'HR部門主管權限',
    permissions: [
      {
        id: STAFF_PERMISSIONS.VIEW_STAFF,
        name: '查看員工',
        code: STAFF_PERMISSIONS.VIEW_STAFF
      },
      {
        id: LEAVE_PERMISSIONS.APPROVE_LEAVE,
        name: '審核請假',
        code: LEAVE_PERMISSIONS.APPROVE_LEAVE
      },
      {
        id: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS,
        name: '查看請假申請',
        code: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.CREATE_ANNOUNCEMENT,
        name: '建立公告',
        code: ANNOUNCEMENT_PERMISSIONS.CREATE_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.EDIT_ANNOUNCEMENT,
        name: '編輯公告',
        code: ANNOUNCEMENT_PERMISSIONS.EDIT_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.DELETE_ANNOUNCEMENT,
        name: '刪除公告',
        code: ANNOUNCEMENT_PERMISSIONS.DELETE_ANNOUNCEMENT
      },
      {
        id: ANNOUNCEMENT_PERMISSIONS.PUBLISH_ANNOUNCEMENT,
        name: '發布公告',
        code: ANNOUNCEMENT_PERMISSIONS.PUBLISH_ANNOUNCEMENT
      },
      
      {
        id: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES,
        name: '查看所有排班',
        code: SCHEDULE_PERMISSIONS.VIEW_ALL_SCHEDULES
      },
      {
        id: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE,
        name: '創建排班',
        code: SCHEDULE_PERMISSIONS.CREATE_SCHEDULE
      },
      {
        id: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE,
        name: '編輯排班',
        code: SCHEDULE_PERMISSIONS.EDIT_SCHEDULE
      },
      {
        id: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE,
        name: '刪除排班',
        code: SCHEDULE_PERMISSIONS.DELETE_SCHEDULE
      }
    ]
  },
  {
    id: 'department_manager',
    name: '部門主管',
    description: '部門主管權限',
    permissions: [
      {
        id: STAFF_PERMISSIONS.VIEW_STAFF,
        name: '查看員工',
        code: STAFF_PERMISSIONS.VIEW_STAFF
      },
      {
        id: LEAVE_PERMISSIONS.APPROVE_LEAVE,
        name: '審核請假',
        code: LEAVE_PERMISSIONS.APPROVE_LEAVE
      },
      {
        id: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS,
        name: '查看請假申請',
        code: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS
      },
      
      {
        id: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
        name: '查看自己排班',
        code: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE
      }
    ]
  },
  {
    id: 'user',
    name: '一般員工',
    description: '基本員工權限',
    permissions: [
      {
        id: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS,
        name: '查看請假申請',
        code: LEAVE_PERMISSIONS.VIEW_LEAVE_REQUESTS
      },
      
      {
        id: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
        name: '查看自己排班',
        code: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE
      }
    ]
  }
];
