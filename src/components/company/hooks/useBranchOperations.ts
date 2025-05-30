
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch } from '@/types/company';

export const useBranchOperations = (companyId: string) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const loadBranches = useCallback(async () => {
    if (!companyId) {
      console.log('⚠️ useBranchOperations: 沒有公司ID，跳過載入分支機構');
      setBranches([]);
      return [];
    }
    
    console.log('🔍 useBranchOperations: 載入分支機構...', companyId);
    
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useBranchOperations: 載入分支機構失敗:', error);
        setBranches([]);
        return [];
      }

      console.log('✅ useBranchOperations: 載入分支機構成功:', data?.length || 0, '筆');
      const branchData = data as Branch[] || [];
      setBranches(branchData);
      return branchData;
    } catch (error) {
      console.error('💥 useBranchOperations: 載入分支機構時發生錯誤:', error);
      setBranches([]);
      return [];
    }
  }, [companyId]);

  const addBranch = useCallback(async (branchData: NewBranch): Promise<boolean> => {
    if (!companyId) {
      console.error('❌ useBranchOperations: 沒有公司ID，無法新增分支機構');
      return false;
    }
    
    console.log('➕ useBranchOperations: 新增分支機構:', branchData);
    
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert({
          ...branchData,
          company_id: companyId
        })
        .select()
        .single();

      if (error) {
        console.error('❌ useBranchOperations: 新增分支機構失敗:', error);
        return false;
      }

      console.log('✅ useBranchOperations: 新增分支機構成功');
      // 重新載入分支機構列表
      await loadBranches();
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 新增分支機構時發生錯誤:', error);
      return false;
    }
  }, [companyId, loadBranches]);

  const updateBranch = useCallback(async (branchId: string, branchData: Partial<Branch>): Promise<boolean> => {
    console.log('🔄 useBranchOperations: 更新分支機構:', branchId, branchData);
    
    try {
      const { error } = await supabase
        .from('branches')
        .update({
          ...branchData,
          updated_at: new Date().toISOString()
        })
        .eq('id', branchId);

      if (error) {
        console.error('❌ useBranchOperations: 更新分支機構失敗:', error);
        return false;
      }

      console.log('✅ useBranchOperations: 更新分支機構成功');
      // 重新載入分支機構列表
      await loadBranches();
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 更新分支機構時發生錯誤:', error);
      return false;
    }
  }, [loadBranches]);

  const deleteBranch = useCallback(async (branchId: string): Promise<boolean> => {
    console.log('🗑️ useBranchOperations: 刪除分支機構:', branchId);
    
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        console.error('❌ useBranchOperations: 刪除分支機構失敗:', error);
        return false;
      }

      console.log('✅ useBranchOperations: 刪除分支機構成功');
      // 重新載入分支機構列表
      await loadBranches();
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 刪除分支機構時發生錯誤:', error);
      return false;
    }
  }, [loadBranches]);

  // 當 companyId 變更時重新載入分支機構
  useEffect(() => {
    if (companyId) {
      loadBranches();
    }
  }, [companyId, loadBranches]);

  return {
    branches,
    setBranches,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  };
};
