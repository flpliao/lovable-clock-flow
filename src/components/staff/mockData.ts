
import { Staff, Role } from './types';

export const mockStaffList: Staff[] = [
  {
    id: '1',
    name: '張總經理',
    position: '總經理',
    department: '管理部',
    branch_id: '1',
    branch_name: '總公司',
    contact: '0912-345-678',
    role: 'admin',
    role_id: 'admin',
    username: 'manager.zhang',
    email: 'zhang@company.com'
  },
  {
    id: '2',
    name: '李人資主管',
    position: '人資主管',
    department: 'HR',
    branch_id: '1',
    branch_name: '總公司',
    contact: '0923-456-789',
    role: 'admin',
    role_id: 'admin',
    supervisor_id: '1',
    username: 'hr.lee',
    email: 'lee@company.com'
  },
  {
    id: '3',
    name: '王店長',
    position: '店長',
    department: '門市',
    branch_id: '2',
    branch_name: '台北分店',
    contact: '0934-567-890',
    role: 'user',
    role_id: 'store_manager',
    supervisor_id: '1',
    username: 'store.wang',
    email: 'wang@company.com'
  },
  {
    id: '4',
    name: '陳服務員',
    position: '服務員',
    department: '門市',
    branch_id: '2',
    branch_name: '台北分店',
    contact: '0945-678-901',
    role: 'user',
    role_id: 'staff',
    supervisor_id: '3',
    username: 'staff.chen',
    email: 'chen@company.com'
  },
  {
    id: '5',
    name: '林營業主管',
    position: '營業主管',
    department: '營業部',
    branch_id: '3',
    branch_name: '高雄分店',
    contact: '0956-789-012',
    role: 'user',
    role_id: 'sales_manager',
    supervisor_id: '1',
    username: 'sales.lin',
    email: 'lin@company.com'
  }
];

export const mockRoles: Role[] = [
  {
    id: 'admin',
    name: '系統管理員',
    permissions: [
      { id: 'manage_all', name: '完整管理權限' },
      { id: 'view_all', name: '查看所有資料' },
      { id: 'edit_all', name: '編輯所有資料' }
    ],
    description: '擁有系統完整管理權限'
  },
  {
    id: 'store_manager',
    name: '店長',
    permissions: [
      { id: 'manage_store', name: '管理門市' },
      { id: 'view_staff', name: '查看員工資料' },
      { id: 'approve_leave', name: '核准請假' }
    ],
    description: '門市店長權限'
  },
  {
    id: 'sales_manager',
    name: '營業主管',
    permissions: [
      { id: 'manage_sales', name: '管理營業' },
      { id: 'view_reports', name: '查看報表' },
      { id: 'approve_leave', name: '核准請假' }
    ],
    description: '營業主管權限'
  },
  {
    id: 'staff',
    name: '一般員工',
    permissions: [
      { id: 'view_own', name: '查看個人資料' },
      { id: 'request_leave', name: '申請請假' }
    ],
    description: '一般員工權限'
  },
  {
    id: 'user',
    name: '使用者',
    permissions: [
      { id: 'view_own', name: '查看個人資料' },
      { id: 'request_leave', name: '申請請假' }
    ],
    description: '基本使用者權限'
  }
];
