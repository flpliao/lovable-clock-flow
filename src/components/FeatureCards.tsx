
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';

interface FeatureCardProps {
  abnormalCount?: number;
  annualLeaveBalance?: number;
}

const FeatureCards: React.FC<FeatureCardProps> = ({ abnormalCount = 0, annualLeaveBalance = 216 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 px-5">
      <Card className="bg-gray-50 p-5 rounded-lg relative overflow-hidden">
        <div className="absolute top-2 right-2 h-16 w-16 rounded-full bg-white flex items-center justify-center">
          <Clock className="h-8 w-8 text-[#0091D0]" />
        </div>
        <div className="mt-16">
          <h3 className="text-lg font-semibold">個人出勤</h3>
          <p className="text-[#7A8999]">
            你有 <span className="font-bold text-black">{abnormalCount}</span> 異常
          </p>
        </div>
      </Card>
      
      <Link to="/leave-request">
        <Card className="bg-gray-50 p-5 rounded-lg relative overflow-hidden hover:bg-gray-100 transition-colors">
          <div className="absolute top-2 right-2 h-16 w-16 rounded-full bg-white flex items-center justify-center">
            <Calendar className="h-8 w-8 text-[#0091D0]" />
          </div>
          <div className="mt-16">
            <h3 className="text-lg font-semibold">請假</h3>
            <p className="text-[#7A8999]">
              特休 <span className="font-bold text-black">{annualLeaveBalance}</span> 時
            </p>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default FeatureCards;
