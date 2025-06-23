
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ScheduleListView from './ScheduleListView';

interface ScheduleTabsContentProps {
  schedules: any[];
  getUserName: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

const ScheduleTabsContent = ({
  schedules,
  getUserName,
  canDeleteSchedule,
  onRemoveSchedule,
}: ScheduleTabsContentProps) => {
  return (
    <TabsContent value="list" className="mt-6">
      <ScheduleListView
        schedules={schedules}
        getUserName={getUserName}
        canDeleteSchedule={canDeleteSchedule}
        onRemoveSchedule={onRemoveSchedule}
      />
    </TabsContent>
  );
};

export default ScheduleTabsContent;
