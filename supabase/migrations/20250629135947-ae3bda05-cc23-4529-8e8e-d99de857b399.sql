
-- 修正版：階段一權限資料結構重新設計

-- 1. 首先備份現有的權限資料
CREATE TABLE IF NOT EXISTS staff_backup AS SELECT * FROM public.staff;

-- 2. 確保 staff_roles 表有完整的系統角色
INSERT INTO public.staff_roles (id, name, description, is_system_role) VALUES
('admin', '系統管理員', '擁有系統完整管理權限，可管理所有功能', true),
('manager', '部門主管', '部門管理權限，可管理下屬員工和審核申請', true),
('user', '一般員工', '基本員工權限，可使用日常功能', true)
ON CONFLICT (id) DO UPDATE SET
  description = EXCLUDED.description,
  is_system_role = EXCLUDED.is_system_role;

-- 3. 清空現有權限表並重新建立
DELETE FROM public.role_permissions;
DELETE FROM public.permissions;

-- 重新插入權限定義，使用 code 作為 id
INSERT INTO public.permissions (id, name, code, description, category) VALUES
-- 系統管理權限
('system:admin', '系統管理', 'system:admin', '完整系統管理權限', 'system'),
('system:settings', '系統設定', 'system:settings', '修改系統設定', 'system'),

-- 員工管理權限
('staff:view_all', '查看所有員工', 'staff:view_all', '可查看所有員工資料', 'staff'),
('staff:view_own', '查看個人資料', 'staff:view_own', '可查看自己的資料', 'staff'),
('staff:create', '新增員工', 'staff:create', '可新增員工記錄', 'staff'),
('staff:edit_all', '編輯所有員工', 'staff:edit_all', '可編輯所有員工資料', 'staff'),
('staff:edit_own', '編輯個人資料', 'staff:edit_own', '可編輯自己的資料', 'staff'),
('staff:delete', '刪除員工', 'staff:delete', '可刪除員工記錄', 'staff'),

-- 請假管理權限
('leave:view_all', '查看所有請假', 'leave:view_all', '可查看所有請假申請', 'leave'),
('leave:view_own', '查看個人請假', 'leave:view_own', '可查看自己的請假記錄', 'leave'),
('leave:create', '申請請假', 'leave:create', '可提交請假申請', 'leave'),
('leave:approve', '審核請假', 'leave:approve', '可審核請假申請', 'leave'),
('leave:manage', '請假管理', 'leave:manage', '完整請假管理權限', 'leave'),

-- 加班管理權限
('overtime:view_all', '查看所有加班', 'overtime:view_all', '可查看所有加班申請', 'overtime'),
('overtime:view_own', '查看個人加班', 'overtime:view_own', '可查看自己的加班記錄', 'overtime'),
('overtime:create', '申請加班', 'overtime:create', '可提交加班申請', 'overtime'),
('overtime:approve', '審核加班', 'overtime:approve', '可審核加班申請', 'overtime'),
('overtime:manage', '加班管理', 'overtime:manage', '完整加班管理權限', 'overtime'),

-- 補簽管理權限
('missed_checkin:view_all', '查看所有補簽', 'missed_checkin:view_all', '可查看所有補簽申請', 'checkin'),
('missed_checkin:view_own', '查看個人補簽', 'missed_checkin:view_own', '可查看自己的補簽記錄', 'checkin'),
('missed_checkin:create', '申請補簽', 'missed_checkin:create', '可提交補簽申請', 'checkin'),
('missed_checkin:approve', '審核補簽', 'missed_checkin:approve', '可審核補簽申請', 'checkin'),
('missed_checkin:manage', '補簽管理', 'missed_checkin:manage', '完整補簽管理權限', 'checkin'),

-- 公告管理權限
('announcement:view', '查看公告', 'announcement:view', '可查看公告', 'announcement'),
('announcement:create', '發布公告', 'announcement:create', '可發布新公告', 'announcement'),
('announcement:edit', '編輯公告', 'announcement:edit', '可編輯公告', 'announcement'),
('announcement:delete', '刪除公告', 'announcement:delete', '可刪除公告', 'announcement'),

