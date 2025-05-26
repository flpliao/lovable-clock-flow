
import React from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="px-5 py-6">
      <h1 className="text-3xl font-bold text-[#333333]">
        Hello! <span className="text-[#333333]">{userName}</span>
      </h1>
      <p className="text-[#7A8999] text-lg mt-2">祝你有美好的一天</p>
    </div>
  );
};

export default WelcomeSection;
