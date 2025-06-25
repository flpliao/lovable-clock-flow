
import React from 'react';

export const OvertimeFormHeader: React.FC = () => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">
        申請加班
      </h2>
      <p className="text-white/80 font-medium drop-shadow-sm">
        請填寫以下資訊提交加班申請
      </p>
    </div>
  );
};
