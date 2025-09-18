import { LeaveTypeCode } from '@/constants/leave';
import { useLeaveBalance } from '@/hooks/useLeaveBalance';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { AlertCircle, Calendar, Clock, User } from 'lucide-react';
import { useEffect } from 'react';

const EmployeeInfoCard = () => {
  const { employee } = useEmployeeStore();
  const { loadMyAnnualLeaveBalance, getBalanceByLeaveCode } = useLeaveBalance();
  const { leaveTypes } = useLeaveTypeStore();
  const hasStartDate = Boolean(employee.start_date);

  // 自動載入特休餘額
  useEffect(() => {
    if (hasStartDate && leaveTypes.length > 0) {
      loadMyAnnualLeaveBalance();
    }
  }, [hasStartDate, leaveTypes]);

  // 從 store 取得特休餘額
  const currentBalance = getBalanceByLeaveCode(employee.slug, LeaveTypeCode.ANNUAL);

  return (
    <div className="backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">員工資料</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">姓名：</span>
            <span className="text-white/90">{employee.name}</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">單位：</span>
            <span className="text-white/90">{employee.department?.name || '未設定'}</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">職位：</span>
            <span className="text-white/90">{employee.position || '未設定'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              到職日期：
            </span>
            <span className={`font-medium ${hasStartDate ? 'text-green-300' : 'text-white/90'}`}>
              {hasStartDate ? employee.start_date : '未設定'}
            </span>
          </div>

          {hasStartDate && (
            <>
              <div className="flex justify-between items-center text-white">
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  年資：
                </span>
                <span className="text-blue-400 font-medium">
                  {currentBalance?.seniority_years
                    ? `${currentBalance.seniority_years} 年`
                    : '計算中...'}
                </span>
              </div>

              {currentBalance && (
                <div className="bg-white/10 rounded-lg p-3 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">特休假餘額</span>
                    <span className="text-green-300 font-bold text-lg">
                      {currentBalance.remaining} 小時
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, currentBalance.total > 0 ? (currentBalance.remaining / currentBalance.total) * 100 : 0))}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>已用: {currentBalance.used} 小時</span>
                    <span>總計: {currentBalance.total} 小時</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!hasStartDate && (
        <div className="mt-4 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
          <p className="text-orange-200 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            請聯繫人事部門設定到職日期，以便正確計算特休時數
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeInfoCard;
