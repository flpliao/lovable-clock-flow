# API篩選架構說明

## 概述

此文件說明如何將原本的前端篩選改為透過API請求來進行資料篩選，為未來切換到Laravel後端做準備。

## 架構變更

### 原有架構（前端篩選）

```
用戶輸入篩選條件 → 前端載入所有資料 → 前端進行篩選 → 顯示結果
```

### 新架構（API篩選）

```
用戶輸入篩選條件 → API請求到後端 → 後端進行篩選和分頁 → 返回結果 → 顯示結果
```

## 主要組件

### 1. 型別定義 (`src/components/common/AdvancedFilter/types.ts`)

- `ApiFilterRequest`: API請求格式
- `ApiFilterResponse<T>`: API回應格式
- `FilterApiService<T>`: 抽象API服務介面
- `PaginationConfig`: 分頁配置

### 2. Supabase API服務 (`src/services/staffFilterApiService.ts`)

- `StaffFilterApiService`: 目前使用的Supabase實作
- 支援複雜條件查詢（AND/OR邏輯）
- 支援分頁功能
- 支援多種運算子（contains, equals, starts_with等）

### 3. Laravel API服務 (`src/services/laravelStaffFilterApiService.ts`)

- `LaravelStaffFilterApiService`: 未來Laravel後端的實作範例
- 包含完整的使用說明和後端實作範例

### 4. 增強的篩選Hook (`src/components/common/AdvancedFilter/useAdvancedFilter.ts`)

- 支援API模式和前端模式
- 自動處理loading狀態
- 內建分頁功能
- 自動去抖動API請求

### 5. 增強的篩選組件 (`src/components/common/AdvancedFilter/AdvancedFilter.tsx`)

- 顯示loading狀態
- 分頁控制UI
- API模式相容性

## 使用方式

### 目前（Supabase模式）

```typescript
import { staffFilterApiService } from '@/services/staffFilterApiService';

// 定義搜尋欄位（支援下拉選單）
const SEARCH_FIELDS: SearchField[] = [
  {
    value: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '請輸入姓名',
  },
  {
    value: 'role_id',
    label: '角色',
    type: 'select', // 使用下拉選單
    options: staffFilterApiService.getRoleOptions(),
    placeholder: '請選擇角色',
  },
  {
    value: 'department',
    label: '部門',
    type: 'input',
    placeholder: '請輸入部門',
  },
];

const {
  filteredData,
  loading,
  pagination,
  // ...其他方法
} = useAdvancedFilter({
  searchFields: SEARCH_FIELDS,
  operators: DEFAULT_OPERATORS,
  apiService: staffFilterApiService, // 使用Supabase實作
  initialPageSize: 20,
  enablePagination: true,
});
```

### 未來（Laravel模式）

```typescript
import { laravelStaffFilterApiService } from '@/services/laravelStaffFilterApiService';

// 設定認證Token
laravelStaffFilterApiService.setAuthToken(userToken);

const {
  filteredData,
  loading,
  pagination,
  // ...其他方法
} = useAdvancedFilter({
  searchFields: SEARCH_FIELDS,
  operators: DEFAULT_OPERATORS,
  apiService: laravelStaffFilterApiService, // 切換到Laravel實作
  initialPageSize: 20,
  enablePagination: true,
});
```

## API請求格式

### 請求 (ApiFilterRequest)

```json
{
  "conditionGroups": [
    {
      "id": "group-1",
      "groupLogic": "AND",
      "conditions": [
        {
          "field": "name",
          "operator": "contains",
          "value": "張",
          "logic": "AND"
        }
      ]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "sortBy": "name",
  "sortOrder": "asc"
}
```

### 回應 (ApiFilterResponse)

```json
{
  "data": [...], // 篩選後的資料陣列
  "total": 150,  // 總筆數
  "page": 1,     // 目前頁數
  "pageSize": 20, // 每頁筆數
  "totalPages": 8 // 總頁數
}
```

## 支援的運算子

- `contains`: 包含
- `equals`: 等於
- `not_equals`: 不等於
- `starts_with`: 開頭是
- `ends_with`: 結尾是
- `empty`: 為空
- `not_empty`: 不為空

## 通用下拉選單功能

### 欄位類型配置

每個搜尋欄位都可以配置為不同的輸入類型：

