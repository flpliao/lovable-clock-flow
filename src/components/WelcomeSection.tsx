
import React from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="bg-white py-6 px-4">
      <div className="max-w-sm mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Hello! <span className="text-blue-600">{userName}</span>
        </h1>
        <p className="text-gray-500">祝你有美好的一天</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
