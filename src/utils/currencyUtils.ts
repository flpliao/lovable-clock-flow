/**
 * 格式化貨幣顯示
 * @param amount 金額
 * @param currency 貨幣符號，預設為 'NT$'
 * @returns 格式化後的貨幣字串
 */
export const formatCurrency = (amount: number, currency = 'NT$'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency} 0`;
  }

  return `${currency} ${amount.toLocaleString('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * 格式化小數貨幣顯示
 * @param amount 金額
 * @param currency 貨幣符號，預設為 'NT$'
 * @param decimals 小數位數，預設為 2
 * @returns 格式化後的貨幣字串
 */
export const formatCurrencyWithDecimals = (
  amount: number,
  currency = 'NT$',
  decimals = 2
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency} 0.00`;
  }

  return `${currency} ${amount.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};
