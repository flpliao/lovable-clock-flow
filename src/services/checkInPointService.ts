import { supabase } from '@/integrations/supabase/client';

export interface CheckInPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  check_in_radius: number;
  created_at: string;
  disabled_at: string | null;
}

export class CheckInPointService {
  static async loadCheckInPoints(): Promise<CheckInPoint[]> {
    const { data, error } = await supabase
      .from('checkpoints')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data as CheckInPoint[];
  }

  static async addCheckInPoint(
    payload: Omit<CheckInPoint, 'id' | 'created_at'>
  ): Promise<CheckInPoint[]> {
    const { data, error } = await supabase
      .from('employee_check_in_points')
      .insert([payload])
      .select();

    if (error) throw error;
    return data;
  }

  static async updateCheckInPoint(
    id: number,
    payload: Partial<CheckInPoint>
  ): Promise<CheckInPoint[]> {
    const { data, error } = await supabase
      .from('employee_check_in_points')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  static async deleteCheckInPoint(id: number): Promise<void> {
    const { error } = await supabase.from('employee_check_in_points').delete().eq('id', id);

    if (error) throw error;
  }
}
