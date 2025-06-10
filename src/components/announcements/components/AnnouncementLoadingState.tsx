
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { visionProStyles } from '@/utils/visionProStyles';

const AnnouncementLoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`p-6 ${visionProStyles.featureCard}`}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-12 bg-white/40" />
              <Skeleton className="h-5 w-16 bg-white/40" />
            </div>
            <Skeleton className="h-6 w-3/4 bg-white/40" />
            <Skeleton className="h-4 w-full bg-white/40" />
            <Skeleton className="h-4 w-2/3 bg-white/40" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-white/40" />
              <Skeleton className="h-8 w-20 bg-white/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementLoadingState;
