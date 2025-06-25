
-- 新增加班審核權限到 permissions 表格
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('overtime:approve', '審核加班申請', 'overtime:approve', '可以審核和批准加班申請', 'overtime')
ON CONFLICT (code) DO NOTHING;

-- 為系統管理員角色添加加班審核權限
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
('admin', 'overtime:approve')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 為管理者角色添加加班審核權限
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
('manager', 'overtime:approve')
ON CONFLICT (role_id, permission_id) DO NOTHING;
