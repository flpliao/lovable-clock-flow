interface SelectAllState {
  checked: boolean;
  indeterminate: boolean;
}

/**
 * 計算全選狀態
 * @param options 選項的布林值陣列
 * @returns 包含 checked 和 indeterminate 狀態的物件
 */
export const getSelectAllState = (options: boolean[]): SelectAllState => {
  const allChecked = options.every(option => option);
  const someChecked = options.some(option => option);

  if (allChecked) return { checked: true, indeterminate: false };
  if (someChecked) return { checked: false, indeterminate: true };
  return { checked: false, indeterminate: false };
};
