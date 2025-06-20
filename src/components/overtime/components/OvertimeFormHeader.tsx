
import React from 'react';
import { Clock } from 'lucide-react';

const OvertimeFormHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
          <Clock className="h-8 w-8 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
          申請加班
        </h2>
        <p className="text-white/80 text-base font-medium drop-shadow-md">
          請填寫以下資訊提交加班申請
        </p>
      </div>
    </div>
  );
};

export default OvertimeFormHeader;
