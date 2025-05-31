
import React from 'react';
import { FileText, Pin, Eye, EyeOff } from 'lucide-react';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface AnnouncementCardProps {
  announcement: CompanyAnnouncement;
  isRead: boolean;
  onClick: (announcement: CompanyAnnouncement) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  isRead,
  onClick
}) => {
  // Function to truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Get category color based on category
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'HR':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Administration':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'Meeting':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'Official':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card 
      className={`mb-3 sm:mb-4 cursor-pointer transition-shadow hover:shadow-lg ${
        isRead ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'
      }`}
      onClick={() => onClick(announcement)}
    >
      <CardHeader className="pb-2 p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {announcement.is_pinned && (
                <Pin className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
              )}
              <CardTitle className="text-base sm:text-lg truncate">{announcement.title}</CardTitle>
            </div>
            <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
              {formatAnnouncementDate(announcement.created_at)} · {announcement.created_by.name}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            {announcement.category && (
              <Badge className={`text-xs ${getCategoryColor(announcement.category)}`}>
                {announcement.category}
              </Badge>
            )}
            {announcement.file && (
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            )}
            {isRead ? (
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            ) : (
              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        <p className="text-sm sm:text-base text-gray-600">{truncateContent(announcement.content)}</p>
      </CardContent>
      {announcement.file && (
        <CardFooter className="pt-0 p-3 sm:p-4 text-xs text-gray-500">
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            <span className="truncate">{announcement.file.name}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AnnouncementCard;
