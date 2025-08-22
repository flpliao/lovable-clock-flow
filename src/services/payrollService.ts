import { PayrollRecordService } from './payroll/payrollRecordService';
import { SalaryStructureService } from './payroll/salaryStructureService';
import { getAllLeaveTypes, createLeaveType, updateLeaveType } from './leaveTypeService';
import { PayrollStatsService } from './payroll/payrollStatsService';
import { PayrollApprovalService } from './payroll/payrollApprovalService';
import { PayrollPaymentService } from './payroll/payrollPaymentService';
import { Payroll, SalaryStructure } from '@/types/hr';
import { LeaveType } from '@/types/leaveType';

export class PayrollService {
  // 薪資發放記錄相關操作
  static async getPayrolls() {
    return PayrollRecordService.getPayrolls();
  }

  static async createPayroll(payrollData: Omit<Payroll, 'id' | 'created_at' | 'updated_at'>) {
    return PayrollRecordService.createPayroll(payrollData);
  }

  static async updatePayroll(id: string, updates: Partial<Payroll>) {
    return PayrollRecordService.updatePayroll(id, updates);
  }

  static async deletePayroll(id: string) {
    return PayrollRecordService.deletePayroll(id);
  }

  // 薪資結構相關操作
  static async getSalaryStructures() {
    return SalaryStructureService.getSalaryStructures();
  }

  static async createSalaryStructure(
    structureData: Omit<SalaryStructure, 'id' | 'created_at' | 'updated_at'>
  ) {
    return SalaryStructureService.createSalaryStructure(structureData);
  }

  static async updateSalaryStructure(id: string, updates: Partial<SalaryStructure>) {
    return SalaryStructureService.updateSalaryStructure(id, updates);
  }

  static async deleteSalaryStructure(id: string) {
    return SalaryStructureService.deleteSalaryStructure(id);
  }

  // 請假類型相關操作
  static async getLeaveTypes() {
    return getAllLeaveTypes();
  }

  static async createLeaveType(leaveTypeData: Partial<LeaveType>) {
    return createLeaveType(leaveTypeData);
  }

  static async updateLeaveType(id: string, updates: Partial<LeaveType>) {
    return updateLeaveType(id, updates);
  }

  // 統計相關
  static async getPayrollStats() {
    return PayrollStatsService.getPayrollStats();
  }

  // 核准相關操作
  static async approvePayroll(
    payrollId: string,
    approverId: string,
    approverName: string,
    comment?: string
  ) {
    return PayrollApprovalService.approvePayroll(payrollId, approverId, approverName, comment);
  }

  static async rejectPayroll(
    payrollId: string,
    approverId: string,
    approverName: string,
    comment: string
  ) {
    return PayrollApprovalService.rejectPayroll(payrollId, approverId, approverName, comment);
  }

  static async getApprovalHistory(payrollId: string) {
    return PayrollApprovalService.getApprovalHistory(payrollId);
  }

  // 發放相關操作
  static async markAsPaid(
    payrollId: string,
    paidBy: string,
    paidByName: string,
    paymentData: {
      paymentMethod: string;
      paymentReference?: string;
      comment?: string;
    }
  ) {
    return PayrollPaymentService.markAsPaid(payrollId, paidBy, paidByName, paymentData);
  }

  static async getPaymentHistory(payrollId: string) {
    return PayrollPaymentService.getPaymentHistory(payrollId);
  }

  static async getAllPayments() {
    return PayrollPaymentService.getAllPayments();
  }
}
