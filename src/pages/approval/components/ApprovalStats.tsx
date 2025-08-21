import { FeatureCard } from '@/components/common/cards';
import { FeatureCardProps } from '@/types/featureCard';
import React from 'react';

interface ApprovalStatsProps {
  cards: FeatureCardProps[];
}

const ApprovalStats: React.FC<ApprovalStatsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <FeatureCard
          key={index}
          title={card.title}
          description={card.description}
          rightContent={card.rightContent}
          onClick={card.onClick}
        />
      ))}
    </div>
  );
};

export default ApprovalStats;
