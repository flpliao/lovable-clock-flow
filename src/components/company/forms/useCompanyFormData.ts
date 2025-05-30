
import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { CompanyDataService } from '../services/companyDataService';

export const useCompanyFormData = (company: Company | null, isDialogOpen: boolean) => {
  const [editedCompany, setEditedCompany] = useState<Partial<Company>>({
    name: '',
    registration_number: '',
    legal_representative: '',
    business_type: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    established_date: '',
    capital: null
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      if (company) {
        console.log('useCompanyFormData - 使用傳入的公司資料:', company);
        initializeFormData(company);
      } else {
        console.log('useCompanyFormData - 沒有傳入公司資料，從資料庫載入...');
        loadCompanyFromDatabase();
      }
    }
  }, [company, isDialogOpen]);

  const initializeFormData = (companyData: Company) => {
    console.log('useCompanyFormData - 初始化表單資料:', companyData);
    setEditedCompany({
      name: companyData.name || '',
      registration_number: companyData.registration_number || '',
      legal_representative: companyData.legal_representative || '',
      business_type: companyData.business_type || '',
      address: companyData.address || '',
      phone: companyData.phone || '',
      email: companyData.email || '',
      website: companyData.website || '',
      established_date: companyData.established_date || '',
      capital: companyData.capital || null
    });
  };

  const loadCompanyFromDatabase = async () => {
    setIsLoading(true);
    try {
      console.log('useCompanyFormData - 從資料庫載入公司資料...');
      const companyData = await CompanyDataService.findCompany();
      
      if (companyData) {
        console.log('useCompanyFormData - 成功載入公司資料:', companyData);
        initializeFormData(companyData);
      } else {
        console.log('useCompanyFormData - 資料庫中沒有找到公司資料，使用空白表單');
        // 保持空白表單
      }
    } catch (error) {
      console.error('useCompanyFormData - 載入公司資料失敗:', error);
      // 保持空白表單
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormData = () => {
    if (company) {
      initializeFormData(company);
    } else {
      setEditedCompany({
        name: '',
        registration_number: '',
        legal_representative: '',
        business_type: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        established_date: '',
        capital: null
      });
    }
  };

  return {
    editedCompany,
    setEditedCompany,
    resetFormData,
    isLoading
  };
};
