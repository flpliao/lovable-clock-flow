
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        console.log('🔄 從 Supabase 載入部門資料...');
        setLoading(true);
        
        const { data, error } = await supabase
          .from('departments')
          .select('name')
          .order('name', { ascending: true });

        if (error) {
          console.error('❌ 載入部門資料失敗:', error);
          // 如果載入失敗，使用備用的部門列表
          setDepartments([
            '人事部',
            '財務部', 
            '業務部',
            '技術部',
            '行銷部',
            '客服部',
            '總務部',
            '醫美診所-台南',
            '資訊'
          ]);
        } else {
          const departmentNames = data?.map(dept => dept.name) || [];
          console.log('✅ 成功載入部門資料:', departmentNames);
          setDepartments(departmentNames);
        }
      } catch (error) {
        console.error('💥 部門資料載入系統錯誤:', error);
        // 載入失敗時使用備用列表
        setDepartments([
          '人事部',
          '財務部', 
          '業務部',
          '技術部',
          '行銷部',
          '客服部',
          '總務部',
          '醫美診所-台南',
          '資訊'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const getDepartmentNames = () => departments;

  return {
    departments,
    getDepartmentNames,
    loading
  };
};
