import { useToast } from '@/hooks/use-toast';
import { Branch, Company, CompanyManagementContextType, NewBranch } from '@/types/company';
import { useCallback, useEffect, useState } from 'react';
import { useBranchOperations } from './hooks/useBranchOperations';
import { useCompanyOperations } from './hooks/useCompanyOperations';

export const useCompanyManagement = (): CompanyManagementContextType => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: '',
    code: '',
    type: 'branch',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    manager_contact: '',
    business_license: '',
  });

  const { toast } = useToast();

  // 使用 useCompanyOperations 來獲取公司資料
  const { company, updateCompany, loading, loadCompany, forceSyncFromBackend } =
    useCompanyOperations();

  const {
    branches: branchList,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch,
  } = useBranchOperations(company?.id || '');

  // 同步分支列表
  useEffect(() => {
    console.log('🔄 useCompanyManagement: 同步分支列表:', branchList?.length || 0);
    setBranches(branchList);
    setFilteredBranches(branchList);
  }, [branchList]);

  // 當公司ID存在時載入分支
  useEffect(() => {
    if (company?.id) {
      console.log('🏪 useCompanyManagement: 公司ID存在，載入分支資料:', company.id);
      loadBranches();
    }
  }, [company?.id, loadBranches]);

  const handleAddBranch = useCallback(async () => {
    console.log('🚀 useCompanyManagement: handleAddBranch 開始');
    console.log('📋 useCompanyManagement: 當前公司資料:', company);
    console.log('🆔 useCompanyManagement: 公司ID:', company?.id);

    if (!company?.id) {
      console.error('❌ useCompanyManagement: 沒有公司ID，無法新增單位');
      toast({
        title: '錯誤',
        description: '請先設定公司資料',
        variant: 'destructive',
      });
      return;
    }

    console.log('✅ useCompanyManagement: 公司ID存在，開始新增單位');
    console.log('📋 useCompanyManagement: 新增的單位資料:', newBranch);

    const success = await addBranch(newBranch);
    if (success) {
      console.log('✅ useCompanyManagement: 單位新增成功');
      toast({
        title: '新增成功',
        description: '單位已成功新增',
      });
      setIsAddBranchDialogOpen(false);
      setNewBranch({
        name: '',
        code: '',
        type: 'branch',
        address: '',
        phone: '',
        email: '',
        manager_name: '',
        manager_contact: '',
        business_license: '',
      });
    } else {
      console.error('❌ useCompanyManagement: 單位新增失敗');
      toast({
        title: '新增失敗',
        description: '新增單位時發生錯誤，請重試',
        variant: 'destructive',
      });
    }
  }, [company?.id, newBranch, addBranch, toast]);

  const handleEditBranch = useCallback(async () => {
    if (!currentBranch) return;

    const success = await updateBranch(currentBranch.id, currentBranch);
    if (success) {
      setIsEditBranchDialogOpen(false);
      setCurrentBranch(null);
    }
  }, [currentBranch, updateBranch]);

  const handleDeleteBranch = useCallback(
    async (id: string) => {
      await deleteBranch(id);
    },
    [deleteBranch]
  );

  const handleUpdateCompany = useCallback(
    async (updatedCompany: Company): Promise<boolean> => {
      console.log('🔄 useCompanyManagement: 處理公司更新:', updatedCompany);

      try {
        const success = await updateCompany(updatedCompany);

        if (success) {
          console.log('✅ useCompanyManagement: 公司資料更新成功');
          return true;
        } else {
          console.log('❌ useCompanyManagement: 公司資料更新失敗');
          return false;
        }
      } catch (error) {
        console.error('❌ useCompanyManagement: 更新公司時發生錯誤:', error);
        toast({
          title: '更新失敗',
          description: `更新公司資料時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
          variant: 'destructive',
        });
        return false;
      }
    },
    [updateCompany, toast]
  );

  const openEditBranchDialog = useCallback((branch: Branch) => {
    setCurrentBranch(branch);
    setIsEditBranchDialogOpen(true);
  }, []);

  const getBranchByCode = useCallback(
    (code: string) => {
      return branches.find(branch => branch.code === code);
    },
    [branches]
  );

  const getActiveBranches = useCallback(() => {
    return branches.filter(branch => branch.is_active);
  }, [branches]);

  return {
    company,
    branches,
    filteredBranches,
    selectedBranch,
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    currentBranch,
    setCurrentBranch,
    newBranch,
    setNewBranch,
    handleAddBranch,
    handleEditBranch,
    handleDeleteBranch,
    handleUpdateCompany,
    openEditBranchDialog,
    getBranchByCode,
    getActiveBranches,
    loading,
    loadCompany,
    forceSyncFromBackend,
  };
};
