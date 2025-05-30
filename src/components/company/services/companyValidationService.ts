
import { Company } from '@/types/company';

export class CompanyValidationService {
  static validateCompanyData(company: Company): { isValid: boolean; missingFields: string[] } {
    const requiredFields = ['name', 'registration_number', 'address', 'phone', 'email', 'business_type', 'legal_representative'];
    const missingFields = requiredFields.filter(field => {
      const value = company[field as keyof Company];
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  static validateRegistrationNumber(registrationNumber: string): boolean {
    const cleanNumber = registrationNumber.toString().trim();
    return /^\d{8}$/.test(cleanNumber);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  static getValidationErrorMessage(missingFields: string[]): string {
    const fieldNames = {
      name: '公司名稱',
      registration_number: '統一編號',
      address: '公司地址',
      phone: '公司電話',
      email: '公司Email',
      business_type: '營業項目',
      legal_representative: '法定代表人'
    };
    const missingFieldNames = missingFields.map(field => fieldNames[field as keyof typeof fieldNames]).join('、');
    return `缺少必填欄位: ${missingFieldNames}`;
  }
}
