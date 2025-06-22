
-- 創建或更新 leave_types 資料表
DROP TABLE IF EXISTS public.leave_types CASCADE;

CREATE TABLE public.leave_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  annual_reset BOOLEAN NOT NULL DEFAULT true,
  max_days_per_year INTEGER,
  max_days_per_month INTEGER,
  requires_attachment BOOLEAN NOT NULL DEFAULT false,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  gender_restriction TEXT CHECK (gender_restriction IN ('male', 'female')),
  description TEXT,
  special_rules JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 插入台灣勞基法標準假別
INSERT INTO public.leave_types (
  code, name_zh, name_en, is_paid, annual_reset, max_days_per_year, max_days_per_month,
  requires_attachment, requires_approval, gender_restriction, description, special_rules, 
  is_system_default, sort_order
) VALUES
-- 特別休假 (保留現有邏輯)
('annual', '特別休假', 'Annual Leave', true, true, NULL, NULL, false, false, NULL, 
 '依年資自動計算天數（每年3～30日）', 
 '{"calculation_type": "seniority_based", "law_reference": "勞基法第38條"}', 
 true, 1),

-- 事假
('personal', '事假', 'Personal Leave', false, true, NULL, NULL, false, true, NULL,
 '無薪假，不限天數但不得影響工作', 
 '{"paid_status": "unpaid", "law_reference": "勞基法第43條"}', 
 true, 2),

-- 病假
('sick', '病假', 'Sick Leave', true, true, 30, NULL, true, true, NULL,
 '每年合計未超過30日給半薪，超過30天不給薪', 
 '{"pay_rate": 0.5, "max_paid_days": 30, "law_reference": "勞基法第59條"}', 
 true, 3),

-- 婚假
('marriage', '婚假', 'Marriage Leave', true, false, 8, NULL, true, false, NULL,
 '8日婚假，於結婚日前後可申請', 
 '{"once_only": true, "law_reference": "勞基法第2條"}', 
 true, 4),

-- 喪假
('bereavement', '喪假', 'Bereavement Leave', true, true, NULL, NULL, true, true, NULL,
 '依親屬關係：配偶/父母/子女8日；祖父母/兄弟姊妹/配偶父母3日', 
 '{"relationship_based": true, "relationships": {"spouse": 8, "parent": 8, "child": 8, "grandparent": 3, "sibling": 3, "spouse_parent": 3}}', 
 true, 5),

-- 產假
('maternity', '產假', 'Maternity Leave', true, false, 56, NULL, true, true, 'female',
 '產假8週（56日），產前可請，需上傳預產期證明', 
 '{"weeks": 8, "pre_birth_allowed": true, "law_reference": "勞基法第50條"}', 
 true, 6),

-- 陪產假
('paternity', '陪產假', 'Paternity Leave', true, false, 7, NULL, false, true, 'male',
 '配偶懷孕或生產時可請7日陪產假', 
 '{"law_reference": "性別工作平等法第15條"}', 
 true, 7),

-- 生理假
('menstrual', '生理假', 'Menstrual Leave', true, true, 12, 1, false, true, 'female',
 '每月1日，前3日半薪，限女性員工', 
 '{"pay_rate": 0.5, "max_paid_days": 3, "monthly_limit": 1, "law_reference": "性別工作平等法第14條"}', 
 true, 8),

-- 公傷病假
('occupational', '公傷病假', 'Occupational Injury Leave', true, false, NULL, NULL, true, true, NULL,
 '職業災害造成之傷病假，需職災認定證明', 
 '{"requires_certification": true, "law_reference": "勞基法第59條"}', 
 true, 9),

-- 育嬰留停
('parental', '育嬰留停', 'Parental Leave', false, false, NULL, NULL, true, true, NULL,
 '至子女滿3歲前，需有6個月以上年資', 
 '{"min_seniority_months": 6, "max_child_age": 3, "law_reference": "性別工作平等法第16條"}', 
 true, 10),

-- 其他
('other', '其他假別', 'Other Leave', false, true, NULL, NULL, false, true, NULL,
 '其他自定假別，無薪', 
 '{"custom": true}', 
 true, 11);

-- 啟用 RLS
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策 - 所有人都可以查看假別設定
CREATE POLICY "Everyone can view leave types" 
  ON public.leave_types 
  FOR SELECT 
  USING (true);

-- 只有管理員可以修改假別設定
CREATE POLICY "Admin can manage leave types" 
  ON public.leave_types 
  FOR ALL 
  USING (is_admin_user());

-- 創建觸發器更新 updated_at
CREATE TRIGGER update_leave_types_updated_at
  BEFORE UPDATE ON public.leave_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
