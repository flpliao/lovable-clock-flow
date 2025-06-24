
-- 檢查並新增缺少的權限設定，避免重複插入
-- 只新增不存在的權限

-- 新增出勤管理權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('attendance:view_own', '查看個人出勤', 'attendance:view_own', '可以查看自己的出勤記錄', 'attendance'),
('attendance:view_all', '查看所有出勤', 'attendance:view_all', '可以查看所有員工的出勤記錄', 'attendance'),
('attendance:manage', '出勤管理', 'attendance:manage', '完整的出勤管理權限', 'attendance')
ON CONFLICT (code) DO NOTHING;

-- 新增加班管理權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('overtime:request', '申請加班', 'overtime:request', '可以提交加班申請', 'overtime'),
('overtime:approve', '審核加班', 'overtime:approve', '可以審核加班申請', 'overtime'),
('overtime:view', '查看加班', 'overtime:view', '可以查看加班記錄', 'overtime'),
('overtime:manage', '完整加班管理', 'overtime:manage', '具備完整的加班管理權限', 'overtime')
ON CONFLICT (code) DO NOTHING;

-- 新增請假類型管理權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('leave_type:view', '查看假別設定', 'leave_type:view', '可以查看請假假別設定', 'leave_type'),
('leave_type:create', '新增假別', 'leave_type:create', '可以新增請假假別', 'leave_type'),
('leave_type:edit', '編輯假別', 'leave_type:edit', '可以編輯請假假別', 'leave_type'),
('leave_type:delete', '刪除假別', 'leave_type:delete', '可以刪除請假假別', 'leave_type'),
('leave_type:manage', '完整假別管理', 'leave_type:manage', '具備完整的假別管理權限', 'leave_type')
ON CONFLICT (code) DO NOTHING;

-- 新增HR管理權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('hr:payroll_view', '查看薪資', 'hr:payroll_view', '可以查看薪資記錄', 'hr'),
('hr:payroll_manage', '薪資管理', 'hr:payroll_manage', '可以管理薪資結構和發放', 'hr'),
('hr:overtime_manage', 'HR加班管理', 'hr:overtime_manage', '可以管理加班政策和審核', 'hr'),
('hr:manage', '完整HR管理', 'hr:manage', '具備完整的HR管理權限', 'hr')
ON CONFLICT (code) DO NOTHING;

-- 新增系統設定權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('system:settings_view', '查看系統設定', 'system:settings_view', '可以查看系統設定', 'system'),
('system:settings_edit', '編輯系統設定', 'system:settings_edit', '可以編輯系統設定', 'system'),
('system:manage', '系統管理', 'system:manage', '具備完整的系統管理權限', 'system')
ON CONFLICT (code) DO NOTHING;

-- 確保現有權限有正確的分類
UPDATE public.permissions SET category = 'staff' WHERE category IS NULL AND code LIKE 'staff:%';
UPDATE public.permissions SET category = 'leave' WHERE category IS NULL AND code LIKE 'leave:%';
UPDATE public.permissions SET category = 'announcement' WHERE category IS NULL AND code LIKE 'announcement:%';
UPDATE public.permissions SET category = 'holiday' WHERE category IS NULL AND code LIKE 'holiday:%';
UPDATE public.permissions SET category = 'department' WHERE category IS NULL AND code LIKE 'department:%';
UPDATE public.permissions SET category = 'schedule' WHERE category IS NULL AND code LIKE 'schedule:%';
