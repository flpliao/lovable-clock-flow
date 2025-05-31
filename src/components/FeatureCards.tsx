
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, ListChecks } from 'lucide-react';

interface FeatureCardProps {
  abnormalCount?: number;
  annualLeaveBalance?: number;
}

const FeatureCards: React.FC<FeatureCardProps> = ({ abnormalCount = 0, annualLeaveBalance = 216 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pb-4">
      <Link to="/personal-attendance">
        <Card className="bg-gray-50 p-4 sm:p-5 rounded-lg relative overflow-hidden hover:bg-gray-100 transition-colors">
          <div className="absolute top-2 right-2 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white flex items-center justify-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-[#0091D0]" />
          </div>
          <div className="mt-12 sm:mt-16">
            <h3 className="text-base sm:text-lg font-semibold">個人出勤</h3>
            <p className="text-sm sm:text-base text-[#7A8999]">
              你有 <span className="font-bold text-black">{abnormalCount}</span> 異常
            </p>
          </div>
        </Card>
      </Link>
      
      <Link to="/leave-request">
        <Card className="bg-gray-50 p-4 sm:p-5 rounded-lg relative overflow-hidden hover:bg-gray-100 transition-colors">
          <div className="absolute top-2 right-2 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white flex items-center justify-center">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-[#0091D0]" />
          </div>
          <div className="mt-12 sm:mt-16">
            <h3 className="text-base sm:text-lg font-semibold">請假</h3>
            <p className="text-sm sm:text-base text-[#7A8999]">
              特休 <span className="font-bold text-black">{annualLeaveBalance}</span> 時
            </p>
          </div>
        </Card>
      </Link>

      <Link to="/scheduling">
        <Card className="bg-gray-50 p-4 sm:p-5 rounded-lg relative overflow-hidden hover:bg-gray-100 transition-colors">
          <div className="absolute top-2 right-2 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white flex items-center justify-center">
            <ListChecks className="h-6 w-6 sm:h-8 sm:w-8 text-[#0091D0]" />
          </div>
          <div className="mt-12 sm:mt-16">
            <h3 className="text-base sm:text-lg font-semibold">排班管理</h3>
            <p className="text-sm sm:text-base text-[#7A8999]">
              安排 <span className="font-bold text-black">員工班表</span>
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default FeatureCards;
