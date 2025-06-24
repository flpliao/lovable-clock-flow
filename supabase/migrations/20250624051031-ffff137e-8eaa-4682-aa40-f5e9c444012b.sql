
-- 新增排班管理權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('schedule:view_all', '查看所有排班', 'schedule:view_all', '可以查看所有員工的排班記錄', 'schedule'),
('schedule:view_own', '查看自己排班', 'schedule:view_own', '可以查看自己的排班記錄', 'schedule'),
('schedule:create', '創建排班', 'schedule:create', '可以為員工創建新的排班', 'schedule'),
('schedule:edit', '編輯排班', 'schedule:edit', '可以編輯排班記錄', 'schedule'),
('schedule:delete', '刪除排班', 'schedule:delete', '可以刪除排班記錄', 'schedule'),
('schedule:manage', '完整排班管理', 'schedule:manage', '具備完整的排班管理權限', 'schedule')
ON CONFLICT (code) DO NOTHING;
