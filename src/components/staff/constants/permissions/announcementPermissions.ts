
export const ANNOUNCEMENT_PERMISSIONS = {
  VIEW: 'announcement:view',
  CREATE: 'announcement:create',
  EDIT: 'announcement:edit',
  DELETE: 'announcement:delete',
  PUBLISH: 'announcement:publish',
  MANAGE: 'announcement:manage'
} as const;

export const ANNOUNCEMENT_PERMISSION_DEFINITIONS = [
  {
    id: ANNOUNCEMENT_PERMISSIONS.VIEW,
    name: '查看公告',
    code: ANNOUNCEMENT_PERMISSIONS.VIEW,
    category: 'announcement',
    description: '可以查看公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.CREATE,
    name: '新增公告',
    code: ANNOUNCEMENT_PERMISSIONS.CREATE,
    category: 'announcement',
    description: '可以新增公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.EDIT,
    name: '編輯公告',
    code: ANNOUNCEMENT_PERMISSIONS.EDIT,
    category: 'announcement',
    description: '可以編輯公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.DELETE,
    name: '刪除公告',
    code: ANNOUNCEMENT_PERMISSIONS.DELETE,
    category: 'announcement',
    description: '可以刪除公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
    name: '發布公告',
    code: ANNOUNCEMENT_PERMISSIONS.PUBLISH,
    category: 'announcement',
    description: '可以發布公司公告'
  },
  {
    id: ANNOUNCEMENT_PERMISSIONS.MANAGE,
    name: '完整公告管理',
    code: ANNOUNCEMENT_PERMISSIONS.MANAGE,
    category: 'announcement',
    description: '具備完整的公告管理權限'
  }
] as const;
