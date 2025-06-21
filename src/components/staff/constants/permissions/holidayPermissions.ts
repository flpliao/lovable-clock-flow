
export const HOLIDAY_PERMISSIONS = {
  VIEW: 'holiday:view',
  CREATE: 'holiday:create',
  EDIT: 'holiday:edit',
  DELETE: 'holiday:delete',
  MANAGE: 'holiday:manage'
} as const;

export const HOLIDAY_PERMISSION_DEFINITIONS = [
  {
    id: HOLIDAY_PERMISSIONS.VIEW,
    name: '查看節假日',
    code: HOLIDAY_PERMISSIONS.VIEW,
    category: 'holiday',
    description: '可以查看公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.CREATE,
    name: '新增節假日',
    code: HOLIDAY_PERMISSIONS.CREATE,
    category: 'holiday',
    description: '可以新增公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.EDIT,
    name: '編輯節假日',
    code: HOLIDAY_PERMISSIONS.EDIT,
    category: 'holiday',
    description: '可以編輯公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.DELETE,
    name: '刪除節假日',
    code: HOLIDAY_PERMISSIONS.DELETE,
    category: 'holiday',
    description: '可以刪除公司節假日'
  },
  {
    id: HOLIDAY_PERMISSIONS.MANAGE,
    name: '完整節假日管理',
    code: HOLIDAY_PERMISSIONS.MANAGE,
    category: 'holiday',
    description: '具備完整的節假日管理權限'
  }
] as const;
