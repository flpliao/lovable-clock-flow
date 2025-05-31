
import { supabase } from '@/integrations/supabase/client';
import { Position, NewPosition } from '../types';

export const positionApiService = {
  // 獲取所有職位
  async getPositions(): Promise<Position[]> {
    console.log('📋 正在從 Supabase 載入職位資料...');
    
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .eq('is_active', true)
      .order('level', { ascending: false });

    if (error) {
      console.error('❌ 載入職位資料失敗:', error);
      throw error;
    }

    console.log('✅ 職位資料載入成功:', data?.length || 0, '筆');
    return data || [];
  },

  // 新增職位
  async addPosition(position: NewPosition): Promise<Position> {
    console.log('📝 正在新增職位:', position);
    
    const { data, error } = await supabase
      .from('positions')
      .insert({
        name: position.name,
        description: position.description,
        level: position.level
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 新增職位失敗:', error);
      throw error;
    }

    console.log('✅ 職位新增成功:', data);
    return data;
  },

  // 更新職位
  async updatePosition(position: Position): Promise<Position> {
    console.log('📝 正在更新職位:', position);
    
    const { data, error } = await supabase
      .from('positions')
      .update({
        name: position.name,
        description: position.description,
        level: position.level,
        updated_at: new Date().toISOString()
      })
      .eq('id', position.id)
      .select()
      .single();

    if (error) {
      console.error('❌ 更新職位失敗:', error);
      throw error;
    }

    console.log('✅ 職位更新成功:', data);
    return data;
  },

  // 刪除職位（軟刪除）
  async deletePosition(id: string): Promise<void> {
    console.log('🗑️ 正在刪除職位:', id);
    
    const { error } = await supabase
      .from('positions')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('❌ 刪除職位失敗:', error);
      throw error;
    }

    console.log('✅ 職位刪除成功');
  }
};
