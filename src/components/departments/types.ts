export interface Department {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  gps_status?: string;
  created_at?: string;
  updated_at?: string;
  radius_meters?: number;
  branch_id?: string;
}
