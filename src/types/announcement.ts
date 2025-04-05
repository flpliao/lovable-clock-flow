
export interface CompanyAnnouncement {
  id: string;
  title: string;
  content: string;
  file?: {
    url: string;
    name: string;
    type: string;
  };
  created_at: string;
  created_by: {
    id: string;
    name: string;
  };
  company_id: string;
  is_pinned: boolean;
  is_active: boolean;
  category?: string;
}

export interface AnnouncementRead {
  user_id: string;
  announcement_id: string;
  read_at: string;
}

export type AnnouncementCategory = 'HR' | 'Administration' | 'Meeting' | 'Official' | 'General';
