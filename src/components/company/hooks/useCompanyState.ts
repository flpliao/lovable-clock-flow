
import { useState } from 'react';
import { Company, Branch, NewBranch } from '@/types/company';
import { mockCompany, mockBranches } from '../mockData';

export const useCompanyState = () => {
  const [company, setCompany] = useState<Company | null>(mockCompany);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isEditCompanyDialogOpen, setIsEditCompanyDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: '',
    code: '',
    type: 'store',
    address: '',
    phone: '',
    email: '',
    manager_name: '',
    manager_contact: '',
    business_license: ''
  });

  return {
    company,
    setCompany,
    branches,
    setBranches,
    isAddBranchDialogOpen,
    setIsAddBranchDialogOpen,
    isEditBranchDialogOpen,
    setIsEditBranchDialogOpen,
    isEditCompanyDialogOpen,
    setIsEditCompanyDialogOpen,
    currentBranch,
    setCurrentBranch,
    newBranch,
    setNewBranch
  };
};
