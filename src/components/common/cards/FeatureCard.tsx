import { FeatureCardProps } from '@/types/featureCard';
import React from 'react';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, rightContent, onClick }) => {
  const isClickable = onClick !== undefined;

  const cardClasses = `group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative w-full ${
    isClickable ? 'cursor-pointer' : ''
  }`;

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="p-4 relative overflow-hidden h-full bg-white/80 backdrop-blur-xl border border-white/40">
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg transition-colors duration-300 text-gray-600">
                {title}
              </h3>
              <p className="text-sm leading-relaxed font-medium text-gray-500">{description}</p>
            </div>
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
