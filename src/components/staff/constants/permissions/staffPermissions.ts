
export const STAFF_PERMISSIONS = {
  VIEW: 'staff:view',
  CREATE: 'staff:create',
  EDIT: 'staff:edit',
  DELETE: 'staff:delete',
  MANAGE: 'staff:manage'
} as const;

export const STAFF_PERMISSION_DEFINITIONS = [
  {
    id: STAFF_PERMISSIONS.VIEW,
    name: '查看員工',
    code: STAFF_PERMISSIONS.VIEW,
    category: 'staff',
    description: '可以查看員工列表和詳細信息'
  },
  {
    id: STAFF_PERMISSIONS.CREATE,
    name: '新增員工',
    code: STAFF_PERMISSIONS.CREATE,
    category: 'staff',
    description: '可以新增員工'
  },
  {
    id: STAFF_PERMISSIONS.EDIT,
    name: '編輯員工',
    code: STAFF_PERMISSIONS.EDIT,
    category: 'staff',
    description: '可以編輯員工信息'
  },
  {
    id: STAFF_PERMISSIONS.DELETE,
    name: '刪除員工',
    code: STAFF_PERMISSIONS.DELETE,
    category: 'staff',
    description: '可以刪除員工'
  },
  {
    id: STAFF_PERMISSIONS.MANAGE,
    name: '完整員工管理',
    code: STAFF_PERMISSIONS.MANAGE,
    category: 'staff',
    description: '具備完整的員工管理權限'
  }
] as const;
