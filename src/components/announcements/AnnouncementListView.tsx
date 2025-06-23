
import React from 'react';
import { CompanyAnnouncement } from '@/types/announcement';
import { useIsMobile } from '@/hooks/use-mobile';
import AnnouncementMobileCard from './AnnouncementMobileCard';
import AnnouncementTable from './AnnouncementTable';
import { visionProStyles } from '@/utils/visionProStyles';

interface AnnouncementListViewProps {
  announcements: CompanyAnnouncement[];
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementListView: React.FC<AnnouncementListViewProps> = ({
  announcements,
  onView,
  onEdit,
  onDelete
}) => {
  const isMobile = useIsMobile();

  if (announcements.length === 0) {
    return (
      <div className={`text-center py-12 ${visionProStyles.glassBackground} rounded-2xl border border-white/30`}>
        <p className="text-white/70 font-medium drop-shadow-md">沒有找到符合條件的公告</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <AnnouncementMobileCard
            key={announcement.id}
            announcement={announcement}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <AnnouncementTable
      announcements={announcements}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default AnnouncementListView;
