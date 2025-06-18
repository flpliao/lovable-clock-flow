import { useEffect, useState } from 'react';
import { Department, NewDepartment } from '../types';
import { useDepartmentState } from './useDepartmentState';
import { useDepartmentFetch } from './useDepartmentFetch';
import { useDepartmentCreate } from './useDepartmentCreate';
import { useDepartmentUpdate } from './useDepartmentUpdate';
import { useDepartmentDelete } from './useDepartmentDelete';
import { useDepartmentStaffCount } from './useDepartmentStaffCount';

export const useSupabaseDepartmentOperations = () => {
  const { loading, setLoading, departments, setDepartments } = useDepartmentState();
  const { fetchDepartments: baseFetchDepartments } = useDepartmentFetch();
  const { addDepartment: baseAddDepartment } = useDepartmentCreate();
  const { updateDepartment: baseUpdateDepartment } = useDepartmentUpdate();
  const { deleteDepartment: baseDeleteDepartment } = useDepartmentDelete();
  const { updateStaffCount } = useDepartmentStaffCount();
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchDepartments = async (): Promise<Department[]> => {
    try {
      console.log('🔄 廖俊雄開始載入後台部門資料...');
      console.log('🎯 特別檢查部門 ID: 56727091-50b7-4ef4-93f7-c3d09c91d537');
      setLoading(true);
      
      const transformedData = await baseFetchDepartments();
      console.log('📥 廖俊雄從後台載入的部門資料:', transformedData);
      
      // 檢查目標部門是否存在
      const targetExists = transformedData.some(dept => dept.id === '56727091-50b7-4ef4-93f7-c3d09c91d537');
      console.log('🎯 目標部門是否存在於載入結果:', targetExists);
      
      setDepartments(transformedData);
      return transformedData;
    } catch (error) {
      console.error('❌ 廖俊雄載入後台部門資料失敗:', error);
      setDepartments([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshDepartments = async (): Promise<void> => {
    console.log('🔄 廖俊雄觸發重新載入後台部門資料');
    console.log('🎯 強制重新檢查部門 ID: 56727091-50b7-4ef4-93f7-c3d09c91d537');
    
    // 先清空現有資料，強制重新載入
    setDepartments([]);
    await fetchDepartments();
  };

  // 初始化時載入資料
  useEffect(() => {
    if (!isInitialized) {
      console.log('🚀 廖俊雄初始化部門資料載入');
      
      // 設定較短的超時時間，避免永遠載入
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log('⏰ 載入超時，廖俊雄管理員強制結束載入狀態');
          setLoading(false);
          setDepartments([]);
        }
      }, 10000); // 增加到 10 秒超時，確保有足夠時間載入
      
      fetchDepartments().then((loadedDepartments) => {
        setIsInitialized(true);
        clearTimeout(timeoutId);
        console.log('✅ 廖俊雄部門資料初始化完成，載入部門數:', loadedDepartments.length);
        
        // 最終檢查目標部門
        const targetDepartment = loadedDepartments.find(dept => dept.id === '56727091-50b7-4ef4-93f7-c3d09c91d537');
        if (targetDepartment) {
          console.log('🎉 成功！目標部門已載入到前台:', targetDepartment.name);
        } else {
          console.log('⚠️ 注意：目標部門未出現在前台，需要檢查 RLS 政策或資料權限');
        }
      }).catch((error) => {
        console.log('❌ 廖俊雄初始化失敗，但系統繼續運作:', error);
        setIsInitialized(true);
        setLoading(false);
        clearTimeout(timeoutId);
      });
      
      return () => clearTimeout(timeoutId);
    }
  }, [isInitialized]);

  return {
    loading,
    departments,
    fetchDepartments,
    refreshDepartments,
    addDepartment: async (newDepartment: NewDepartment): Promise<boolean> => {
      try {
        setLoading(true);
        console.log('➕ 廖俊雄新增部門到後台:', newDepartment);
        const success = await baseAddDepartment(newDepartment);
        if (success) {
          console.log('✅ 廖俊雄部門新增成功，重新載入後台資料');
          await refreshDepartments();
        }
        return success;
      } finally {
        setLoading(false);
      }
    },
    updateDepartment: async (department: Department): Promise<boolean> => {
      try {
        setLoading(true);
        console.log('✏️ 廖俊雄更新部門到後台:', department);
        const success = await baseUpdateDepartment(department);
        if (success) {
          console.log('✅ 廖俊雄部門更新成功，重新載入後台資料');
          await refreshDepartments();
        }
        return success;
      } finally {
        setLoading(false);
      }
    },
    deleteDepartment: async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        console.log('🗑️ 廖俊雄從後台刪除部門:', id);
        const success = await baseDeleteDepartment(id);
        if (success) {
          console.log('✅ 廖俊雄部門刪除成功，重新載入後台資料');
          await refreshDepartments();
        }
        return success;
      } finally {
        setLoading(false);
      }
    },
    updateStaffCount
  };
};