```typescript
interface SearchField {
  value: string; // 欄位名稱
  label: string; // 顯示標籤
  type?: 'input' | 'select'; // 輸入類型
  options?: Array<{ value: string; label: string }>; // 下拉選項
  placeholder?: string; // 提示文字
}
```

### 使用範例

#### 1. 角色下拉選單

```typescript
{
  value: 'role_id',
  label: '角色',
  type: 'select',
  options: [
    { value: 'admin', label: '系統管理員' },
    { value: 'manager', label: '部門主管' },
    { value: 'user', label: '一般員工' }
  ],
  placeholder: '請選擇角色'
}
```

#### 2. 部門下拉選單

```typescript
{
  value: 'department',
  label: '部門',
  type: 'select',
  options: [
    { value: 'hr', label: '人事部' },
    { value: 'it', label: '資訊部' },
    { value: 'sales', label: '業務部' }
  ],
  placeholder: '請選擇部門'
}
```

#### 3. 一般輸入框

```typescript
{
  value: 'name',
  label: '姓名',
  type: 'input',
  placeholder: '請輸入姓名'
}
```

### 資料轉換處理

當使用下拉選單時，需要在API服務中處理資料轉換：

```typescript
// 在 API 服務中
private convertConditionValue(field: string, value: string): string {
  if (field === 'role_id') {
    // 中文角色名稱轉換為英文 role_id
    const roleId = ROLE_NAME_TO_ID_MAP[value.trim()];
    return roleId || value;
  }
  return value;
}
```

### 選項資料來源

選項資料可以來自：

1. **靜態資料**: 直接在程式碼中定義
2. **API 服務**: 從服務類別取得（如 `staffFilterApiService.getRoleOptions()`）
3. **資料庫查詢**: 動態載入選項資料

```typescript
// 從API服務取得選項
const roleOptions = staffFilterApiService.getRoleOptions();

// 靜態選項
const statusOptions = [
  { value: 'active', label: '啟用' },
  { value: 'inactive', label: '停用' },
];
```

## 切換到Laravel的步驟

### 1. 後端實作

在Laravel中建立 `POST /api/staff/filter` 端點：

```php
// routes/api.php
Route::post('/staff/filter', [StaffController::class, 'filter']);

// app/Http/Controllers/StaffController.php
public function filter(StaffFilterRequest $request)
{
    $query = Staff::query();

    // 解析條件組合
    $conditionGroups = $request->input('conditionGroups', []);

    foreach ($conditionGroups as $group) {
        // 實作篩選邏輯...
    }

    // 分頁
    $result = $query->paginate($request->input('pageSize', 50));

    return response()->json([
        'data' => $result->items(),
        'total' => $result->total(),
        'page' => $result->currentPage(),
        'pageSize' => $result->perPage(),
        'totalPages' => $result->lastPage(),
    ]);
}
```

### 2. 前端切換

只需要更改一行程式碼：

```typescript
// 在 StaffManagement.tsx 中
// 從
apiService: staffFilterApiService,
// 改為
apiService: laravelStaffFilterApiService,
```

### 3. 環境設定

```env
VITE_LARAVEL_API_URL=http://localhost:8000/api
```

## 效能優化

### 後端篩選的優勢

1. **減少網路傳輸**: 只傳輸需要的資料
2. **資料庫層級篩選**: 利用資料庫索引提升效能
3. **分頁支援**: 避免載入大量不需要的資料
4. **伺服器端快取**: 可以實作查詢結果快取

### 前端優化

1. **去抖動**: 避免頻繁的API請求
2. **Loading狀態**: 提供良好的用戶體驗
3. **錯誤處理**: 妥善處理網路錯誤
4. **快取機制**: 可以加入前端快取減少重複請求

## 測試建議

1. **功能測試**: 測試所有篩選條件和運算子
2. **效能測試**: 比較大資料量下的效能差異
3. **邊界測試**: 測試極限條件和錯誤情況
4. **用戶體驗測試**: 確保loading和分頁體驗良好

## 注意事項

1. **向後相容**: 保留前端篩選模式作為備用
2. **錯誤處理**: API請求失敗時的處理機制
3. **認證**: 確保API請求包含適當的認證資訊
4. **版本控制**: API版本管理策略
