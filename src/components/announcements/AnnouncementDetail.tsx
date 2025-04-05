
import React, { useEffect } from 'react';
import { Download, FileText, Calendar, User, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate, canPreviewFile } from '@/utils/announcementUtils';

interface AnnouncementDetailProps {
  announcement: CompanyAnnouncement | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
  announcement,
  isOpen,
  onClose,
  onMarkAsRead
}) => {
  // Mark as read when opened
  useEffect(() => {
    if (isOpen && announcement && onMarkAsRead) {
      onMarkAsRead(announcement.id);
    }
  }, [isOpen, announcement, onMarkAsRead]);

  if (!announcement) return null;

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
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {announcement.category && (
              <Badge className={getCategoryColor(announcement.category)}>
                {announcement.category}
              </Badge>
            )}
            <DialogTitle className="text-xl">{announcement.title}</DialogTitle>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-4 mt-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatAnnouncementDate(announcement.created_at)}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {announcement.created_by.name}
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 whitespace-pre-wrap">
          {announcement.content}
        </div>
        
        {announcement.file && (
          <div className="border-t pt-4">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">{announcement.file.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                className="flex items-center"
                onClick={() => window.open(announcement.file?.url, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                下載檔案
              </Button>
              
              {canPreviewFile(announcement.file.type) ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => window.open(announcement.file?.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  線上預覽
                </Button>
              ) : null}
            </div>
            
            {/* Preview for PDF files */}
            {announcement.file.type === 'application/pdf' && (
              <div className="mt-4 border rounded overflow-hidden h-[400px]">
                <iframe
                  src={announcement.file.url}
                  className="w-full h-full"
                  title={announcement.file.name}
                />
              </div>
            )}
            
            {/* Preview for image files */}
            {announcement.file.type.startsWith('image/') && (
              <div className="mt-4 border rounded overflow-hidden flex justify-center">
                <img
                  src={announcement.file.url}
                  alt={announcement.file.name}
                  className="max-h-[400px] object-contain"
                />
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            關閉
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetail;
