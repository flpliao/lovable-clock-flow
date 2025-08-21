import { supabase } from '@/integrations/supabase/client';

export interface Checkpoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  check_in_radius: number;
  created_at: string;
  disabled_at: string | null;
}

export class CheckpointService {
  static async loadCheckpoints(): Promise<Checkpoint[]> {
    const { data, error } = await supabase
      .from('checkpoints')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data as Checkpoint[];
  }

  static async addCheckpoint(
    payload: Omit<Checkpoint, 'id' | 'created_at'>
  ): Promise<Checkpoint[]> {
    const { data, error } = await supabase.from('checkpoints').insert([payload]).select();

    if (error) throw error;
    return data;
  }

  static async updateCheckpoint(id: number, payload: Partial<Checkpoint>): Promise<Checkpoint[]> {
    const { data, error } = await supabase
      .from('checkpoints')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  static async deleteCheckpoint(id: number): Promise<void> {
    const { error } = await supabase.from('checkpoints').delete().eq('id', id);

    if (error) throw error;
  }
}
