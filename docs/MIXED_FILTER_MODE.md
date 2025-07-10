# 混合模式篩選功能說明

## 概述

混合模式篩選允許用戶在同一個欄位中選擇使用下拉選單或輸入框，提供更靈活的篩選體驗。

## 欄位類型

### 1. `input` - 純輸入框

```typescript
{
  value: 'name',
  label: '姓名',
  type: 'input',
  placeholder: '請輸入姓名'
}
```

### 2. `select` - 純下拉選單

```typescript
{
  value: 'role_id',
  label: '角色',
  type: 'select',
  options: roleOptions,
  placeholder: '請選擇角色',
  forceSelect: true // 強制只能選擇，不能自訂輸入
}
```

### 3. `mixed` - 混合模式

```typescript
{
  value: 'department',
  label: '部門',
  type: 'mixed',
  options: departmentOptions,
  placeholder: '請選擇或輸入部門',
  allowCustomInput: true // 允許自訂輸入
}
```

## 混合模式功能

### 切換按鈕

- **下拉箭頭** (↓) - 當前為選擇模式，點擊切換為輸入模式
- **上箭頭** (↑) - 當前為輸入模式，點擊切換為選擇模式

### 使用場景

#### 1. 角色欄位（強制選擇）

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
  placeholder: '請選擇角色',
  forceSelect: true // 角色必須從預設選項中選擇
}
```

#### 2. 部門欄位（混合模式）

```typescript
{
  value: 'department',
  label: '部門',
  type: 'mixed',
  options: [
    { value: 'hr', label: '人事部' },
    { value: 'it', label: '資訊部' },
    { value: 'sales', label: '業務部' }
  ],
  placeholder: '請選擇或輸入部門',
  allowCustomInput: true // 可以選擇預設選項或自訂輸入
}
```

#### 3. 職位欄位（混合模式）

```typescript
{
  value: 'position',
  label: '職位',
  type: 'mixed',
  options: [
    { value: 'manager', label: '經理' },
    { value: 'specialist', label: '專員' },
    { value: 'director', label: '主任' }
  ],
  placeholder: '請選擇或輸入職位',
  allowCustomInput: true // 可以選擇預設選項或自訂輸入
}
```

## 配置參數說明

### `type`

- `'input'` - 純輸入框
- `'select'` - 純下拉選單
- `'mixed'` - 混合模式（可切換）

### `options`

下拉選單的選項陣列：

```typescript
Array<{ value: string; label: string }>;
```

### `allowCustomInput`

- `true` - 允許自訂輸入（混合模式預設）
- `false` - 不允許自訂輸入（強制只能選擇）

### `forceSelect`

- `true` - 強制只能選擇，不能自訂輸入
- `false` - 允許自訂輸入（預設）

## 實際使用範例

### 員工管理頁面配置

```typescript
const SEARCH_FIELDS: SearchField[] = [
  // 姓名 - 純輸入框
  {
    value: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '請輸入姓名',
  },

  // 信箱 - 純輸入框
  {
    value: 'email',
    label: '信箱',
    type: 'input',
    placeholder: '請輸入信箱',
  },

  // 角色 - 純下拉選單（強制選擇）
  {
    value: 'role_id',
    label: '角色',
    type: 'select',
    options: staffFilterApiService.getRoleOptions(),
    placeholder: '請選擇角色',
    forceSelect: true,
  },

  // 部門 - 混合模式
  {
    value: 'department',
    label: '部門',
    type: 'mixed',
    options: departmentOptions,
    placeholder: '請選擇或輸入部門',
    allowCustomInput: true,
  },

  // 職位 - 混合模式
  {
    value: 'position',
    label: '職位',
    type: 'mixed',
    options: positionOptions,
    placeholder: '請選擇或輸入職位',
    allowCustomInput: true,
  },
];
```

## 用戶體驗

### 1. 角色篩選

- 用戶只能從預設角色中選擇
- 確保資料一致性和準確性
- 避免輸入錯誤的角色名稱

### 2. 部門篩選

- 用戶可以從現有部門中選擇
- 也可以輸入新的部門名稱
- 適合部門名稱可能變動的情況

### 3. 職位篩選

- 用戶可以從現有職位中選擇
- 也可以輸入新的職位名稱
- 適合職位名稱可能變動的情況

## 技術實作

### 狀態管理

```typescript
// 混合模式狀態管理
const [mixedModeStates, setMixedModeStates] = useState<Record<string, 'select' | 'input'>>({});
```

### 切換邏輯

```typescript
const toggleMode = (groupId: string, conditionIdx: number) => {
  const key = `${groupId}-${conditionIdx}`;
  const currentMode = mixedModeStates[key] || 'select';
  const newMode = currentMode === 'select' ? 'input' : 'select';

  setMixedModeStates(prev => ({
    ...prev,
    [key]: newMode,
  }));

  // 切換模式時清空值
  updateCondition(groupId, conditionIdx, 'value', '');
};
```

### 條件渲染

```typescript
if (fieldType === 'mixed' && currentField?.options) {
  const currentMode = mixedModeStates[`${group.id}-${condIdx}`] || 'select';

  return (
    <div className="flex items-center gap-1">
      {/* 下拉選單或輸入框 */}
      {currentMode === 'select' ? <Select /> : <Input />}

      {/* 切換按鈕 */}
      {currentField.allowCustomInput !== false && (
        <Button onClick={toggleMode}>
          {currentMode === 'select' ? <ChevronDown /> : <ChevronUp />}
        </Button>
      )}
    </div>
  );
}
```

## 最佳實踐

### 1. 選擇合適的欄位類型

- **標準化欄位**（如角色）使用 `select` 或 `forceSelect: true`
- **可能變動的欄位**（如部門、職位）使用 `mixed` 模式
- **自由文字欄位**（如姓名、信箱）使用 `input`

### 2. 提供有意義的選項

- 確保下拉選單中的選項是常用且有意義的
- 定期更新選項以反映實際資料

### 3. 用戶引導

- 使用清楚的 placeholder 文字
- 提供適當的提示和說明

### 4. 效能考量

- 選項數量不宜過多（建議 < 50 個）
- 考慮使用虛擬滾動處理大量選項
