
import React from 'react';
import { CompanyAnnouncement } from '@/types/announcement';
import { useIsMobile } from '@/hooks/use-mobile';
import AnnouncementMobileCard from './AnnouncementMobileCard';
import AnnouncementTable from './AnnouncementTable';

interface AnnouncementListViewProps {
  announcements: CompanyAnnouncement[];
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementListView: React.FC<AnnouncementListViewProps> = ({
  announcements,
  onView,
  onEdit
}) => {
  const isMobile = useIsMobile();

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">沒有找到符合條件的公告</p>
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
    />
  );
};

export default AnnouncementListView;
