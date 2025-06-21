
import React from 'react';
import { User } from '@/types';

interface EmployeeInfoSectionProps {
  currentUser: User | null;
}

export function EmployeeInfoSection({ currentUser }: EmployeeInfoSectionProps) {
  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">員工資訊</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-white/70 font-medium">員工姓名</p>
          <p className="text-white font-semibold">{currentUser?.name || '未知'}</p>
        </div>
        <div>
          <p className="text-sm text-white/70 font-medium">部門</p>
          <p className="text-white font-semibold">{currentUser?.department || '未指定'}</p>
        </div>
      </div>
    </div>
  );
}
