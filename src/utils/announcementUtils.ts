
import { v4 as uuidv4 } from 'uuid';
import { CompanyAnnouncement, AnnouncementRead, AnnouncementCategory } from '@/types/announcement';
import { User } from '@/types';

// Mock data for company announcements
const mockAnnouncements: CompanyAnnouncement[] = [
  {
    id: '1',
    title: '公司年度旅遊計劃',
    content: '親愛的同仁們，我們將在下個月舉辦年度旅遊活動，請盡快回覆是否參加，並選擇您喜歡的旅遊方案。詳情請參閱附件。',
    file: {
      url: 'https://example.com/files/company_trip.pdf',
      name: 'company_trip.pdf',
      type: 'application/pdf'
    },
    created_at: '2025-03-15T09:00:00Z',
    created_by: {
      id: '1',
      name: '林總經理'
    },
    company_id: '1',
    is_pinned: true,
    is_active: true,
    category: 'Administration'
  },
  {
    id: '2',
    title: '新員工入職通知',
    content: '請大家歡迎新同事王小明加入我們的團隊，他將在市場部擔任高級營銷專員。',
    created_at: '2025-03-10T14:30:00Z',
    created_by: {
      id: '2',
      name: '陳人資'
    },
    company_id: '1',
    is_pinned: false,
    is_active: true,
    category: 'HR'
  },
  {
    id: '3',
    title: '辦公室搬遷公告',
    content: '因公司業務發展需要，我們將於下個月搬遷至新的辦公地點。新地址：台北市信義區信義路5段7號101大樓15樓。搬遷日期：2025年5月1日。當天請大家不要來舊辦公室，直接去新辦公室報到。',
    file: {
      url: 'https://example.com/files/office_relocation.docx',
      name: 'office_relocation.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    created_at: '2025-03-05T11:15:00Z',
    created_by: {
      id: '3',
      name: '張行政'
    },
    company_id: '1',
    is_pinned: true,
    is_active: true,
    category: 'Administration'
  },
  {
    id: '4',
    title: '系統維護通知',
    content: '本公司內部系統將於本週六進行升級維護，預計維護時間為上午9點至下午3點。在此期間，系統將無法使用，請各位同仁提前做好工作安排。',
    created_at: '2025-03-01T16:45:00Z',
    created_by: {
      id: '4',
      name: '李資訊'
    },
    company_id: '1',
    is_pinned: false,
    is_active: true,
    category: 'Official'
  },
  {
    id: '5',
    title: '季度業績會議',
    content: '請各部門主管參加下週一上午10點在會議室A舉行的季度業績檢討會議，會議材料請提前準備。',
    created_at: '2025-02-28T09:30:00Z',
    created_by: {
      id: '1',
      name: '林總經理'
    },
    company_id: '1',
    is_pinned: false,
    is_active: true,
    category: 'Meeting'
  }
];

// Mock data for announcement reads
let announcementReads: AnnouncementRead[] = [];

// Get all announcements (for employees)
export const getActiveAnnouncements = (): CompanyAnnouncement[] => {
  // In a real app, filter by company_id and is_active
  return mockAnnouncements
    .filter(announcement => announcement.is_active)
    .sort((a, b) => {
      // First sort by is_pinned (pinned first)
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      // Then sort by created_at (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
};

// Get announcement by ID
export const getAnnouncementById = (id: string): CompanyAnnouncement | undefined => {
  return mockAnnouncements.find(announcement => announcement.id === id);
};

// Get all announcements (for admin)
export const getAllAnnouncements = (): CompanyAnnouncement[] => {
  return [...mockAnnouncements].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Add new announcement
export const addAnnouncement = (announcement: Omit<CompanyAnnouncement, 'id'>): CompanyAnnouncement => {
  const newAnnouncement: CompanyAnnouncement = {
    ...announcement,
    id: uuidv4()
  };
  
  mockAnnouncements.unshift(newAnnouncement);
  return newAnnouncement;
};

// Update announcement
export const updateAnnouncement = (announcement: CompanyAnnouncement): CompanyAnnouncement => {
  const index = mockAnnouncements.findIndex(a => a.id === announcement.id);
  if (index !== -1) {
    mockAnnouncements[index] = announcement;
  }
  return announcement;
};

// Delete announcement (set is_active to false)
export const deleteAnnouncement = (id: string): boolean => {
  const index = mockAnnouncements.findIndex(a => a.id === id);
  if (index !== -1) {
    mockAnnouncements[index].is_active = false;
    return true;
  }
  return false;
};

// Mark announcement as read
export const markAnnouncementAsRead = (userId: string, announcementId: string): void => {
  // Check if already read
  const existingRead = announcementReads.find(
    read => read.user_id === userId && read.announcement_id === announcementId
  );
  
  if (!existingRead) {
    announcementReads.push({
      user_id: userId,
      announcement_id: announcementId,
      read_at: new Date().toISOString()
    });
  }
};

// Check if announcement is read
export const isAnnouncementRead = (userId: string, announcementId: string): boolean => {
  return announcementReads.some(
    read => read.user_id === userId && read.announcement_id === announcementId
  );
};

// Get announcement reads by announcementId
export const getAnnouncementReads = (announcementId: string): AnnouncementRead[] => {
  return announcementReads.filter(read => read.announcement_id === announcementId);
};

// Search announcements
export const searchAnnouncements = (query: string, onlyActive: boolean = true): CompanyAnnouncement[] => {
  const lowerQuery = query.toLowerCase();
  return mockAnnouncements
    .filter(announcement => 
      (!onlyActive || announcement.is_active) &&
      (announcement.title.toLowerCase().includes(lowerQuery) || 
       announcement.content.toLowerCase().includes(lowerQuery))
    );
};

// Filter announcements by category
export const filterAnnouncementsByCategory = (
  category: AnnouncementCategory | 'all',
  onlyActive: boolean = true
): CompanyAnnouncement[] => {
  return mockAnnouncements.filter(announcement => 
    (!onlyActive || announcement.is_active) && 
    (category === 'all' || announcement.category === category)
  );
};

// Get announcement categories
export const getAnnouncementCategories = (): AnnouncementCategory[] => {
  return ['HR', 'Administration', 'Meeting', 'Official', 'General'];
};

// Format date from ISO string to user-friendly format
export const formatAnnouncementDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

// Check if file can be previewed
export const canPreviewFile = (fileType: string): boolean => {
  const previewableTypes = [
    'application/pdf', 
    'image/jpeg',
    'image/png', 
    'image/gif', 
    'image/webp'
  ];
  
  return previewableTypes.includes(fileType);
};
