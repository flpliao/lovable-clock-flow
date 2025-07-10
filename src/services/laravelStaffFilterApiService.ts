import { Staff } from '@/components/staff/types';
import {
  FilterApiService,
  ApiFilterRequest,
  ApiFilterResponse,
} from '@/components/common/AdvancedFilter/types';

/**
 * Laravel 後端API服務實作範例
 * 使用此服務來替換 StaffFilterApiService 當切換到Laravel後端時
 */
export class LaravelStaffFilterApiService implements FilterApiService<Staff> {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(
    baseUrl: string = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000/api'
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * 設定認證Token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * 主要篩選方法 - 發送請求到Laravel後端
   */
  async filter(request: ApiFilterRequest): Promise<ApiFilterResponse<Staff>> {
    console.log('🔍 LaravelStaffFilterApiService: 發送篩選請求到Laravel', request);

    try {
      const response = await fetch(`${this.baseUrl}/staff/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiFilterResponse<Staff> = await response.json();

      console.log('✅ LaravelStaffFilterApiService: 篩選請求成功', {
        total: data.total,
        returned: data.data.length,
        page: data.page,
      });

      return data;
    } catch (error) {
      console.error('❌ LaravelStaffFilterApiService: 篩選請求失敗:', error);
      throw error;
    }
  }

  /**
   * 載入所有員工（用於非篩選模式）
   */
  async loadAll(): Promise<ApiFilterResponse<Staff>> {
    return this.filter({
      conditionGroups: [],
      page: 1,
      pageSize: 1000,
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
}

// 使用說明和範例
/*
使用此服務的步驟：

1. 在Laravel後端建立對應的API端點：
   POST /api/staff/filter

2. Laravel Controller範例：
   ```php
   public function filter(StaffFilterRequest $request)
   {
       $query = Staff::query();
       
       // 解析條件組合
       $conditionGroups = $request->input('conditionGroups', []);
       
       foreach ($conditionGroups as $groupIndex => $group) {
           $groupLogic = $group['groupLogic'] ?? 'AND';
           $conditions = $group['conditions'] ?? [];
           
           $query->where(function ($subQuery) use ($conditions) {
               foreach ($conditions as $condIndex => $condition) {
                   $field = $condition['field'];
                   $operator = $condition['operator'];
                   $value = $condition['value'];
                   $logic = $condition['logic'] ?? 'AND';
                   
                   switch ($operator) {
                       case 'contains':
                           $method = $condIndex === 0 ? 'where' : ($logic === 'AND' ? 'where' : 'orWhere');
                           $subQuery->$method($field, 'LIKE', "%{$value}%");
                           break;
                       case 'equals':
                           $method = $condIndex === 0 ? 'where' : ($logic === 'AND' ? 'where' : 'orWhere');
                           $subQuery->$method($field, '=', $value);
                           break;
                       // 其他運算子...
                   }
               }
           });
       }
       
       // 分頁
       $page = $request->input('page', 1);
       $pageSize = $request->input('pageSize', 50);
       
       $result = $query->paginate($pageSize, ['*'], 'page', $page);
       
       return response()->json([
           'data' => $result->items(),
           'total' => $result->total(),
           'page' => $result->currentPage(),
           'pageSize' => $result->perPage(),
           'totalPages' => $result->lastPage(),
       ]);
   }
   ```

3. 在前端切換服務：
   ```typescript
   // 在 StaffManagement.tsx 中
   import { laravelStaffFilterApiService } from '@/services/laravelStaffFilterApiService';
   
   // 替換
   // apiService: staffFilterApiService,
   // 為
   // apiService: laravelStaffFilterApiService,
   ```

 4. 環境變數設定（.env）：
   ```
   VITE_LARAVEL_API_URL=http://localhost:8000/api
   ```
*/

// 匯出單例實例
export const laravelStaffFilterApiService = new LaravelStaffFilterApiService();
