import React from 'react';

interface FeatureIconProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon, iconBg, iconColor }) => {
  return (
    <div
      className={`p-2 ${iconBg} rounded-full shadow-sm ${iconColor} group-hover:shadow-md transition-all duration-300 ml-2 flex items-center justify-center`}
    >
      {icon}
    </div>
  );
};

export default FeatureIcon;
