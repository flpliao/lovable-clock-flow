
-- 創建獲取加班申請主管階層的函數，完全比照請假系統
CREATE OR REPLACE FUNCTION get_overtime_supervisor_hierarchy(staff_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    hierarchy JSONB := '[]'::JSONB;
    current_staff_id UUID := staff_uuid;
    supervisor_info RECORD;
    level_count INTEGER := 0;
    max_levels INTEGER := 5; -- 防止無窮迴圈
BEGIN
    -- 建構主管階層鏈
    WHILE current_staff_id IS NOT NULL AND level_count < max_levels LOOP
        -- 查找當前員工的直屬主管
        SELECT 
            s.supervisor_id,
            sup.name as supervisor_name,
            sup.position as supervisor_position,
            sup.department as supervisor_department
        INTO supervisor_info
        FROM public.staff s
        LEFT JOIN public.staff sup ON s.supervisor_id = sup.id
        WHERE s.id = current_staff_id;
        
        -- 如果找到主管，加入階層中
        IF supervisor_info.supervisor_id IS NOT NULL THEN
            hierarchy := hierarchy || jsonb_build_object(
                'level', level_count + 1,
                'supervisor_id', supervisor_info.supervisor_id,
                'supervisor_name', supervisor_info.supervisor_name,
                'supervisor_position', supervisor_info.supervisor_position,
                'supervisor_department', supervisor_info.supervisor_department
            );
            
            current_staff_id := supervisor_info.supervisor_id;
            level_count := level_count + 1;
        ELSE
            -- 沒有更多主管，結束迴圈
            current_staff_id := NULL;
        END IF;
    END LOOP;
    
    RETURN hierarchy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
