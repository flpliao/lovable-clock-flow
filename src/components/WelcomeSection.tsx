
import React from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="py-4 sm:py-5">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#333333]">
        Hello! <span className="text-[#333333]">{userName}</span>
      </h1>
      <p className="text-[#7A8999] text-base sm:text-lg mt-1">祝你有美好的一天</p>
    </div>
  );
};

export default WelcomeSection;
