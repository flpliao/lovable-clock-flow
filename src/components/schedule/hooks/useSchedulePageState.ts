import { useState } from 'react';

export const useSchedulePageState = () => {
  const [viewMode, setViewMode] = useState<'own' | 'subordinates' | 'all'>('own');

  return {
    viewMode,
    setViewMode,
  };
};
