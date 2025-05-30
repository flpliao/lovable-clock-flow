
import { Company } from '@/types/company';

export class CompanyDataPreparer {
  static prepareCompanyData(company: Company) {
    return {
      name: company.name.trim(),
      registration_number: company.registration_number.toString().trim(),
      address: company.address.trim(),
      phone: company.phone.trim(),
      email: company.email.trim().toLowerCase(),
      website: company.website?.trim() || null,
      established_date: company.established_date || null,
      capital: company.capital ? Number(company.capital) : null,
      business_type: company.business_type.trim(),
      legal_representative: company.legal_representative.trim(),
      updated_at: new Date().toISOString()
    };
  }
}
