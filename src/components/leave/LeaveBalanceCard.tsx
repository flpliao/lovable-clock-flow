
import React from 'react';
import { UserStaffData } from '@/services/staffDataService';
import { Calendar, Clock, User } from 'lucide-react';

interface LeaveBalanceCardProps {
  userStaffData: UserStaffData | null;
  hasHireDate: boolean;
  isLoading?: boolean;
}

export function LeaveBalanceCard({ userStaffData, hasHireDate, isLoading }: LeaveBalanceCardProps) {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/30 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
            <div className="h-3 bg-white/20 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userStaffData) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-white" />
          <h3 className="text-lg font-semibold text-white drop-shadow-md">員工資料</h3>
        </div>
        <p className="text-white/80">載入員工資料中...</p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">員工資料</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">姓名：</span>
            <span className="text-white/90">{userStaffData.name}</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">部門：</span>
            <span className="text-white/90">{userStaffData.department}</span>
          </div>
          <div className="flex justify-between items-center text-white">
            <span className="font-medium">職位：</span>
            <span className="text-white/90">{userStaffData.position}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-white">
            <span className="font-medium flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              入職日期：
            </span>
            <span className={`font-medium ${hasHireDate ? 'text-green-300' : 'text-orange-300'}`}>
              {hasHireDate ? userStaffData.hire_date : '未設定'}
            </span>
          </div>
          
          {hasHireDate && (
            <>
              <div className="flex justify-between items-center text-white">
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  年資：
                </span>
                <span className="text-blue-300 font-medium">{userStaffData.yearsOfService}</span>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">特休假餘額</span>
                  <span className="text-green-300 font-bold text-lg">
                    {userStaffData.remainingAnnualLeaveDays} 天
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(userStaffData.remainingAnnualLeaveDays / userStaffData.totalAnnualLeaveDays) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>已用: {userStaffData.usedAnnualLeaveDays} 天</span>
                  <span>總計: {userStaffData.totalAnnualLeaveDays} 天</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {!hasHireDate && (
        <div className="mt-4 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
          <p className="text-orange-200 text-sm flex items-center gap-2">
            <span>⚠️</span>
            請聯繫人事部門設定入職日期，以便正確計算特休天數
          </p>
        </div>
      )}
    </div>
  );
}
