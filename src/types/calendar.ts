export type CalendarDayType = 'workday' | 'holiday';

export interface CalendarDayItem {
  slug?: string;
  date: string; // YYYY-MM-DD
  type: CalendarDayType;
  name?: string | null;
  description?: string | null;
  note?: string | null;
}

export interface CalendarItem {
  id?: number | string;
  slug: string;
  year: number;
  name: string;
  description?: string | null;
  calendarDays?: CalendarDayItem[];
}

export interface CalendarIndexParams {
  page?: number;
  per_page?: number;
  filter?: {
    year?: number | string;
    name?: string;
    all?: boolean;
  };
}
