import { supabase } from '@/integrations/supabase/client';
import { Staff } from '@/components/staff/types';
import { ROLE_ID_MAP } from '@/components/staff/constants/roleIdMap';
import {
  FilterApiService,
  ApiFilterRequest,
  ApiFilterResponse,
  FilterGroup,
  FilterCondition,
} from '@/components/common/AdvancedFilter/types';

// Supabase查詢建構器型別 - 使用更通用的型別
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseQuery = any;

// 建立反向對照表：中文角色名稱 → 英文role_id
const ROLE_NAME_TO_ID_MAP: Record<string, string> = Object.entries(ROLE_ID_MAP).reduce(
  (acc, [id, name]) => {
    acc[name] = id;
    return acc;
  },
  {} as Record<string, string>
);

export class StaffFilterApiService implements FilterApiService<Staff> {
  /**
   * 主要篩選方法 - 支援複雜條件查詢
   */
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Staff>> {
    console.log('🔍 StaffFilterApiService: 開始執行篩選查詢', request);

    try {
      const {
        conditionGroups,
        page = 1,
        pageSize = 50,
        sortBy = 'name',
        sortOrder = 'asc',
      } = request;

      // 建立基本查詢
      let query = supabase.from('staff').select('*', { count: 'exact' });

      // 套用篩選條件
      if (conditionGroups.length > 0 && this.hasValidConditions(conditionGroups)) {
        query = this.applyFilters(query, conditionGroups);
      }

      // 套用排序
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // 套用分頁
      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      // 執行查詢
      const { data, error, count } = await query;

      if (error) {
        console.error('❌ StaffFilterApiService: 查詢失敗:', error);
        throw new Error(`員工篩選查詢失敗: ${error.message}`);
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      const response: ApiFilterResponse<Staff> = {
        data: data || [],
        total,
        page,
        pageSize,
        totalPages,
      };

      console.log('✅ StaffFilterApiService: 查詢成功', {
        total,
        returned: data?.length || 0,
        page,
        pageSize,
      });

      return response;
    } catch (error) {
      console.error('❌ StaffFilterApiService: 系統錯誤:', error);
      throw error;
    }
  }

  /**
   * 檢查是否有有效的篩選條件
   */
  private hasValidConditions(conditionGroups: FilterGroup[]): boolean {
    return conditionGroups.some(group =>
      group.conditions.some(condition => condition.value.trim() !== '')
    );
  }

  /**
   * 將條件值轉換為資料庫查詢值
   */
  private convertConditionValue(field: string, value: string): string {
    // 處理 role_id 欄位的中文轉英文
    if (field === 'role_id') {
      // 如果輸入的是中文角色名稱，轉換為英文role_id
      const roleId = ROLE_NAME_TO_ID_MAP[value.trim()];
      if (roleId) {
        console.log(`🔄 角色篩選轉換: "${value}" → "${roleId}"`);
        return roleId;
      }

      // 如果輸入的已經是英文role_id，直接使用
      if (ROLE_ID_MAP[value.trim()]) {
        console.log(`✅ 角色篩選直接使用: "${value}"`);
        return value.trim();
      }

      console.warn(`⚠️ 未知的角色: "${value}"`);
      return value; // 保持原值，讓資料庫查詢處理
    }

    return value;
  }

  /**
   * 套用篩選條件到Supabase查詢
   */
  private applyFilters(query: SupabaseQuery, conditionGroups: FilterGroup[]): SupabaseQuery {
    // 處理多個條件組的AND/OR邏輯
    if (conditionGroups.length === 1) {
      // 單一條件組
      return this.applyGroupConditions(query, conditionGroups[0]);
    } else {
      // 多個條件組，需要用or()函數包裝
      const orConditions: string[] = [];

      conditionGroups.forEach((group, index) => {
        const groupCondition = this.buildGroupCondition(group);
        if (groupCondition) {
          if (index === 0 || group.groupLogic === 'OR') {
            orConditions.push(groupCondition);
          } else {
            // AND邏輯需要特別處理
            query = query.or(groupCondition);
          }
        }
      });

      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
      }

      return query;
    }
  }

  /**
   * 套用單一條件組
   */
  private applyGroupConditions(query: SupabaseQuery, group: FilterGroup): SupabaseQuery {
    const validConditions = group.conditions.filter(c => c.value.trim() !== '');

    if (validConditions.length === 0) return query;

    if (validConditions.length === 1) {
      // 單一條件
      return this.applySingleCondition(query, validConditions[0]);
    } else {
      // 多個條件，根據邏輯組合
      const andConditions: string[] = [];
      const orConditions: string[] = [];

      validConditions.forEach((condition, index) => {
        const conditionStr = this.buildConditionString(condition);
        if (conditionStr) {
          if (index === 0 || condition.logic === 'AND') {
            andConditions.push(conditionStr);
          } else {
            orConditions.push(conditionStr);
          }
        }
      });

      // 套用AND條件
      andConditions.forEach(condition => {
        query = this.applyConditionString(query, condition);
      });

      // 套用OR條件
      if (orConditions.length > 0) {
        query = query.or(orConditions.join(','));
      }

      return query;
    }
  }

