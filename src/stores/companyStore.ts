import { Company } from '@/types/company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CompanyState {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>()(
  devtools(
    set => ({
      company: null,
      setCompany: company => set({ company }),
    }),
    { name: 'company-store' }
  )
);
