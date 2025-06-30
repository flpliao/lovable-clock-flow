
import { StaffRole } from '../../types';
import { 
  STAFF_PERMISSIONS, 
  LEAVE_PERMISSIONS, 
  SCHEDULE_PERMISSIONS
} from '../permissions/index';

export const DEPARTMENT_MANAGER_ROLE: StaffRole = {
  id: 'department_manager',
  name: '部門主管',
  description: '部門主管權限',
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
      id: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
      name: '查看自己排班',
      code: SCHEDULE_PERMISSIONS.VIEW_OWN_SCHEDULE,
      category: 'schedule'
    }
  ]
};
