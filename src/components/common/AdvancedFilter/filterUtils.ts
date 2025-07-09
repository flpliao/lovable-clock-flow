import { FilterGroup } from './types';

// 通用的篩選邏輯評估函數
export function evaluateCondition(value: string, operator: string, target: string): boolean {
  const val = value.trim().toLowerCase();
  const targetLower = target.toLowerCase();

  switch (operator) {
    case 'contains':
      return targetLower.includes(val);
    case 'not_contains':
      return !targetLower.includes(val);
    case 'equals':
      return targetLower === val;
    case 'not_equals':
      return targetLower !== val;
    case 'starts_with':
      return targetLower.startsWith(val);
    case 'ends_with':
      return targetLower.endsWith(val);
    default:
      return true;
  }
}

// 通用的多條件組合篩選函數
export function applyMultiConditionFilter<T>(
  item: T,
  conditionGroups: FilterGroup[],
  fieldValueGetter: (item: T, field: string) => string
): boolean {
  // 若所有條件皆為空，直接通過
  if (conditionGroups.every(group => group.conditions.every(c => !c.value.trim()))) {
    return true;
  }

  // 評估每個條件組
  const groupResults = conditionGroups.map(group => {
    const validConditions = group.conditions.filter(c => c.value.trim() !== '');
    if (validConditions.length === 0) return true;

    // 逐個條件評估，並根據邏輯運算子組合
    let result = true;

    for (let i = 0; i < validConditions.length; i++) {
      const cond = validConditions[i];
      const target = fieldValueGetter(item, cond.field);
      const conditionResult = evaluateCondition(cond.value, cond.operator, target);

      // 根據邏輯運算子組合結果
      if (i === 0) {
        result = conditionResult;
      } else {
        if (cond.logic === 'AND') {
          result = result && conditionResult;
        } else {
          // OR
          result = result || conditionResult;
        }
      }
    }

    return result;
  });

  // 組合所有組的結果，根據組間邏輯運算子
  let finalResult = groupResults[0];
  for (let i = 1; i < groupResults.length; i++) {
    const groupLogic = conditionGroups[i].groupLogic;
    if (groupLogic === 'AND') {
      finalResult = finalResult && groupResults[i];
    } else {
      // OR
      finalResult = finalResult || groupResults[i];
    }
  }

  return finalResult;
}

// 預設的運算子定義
export const DEFAULT_OPERATORS = [
  { value: 'contains', label: '包含' },
  { value: 'not_contains', label: '不包含' },
  { value: 'equals', label: '等於' },
  { value: 'not_equals', label: '不等於' },
  { value: 'starts_with', label: '開頭為' },
  { value: 'ends_with', label: '結尾為' },
];
