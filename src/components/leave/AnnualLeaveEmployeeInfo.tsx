
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { User } from '@/types';

interface AnnualLeaveEmployeeInfoProps {
  currentUser: User;
  formattedYears: string;
}

export function AnnualLeaveEmployeeInfo({ currentUser, formattedYears }: AnnualLeaveEmployeeInfoProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <div>
          <p className="text-sm text-white/70 font-medium mb-1">員工姓名</p>
          <p className="text-white font-semibold text-lg">{currentUser.name || '未設定'}</p>
        </div>
        <div>
          <p className="text-sm text-white/70 font-medium mb-1">部門職位</p>
          <p className="text-white font-semibold">{currentUser.department || '未設定'} / {currentUser.position || '未設定'}</p>
        </div>
        <div>
          <p className="text-sm text-white/70 font-medium mb-1">年資</p>
          <p className="text-white font-semibold flex items-center justify-center md:justify-start gap-1">
            <TrendingUp className="h-4 w-4" />
            {formattedYears}
          </p>
        </div>
      </div>
    </div>
  );
}
