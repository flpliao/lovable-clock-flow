import { Staff, StaffRole } from './types';

// 只保留廖俊雄（管理者）的資料
export const mockStaffList: Staff[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // 確保使用正確的廖俊雄 ID
    name: '廖俊雄',
    position: '總經理',
    department: '管理部',
    branch_id: '1',
    branch_name: '總公司',
    contact: '0912-345-678',
    role: 'admin',
    role_id: 'admin',
    username: 'admin',
    email: 'admin@example.com'
  }
];

export const mockRoles: StaffRole[] = [
  {
    id: 'admin',
    name: '系統管理員',
    permissions: [
      { id: 'manage_all', name: '完整管理權限', code: 'admin:all', description: '擁有完整管理權限', category: '系統管理' },
      { id: 'view_all', name: '查看所有資料', code: 'view:all', description: '查看所有資料', category: '系統管理' },
      { id: 'edit_all', name: '編輯所有資料', code: 'edit:all', description: '編輯所有資料', category: '系統管理' }
    ],
    description: '擁有系統完整管理權限',
    is_system_role: true
  },
  {
    id: 'store_manager',
    name: '店長',
    permissions: [
      { id: 'manage_store', name: '管理門市', code: 'store:manage', description: '管理門市', category: '門市管理' },
      { id: 'view_staff', name: '查看員工資料', code: 'staff:view', description: '查看員工資料', category: '人員管理' },
      { id: 'approve_leave', name: '核准請假', code: 'leave:approve', description: '核准請假', category: '請假管理' }
    ],
    description: '門市店長權限',
    is_system_role: true
  },
  {
    id: 'sales_manager',
    name: '營業主管',
    permissions: [
      { id: 'manage_sales', name: '管理營業', code: 'sales:manage', description: '管理營業', category: '營業管理' },
      { id: 'view_reports', name: '查看報表', code: 'reports:view', description: '查看報表', category: '報表管理' },
      { id: 'approve_leave', name: '核准請假', code: 'leave:approve', description: '核准請假', category: '請假管理' }
    ],
    description: '營業主管權限',
    is_system_role: true
  },
  {
    id: 'staff',
    name: '一般員工',
    permissions: [
      { id: 'view_own', name: '查看個人資料', code: 'self:view', description: '查看個人資料', category: '個人管理' },
      { id: 'request_leave', name: '申請請假', code: 'leave:create', description: '申請請假', category: '請假管理' }
    ],
    description: '一般員工權限',
    is_system_role: true
  },
  {
    id: 'user',
    name: '使用者',
    permissions: [
      { id: 'view_own', name: '查看個人資料', code: 'self:view', description: '查看個人資料', category: '個人管理' },
      { id: 'request_leave', name: '申請請假', code: 'leave:create', description: '申請請假', category: '請假管理' }
    ],
    description: '基本使用者權限',
    is_system_role: true
  }
];
