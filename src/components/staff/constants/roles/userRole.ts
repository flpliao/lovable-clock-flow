import { StaffRole } from '../../types';
import { 
  LEAVE_PERMISSIONS, 
  SCHEDULE_PERMISSIONS
} from '../permissions/index';

export const USER_ROLE: StaffRole = {
  id: 'user',
  name: '一般員工',
  description: '基本員工權限',
  is_system_role: true,
  permissions: [
    {
      id: LEAVE_PERMISSIONS.VIEW,
      name: '查看請假申請',
      code: LEAVE_PERMISSIONS.VIEW,
      category: 'leave'
    },
    {
      id: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
      name: '查看自己排班',
      code: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
      category: 'schedule'
    }
  ]
};
