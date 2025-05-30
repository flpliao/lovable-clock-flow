
import { useState, useEffect, useCallback } from 'react';
import { Company, Branch, NewBranch, CompanyManagementContextType } from '@/types/company';
import { useToast } from '@/hooks/use-toast';
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
    business_license: ''
  });

  const { toast } = useToast();
  
  // 使用 useCompanyOperations 來獲取公司資料
  const { company, updateCompany } = useCompanyOperations();
  
  const {
    branches: branchList,
    loadBranches,
    addBranch,
    updateBranch,
    deleteBranch
  } = useBranchOperations(company?.id || '');

  // 同步分支列表
  useEffect(() => {
    setBranches(branchList);
    setFilteredBranches(branchList);
  }, [branchList]);

  useEffect(() => {
    if (company?.id) {
      loadBranches();
    }
  }, [company?.id, loadBranches]);

  const handleAddBranch = useCallback(async () => {
    console.log('🚀 useCompanyManagement: handleAddBranch 開始');
    console.log('📋 useCompanyManagement: 當前公司資料:', company);
    console.log('🆔 useCompanyManagement: 公司ID:', company?.id);
    
    if (!company?.id) {
      console.error('❌ useCompanyManagement: 沒有公司ID，無法新增營業處');
      toast({
        title: "錯誤",
        description: "請先設定公司資料",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ useCompanyManagement: 公司ID存在，開始新增營業處');
    console.log('📋 useCompanyManagement: 新增的營業處資料:', newBranch);

    const success = await addBranch(newBranch);
    if (success) {
      console.log('✅ useCompanyManagement: 營業處新增成功');
      toast({
        title: "新增成功",
        description: "營業處已成功新增",
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
        business_license: ''
      });
    } else {
      console.error('❌ useCompanyManagement: 營業處新增失敗');
      toast({
        title: "新增失敗",
        description: "新增營業處時發生錯誤，請重試",
        variant: "destructive"
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

  const handleDeleteBranch = useCallback(async (id: string) => {
    await deleteBranch(id);
  }, [deleteBranch]);

  const handleUpdateCompany = useCallback(async (updatedCompany: Company): Promise<boolean> => {
    console.log('🔄 useCompanyManagement: 處理公司更新:', updatedCompany);
    
    try {
      const success = await updateCompany(updatedCompany);
      
      if (success) {
        console.log('✅ useCompanyManagement: 公司資料更新成功');
        toast({
          title: "更新成功",
          description: "公司資料已成功更新",
        });
        return true;
      } else {
        console.log('❌ useCompanyManagement: 公司資料更新失敗');
        return false;
      }
    } catch (error) {
      console.error('❌ useCompanyManagement: 更新公司時發生錯誤:', error);
      toast({
        title: "更新失敗",
        description: `更新公司資料時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      return false;
    }
  }, [updateCompany, toast]);

  const openEditBranchDialog = useCallback((branch: Branch) => {
    setCurrentBranch(branch);
    setIsEditBranchDialogOpen(true);
  }, []);

  const getBranchByCode = useCallback((code: string) => {
    return branches.find(branch => branch.code === code);
  }, [branches]);

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
    getActiveBranches
  };
};
