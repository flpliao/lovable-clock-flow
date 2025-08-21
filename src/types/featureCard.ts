import React from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  rightContent: React.ReactNode;
  onClick?: () => void;
}
