
import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanyAnnouncement } from '@/types/announcement';
import { formatAnnouncementDate } from '@/utils/announcementUtils';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { visionProStyles } from '@/utils/visionProStyles';

interface AnnouncementTableProps {
  announcements: CompanyAnnouncement[];
  onView: (announcement: CompanyAnnouncement) => void;
  onEdit: (announcement: CompanyAnnouncement) => void;
  onDelete?: (announcementId: string) => void;
}

const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  announcements,
  onView,
  onEdit,
  onDelete
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<CompanyAnnouncement | null>(null);

  const handleDeleteClick = (announcement: CompanyAnnouncement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (announcementToDelete && onDelete) {
      onDelete(announcementToDelete.id);
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <>
      <div className={`${visionProStyles.glassBackground} rounded-2xl overflow-hidden border border-white/30 shadow-2xl backdrop-blur-3xl`}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/10">
              <TableHead className="w-[300px] text-white/90 font-semibold drop-shadow-md">標題</TableHead>
              <TableHead className="text-white/90 font-semibold drop-shadow-md">分類</TableHead>
              <TableHead className="text-white/90 font-semibold drop-shadow-md">發布日期</TableHead>
              <TableHead className="text-white/90 font-semibold drop-shadow-md">發布者</TableHead>
              <TableHead className="text-center text-white/90 font-semibold drop-shadow-md">置頂</TableHead>
              <TableHead className="text-center text-white/90 font-semibold drop-shadow-md">狀態</TableHead>
              <TableHead className="text-center text-white/90 font-semibold drop-shadow-md">附件</TableHead>
              <TableHead className="text-right text-white/90 font-semibold drop-shadow-md">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id} className="border-white/20 hover:bg-white/10 transition-colors duration-200">
                <TableCell className="font-medium text-white drop-shadow-md">
                  <div className="truncate max-w-[280px]" title={announcement.title}>
                    {announcement.title}
                  </div>
                </TableCell>
                <TableCell>
                  {announcement.category ? (
                    <Badge className={`${visionProStyles.glassButton} border-white/40 text-white font-medium`}>
                      {announcement.category}
                    </Badge>
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </TableCell>
                <TableCell className="text-white/80 drop-shadow-md">{formatAnnouncementDate(announcement.created_at)}</TableCell>
                <TableCell className="text-white/80 drop-shadow-md">{announcement.created_by.name}</TableCell>
                <TableCell className="text-center">
                  {announcement.is_pinned ? (
                    <Badge className="bg-yellow-500/80 text-white border-yellow-400/50 font-medium">置頂</Badge>
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {announcement.is_active ? (
                    <Badge className="bg-green-500/80 text-white border-green-400/50 font-medium">啟用</Badge>
                  ) : (
                    <Badge className={`${visionProStyles.glassButton} border-white/40 text-white/60 font-medium`}>停用</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {announcement.file ? (
                    <Badge className={`${visionProStyles.glassButton} border-white/40 text-white font-medium`}>有附件</Badge>
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(announcement)}
                      className={`${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/20 transition-colors duration-200`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(announcement)}
                      className={`${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/20 transition-colors duration-200`}
                    >
                      編輯
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(announcement)}
                        className={`${visionProStyles.glassButton} border-red-400/40 text-red-300 hover:bg-red-500/20 transition-colors duration-200`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="確認刪除公告"
        description={`確定要刪除公告「${announcementToDelete?.title}」嗎？此操作無法復原。`}
      />
    </>
  );
};

export default AnnouncementTable;