-- 部門管理權限
('department:view', '查看部門', 'department:view', '可查看部門資料', 'department'),
('department:manage', '部門管理', 'department:manage', '完整部門管理權限', 'department'),

-- 公司管理權限
('company:view', '查看公司資料', 'company:view', '可查看公司和分店資料', 'company'),
('company:manage', '公司管理', 'company:manage', '完整公司管理權限', 'company');

-- 4. 設定角色權限關聯 - 使用正確的 permission_id
-- 系統管理員：擁有所有權限
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'admin', id FROM public.permissions;

-- 部門主管：管理權限 + 審核權限
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
('manager', 'staff:view_all'),
('manager', 'staff:view_own'),
('manager', 'staff:edit_own'),
('manager', 'leave:view_all'),
('manager', 'leave:view_own'),
('manager', 'leave:create'),
('manager', 'leave:approve'),
('manager', 'overtime:view_all'),
('manager', 'overtime:view_own'),
('manager', 'overtime:create'),
('manager', 'overtime:approve'),
('manager', 'missed_checkin:view_all'),
('manager', 'missed_checkin:view_own'),
('manager', 'missed_checkin:create'),
('manager', 'missed_checkin:approve'),
('manager', 'announcement:view'),
('manager', 'department:view'),
('manager', 'company:view');

-- 一般員工：基本權限
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
('user', 'staff:view_own'),
('user', 'staff:edit_own'),
('user', 'leave:view_own'),
('user', 'leave:create'),
('user', 'overtime:view_own'),
('user', 'overtime:create'),
('user', 'missed_checkin:view_own'),
('user', 'missed_checkin:create'),
('user', 'announcement:view'),
('user', 'department:view'),
('user', 'company:view');

-- 5. 統一 staff 表的權限設定
-- 移除 permissions 欄位（如果存在）
ALTER TABLE public.staff DROP COLUMN IF EXISTS permissions;

-- 確保所有 staff 記錄都有 role_id
UPDATE public.staff 
SET role_id = CASE 
  WHEN role = 'admin' THEN 'admin'
  WHEN role = 'manager' THEN 'manager'
  ELSE 'user'
END
WHERE role_id IS NULL OR role_id = '';

-- 6. 建立統一的權限查詢視圖
CREATE OR REPLACE VIEW public.user_permissions_view AS
SELECT 
  s.id as staff_id,
  s.user_id,
  s.name as staff_name,
  s.email,
  s.department,
  sr.id as role_id,
  sr.name as role_name,
  sr.description as role_description,
  array_agg(p.code ORDER BY p.category, p.code) as permissions
FROM public.staff s
LEFT JOIN public.staff_roles sr ON s.role_id = sr.id
LEFT JOIN public.role_permissions rp ON sr.id = rp.role_id
LEFT JOIN public.permissions p ON rp.permission_id = p.id
GROUP BY s.id, s.user_id, s.name, s.email, s.department, sr.id, sr.name, sr.description;

-- 7. 建立高效能的權限檢查函數
CREATE OR REPLACE FUNCTION public.user_has_permission(user_uuid uuid, permission_code text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.staff s
    JOIN public.staff_roles sr ON s.role_id = sr.id
    JOIN public.role_permissions rp ON sr.id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE (s.user_id = user_uuid OR s.id = user_uuid)
      AND p.code = permission_code
  );
$$;

-- 8. 建立當前用戶權限檢查函數
CREATE OR REPLACE FUNCTION public.current_user_has_permission(permission_code text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.user_has_permission(auth.uid(), permission_code);
$$;

-- 9. 建立權限統計查詢
CREATE OR REPLACE VIEW public.permission_summary AS
SELECT 
  sr.name as role_name,
  count(rp.permission_id) as permission_count,
  string_agg(p.name, ', ' ORDER BY p.category, p.name) as permissions_list
FROM public.staff_roles sr
LEFT JOIN public.role_permissions rp ON sr.id = rp.role_id
LEFT JOIN public.permissions p ON rp.permission_id = p.id
WHERE sr.is_system_role = true
GROUP BY sr.id, sr.name
ORDER BY sr.name;