  /**
   * 建立條件組字串（用於複雜OR查詢）
   */
  private buildGroupCondition(group: FilterGroup): string | null {
    const validConditions = group.conditions.filter(c => c.value.trim() !== '');
    if (validConditions.length === 0) return null;

    const conditionStrings = validConditions
      .map(condition => this.buildConditionString(condition))
      .filter(Boolean);

    if (conditionStrings.length === 0) return null;

    // 根據第一個條件的邏輯決定組合方式
    if (validConditions[0].logic === 'OR') {
      return `(${conditionStrings.join(',')})`;
    } else {
      // 對於AND邏輯，需要在上層處理
      return conditionStrings[0];
    }
  }

  /**
   * 套用單一條件
   */
  private applySingleCondition(query: SupabaseQuery, condition: FilterCondition): SupabaseQuery {
    const { field, operator, value } = condition;
    const convertedValue = this.convertConditionValue(field, value).trim();

    switch (operator) {
      case 'contains':
        return query.ilike(field, `%${convertedValue}%`);
      case 'equals':
        return query.eq(field, convertedValue);
      case 'not_equals':
        return query.neq(field, convertedValue);
      case 'starts_with':
        return query.ilike(field, `${convertedValue}%`);
      case 'ends_with':
        return query.ilike(field, `%${convertedValue}`);
      case 'empty':
        return query.or(`${field}.is.null,${field}.eq.`);
      case 'not_empty':
        return query.not(`${field}`, 'is', null).neq(field, '');
      default:
        console.warn(`不支援的運算子: ${operator}`);
        return query;
    }
  }

  /**
   * 建立條件字串
   */
  private buildConditionString(condition: FilterCondition): string | null {
    const { field, operator, value } = condition;
    const convertedValue = this.convertConditionValue(field, value).trim();

    switch (operator) {
      case 'contains':
        return `${field}.ilike.%${convertedValue}%`;
      case 'equals':
        return `${field}.eq.${convertedValue}`;
      case 'not_equals':
        return `${field}.neq.${convertedValue}`;
      case 'starts_with':
        return `${field}.ilike.${convertedValue}%`;
      case 'ends_with':
        return `${field}.ilike.%${convertedValue}`;
      case 'empty':
        return `${field}.is.null,${field}.eq.`;
      case 'not_empty':
        return `${field}.not.is.null`;
      default:
        console.warn(`不支援的運算子: ${operator}`);
        return null;
    }
  }

  /**
   * 套用條件字串到查詢
   */
  private applyConditionString(query: SupabaseQuery, conditionStr: string): SupabaseQuery {
    const parts = conditionStr.split('.');
    if (parts.length >= 3) {
      const field = parts[0];
      const operation = parts[1];
      const value = parts.slice(2).join('.');

      switch (operation) {
        case 'ilike':
          return query.ilike(field, value);
        case 'eq':
          return query.eq(field, value);
        case 'neq':
          return query.neq(field, value);
        case 'is':
          return query.is(field, value);
        case 'not':
          return query.not(field, 'is', 'null');
        default:
          console.warn(`不支援的操作: ${operation}`);
          return query;
      }
    }
    return query;
  }

  /**
   * 載入所有員工（用於非篩選模式）
   */
  async loadAll(): Promise<ApiFilterResponse<Staff>> {
    return this.filter({
      conditionGroups: [],
      page: 1,
      pageSize: 1000, // 載入大量資料
    });
  }

  /**
   * 根據角色篩選（輔助方法）
   */
  async filterByRole(roleId: string, page = 1, pageSize = 50): Promise<ApiFilterResponse<Staff>> {
    return this.filter({
      conditionGroups: [
        {
          id: 'role-filter',
          groupLogic: 'AND',
          conditions: [
            {
              field: 'role_id',
              operator: 'equals',
              value: roleId,
              logic: 'AND',
            },
          ],
        },
      ],
      page,
      pageSize,
    });
  }

  /**
   * 根據部門篩選（輔助方法）
   */
  async filterByDepartment(
    department: string,
    page = 1,
    pageSize = 50
  ): Promise<ApiFilterResponse<Staff>> {
    return this.filter({
      conditionGroups: [
        {
          id: 'department-filter',
          groupLogic: 'AND',
          conditions: [
            {
              field: 'department',
              operator: 'contains',
              value: department,
              logic: 'AND',
            },
          ],
        },
      ],
      page,
      pageSize,
    });
  }

  /**
   * 取得所有角色選項（用於前端下拉選單）
   */
  getRoleOptions(): Array<{ value: string; label: string }> {
    return Object.entries(ROLE_ID_MAP).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  }

  /**
   * 取得角色中文名稱（用於顯示）
   */
  getRoleName(roleId: string): string {
    return ROLE_ID_MAP[roleId] || roleId;
  }

  /**
   * 取得角色ID（用於查詢）
   */
  getRoleId(roleName: string): string {
    return ROLE_NAME_TO_ID_MAP[roleName] || roleName;
  }
}

// 匯出單例實例
export const staffFilterApiService = new StaffFilterApiService();
