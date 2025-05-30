
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch } from '@/types/company';

export const useBranchOperations = (companyId: string) => {
  
  const loadBranches = useCallback(async () => {
    if (!companyId) return [];
    
    console.log('🔍 useBranchOperations: 載入分支機構...');
    
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useBranchOperations: 載入分支機構失敗:', error);
        return [];
      }

      console.log('✅ useBranchOperations: 載入分支機構成功:', data?.length || 0, '筆');
      return data as Branch[] || [];
    } catch (error) {
      console.error('💥 useBranchOperations: 載入分支機構時發生錯誤:', error);
      return [];
    }
  }, [companyId]);

  const addBranch = useCallback(async (branchData: NewBranch): Promise<boolean> => {
    if (!companyId) return false;
    
    console.log('➕ useBranchOperations: 新增分支機構:', branchData);
    
    try {
      const { error } = await supabase
        .from('branches')
        .insert({
          ...branchData,
          company_id: companyId
        });

      if (error) {
        console.error('❌ useBranchOperations: 新增分支機構失敗:', error);
        return false;
      }

      console.log('✅ useBranchOperations: 新增分支機構成功');
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 新增分支機構時發生錯誤:', error);
      return false;
    }
  }, [companyId]);

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
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 更新分支機構時發生錯誤:', error);
      return false;
    }
  }, []);

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
      return true;
    } catch (error) {
      console.error('💥 useBranchOperations: 刪除分支機構時發生錯誤:', error);
      return false;
    }
  }, []);

  return {
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  };
};
