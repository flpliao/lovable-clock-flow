
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id: string;
  name: string;
  type: 'headquarters' | 'branch' | 'store';
  location?: string;
  manager_name?: string;
  manager_contact?: string;
  staff_count: number;
  created_at?: string;
  updated_at?: string;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        console.log('📋 員工管理：載入部門資料...');
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ 員工管理：載入部門資料失敗:', error);
          return;
        }

        const transformedData = data ? data.map(item => ({
          ...item,
          type: item.type as 'headquarters' | 'branch' | 'store'
        })) : [];

        setDepartments(transformedData);
        console.log('✅ 員工管理：部門資料載入成功');
      } catch (error) {
        console.error('❌ 員工管理：載入部門資料系統錯誤:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const getDepartmentNames = () => {
    return departments.map(dept => dept.name);
  };

  const getDepartmentById = (id: string) => {
    return departments.find(dept => dept.id === id);
  };

  const getDepartmentByName = (name: string) => {
    return departments.find(dept => dept.name === name);
  };

  return {
    departments,
    loading,
    getDepartmentNames,
    getDepartmentById,
    getDepartmentByName
  };
};
