
import { PayrollRecordService } from './payroll/payrollRecordService';
import { SalaryStructureService } from './payroll/salaryStructureService';
import { LeaveTypeService } from './payroll/leaveTypeService';
import { PayrollStatsService } from './payroll/payrollStatsService';

export class PayrollService {
  // 薪資發放記錄相關操作
  static async getPayrolls() {
    return PayrollRecordService.getPayrolls();
  }

  static async createPayroll(payrollData: any) {
    return PayrollRecordService.createPayroll(payrollData);
  }

  static async updatePayroll(id: string, updates: any) {
    return PayrollRecordService.updatePayroll(id, updates);
  }

  static async deletePayroll(id: string) {
    return PayrollRecordService.deletePayroll(id);
  }

  // 薪資結構相關操作
  static async getSalaryStructures() {
    return SalaryStructureService.getSalaryStructures();
  }

  static async createSalaryStructure(structureData: any) {
    return SalaryStructureService.createSalaryStructure(structureData);
  }

  static async updateSalaryStructure(id: string, updates: any) {
    return SalaryStructureService.updateSalaryStructure(id, updates);
  }

  static async deleteSalaryStructure(id: string) {
    return SalaryStructureService.deleteSalaryStructure(id);
  }

  // 請假類型相關操作
  static async getLeaveTypes() {
    return LeaveTypeService.getLeaveTypes();
  }

  static async createLeaveType(leaveTypeData: any) {
    return LeaveTypeService.createLeaveType(leaveTypeData);
  }

  static async updateLeaveType(id: string, updates: any) {
    return LeaveTypeService.updateLeaveType(id, updates);
  }

  // 統計相關
  static async getPayrollStats() {
    return PayrollStatsService.getPayrollStats();
  }
}
