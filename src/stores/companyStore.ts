import { Company } from '@/types/company';
import { create } from 'zustand';

interface CompanyState {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}

export const useCompanyStore = create<CompanyState>()(set => ({
  company: null,
  setCompany: company => set({ company }),
}));
