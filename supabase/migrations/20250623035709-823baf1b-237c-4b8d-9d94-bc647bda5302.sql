
-- 插入台灣勞基法規定的預設假別資料（如果不存在的話）
INSERT INTO public.leave_types (code, name_zh, name_en, is_paid, annual_reset, max_days_per_year, requires_attachment, is_system_default, sort_order, description)
VALUES 
  ('annual', '特別休假', 'Annual Leave', true, true, NULL, false, true, 1, '依年資自動計算，勞基法第38條規定'),
  ('sick', '病假', 'Sick Leave', true, true, 30, true, true, 2, '每年最多30天，前30天半薪，需檢附證明'),
  ('personal', '事假', 'Personal Leave', false, true, NULL, false, true, 3, '無薪假，需主管核准'),
  ('marriage', '婚假', 'Marriage Leave', true, false, 8, true, true, 4, '一次性給假8天，需檢附證明'),
  ('bereavement', '喪假', 'Bereavement Leave', true, true, NULL, true, true, 5, '依親屬關係給假3-8天，需檢附證明'),
  ('maternity', '產假', 'Maternity Leave', true, false, 56, true, true, 6, '產假8週（56天），限女性員工'),
  ('paternity', '陪產假', 'Paternity Leave', true, true, 7, false, true, 7, '陪產假7天，限男性員工'),
  ('parental', '育嬰留停', 'Parental Leave', false, false, NULL, true, true, 8, '每名子女最長2年，無薪'),
  ('menstrual', '生理假', 'Menstrual Leave', true, true, NULL, false, true, 9, '每月1日，限女性員工，併入病假計算'),
  ('occupational', '公傷病假', 'Occupational Injury Leave', true, false, NULL, true, true, 10, '職業災害病假，需檢附職災證明'),
  ('other', '其他假別', 'Other Leave', false, true, NULL, false, true, 11, '自定義請假類型，需主管審核')
ON CONFLICT (code) DO NOTHING;
