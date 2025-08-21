import React from 'react';

interface FeatureNumberProps {
  number: number;
  iconBg: string;
  iconColor: string;
}

const FeatureNumber: React.FC<FeatureNumberProps> = ({ number, iconBg, iconColor }) => {
  return (
    <div
      className={`w-8 h-8 ${iconBg} rounded-full shadow-sm ${iconColor} group-hover:shadow-md transition-all duration-300 ml-2 flex items-center justify-center`}
    >
      <span className="text-sm font-bold">{number}</span>
    </div>
  );
};

export default FeatureNumber;
