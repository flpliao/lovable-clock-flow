
import { useState, useEffect } from 'react';
import { Company } from '@/types/company';

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

  useEffect(() => {
    if (isDialogOpen) {
      if (company) {
        console.log('編輯現有公司資料:', company);
        setEditedCompany({
          name: company.name || '',
          registration_number: company.registration_number || '',
          legal_representative: company.legal_representative || '',
          business_type: company.business_type || '',
          address: company.address || '',
          phone: company.phone || '',
          email: company.email || '',
          website: company.website || '',
          established_date: company.established_date || '',
          capital: company.capital || null
        });
      } else {
        console.log('新建公司資料');
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
    }
  }, [company, isDialogOpen]);

  const resetFormData = () => {
    if (company) {
      setEditedCompany({
        name: company.name || '',
        registration_number: company.registration_number || '',
        legal_representative: company.legal_representative || '',
        business_type: company.business_type || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        established_date: company.established_date || '',
        capital: company.capital || null
      });
    }
  };

  return {
    editedCompany,
    setEditedCompany,
    resetFormData
  };
};
