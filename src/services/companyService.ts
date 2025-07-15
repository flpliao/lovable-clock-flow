import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export const companyService = {
  async findCompany(): Promise<Company | null> {
    const { data, error } = await supabase.from('companies').select('*').single();
    if (error) return null;
    return data as Company;
  },
  async updateCompany(companyId: string, companyData: Partial<Company>): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', companyId)
      .select()
      .single();
    if (error) return null;
    return data as Company;
  },
  async deleteCompany(companyId: string): Promise<boolean> {
    const { error } = await supabase.from('companies').delete().eq('id', companyId);
    return !error;
  },
};
