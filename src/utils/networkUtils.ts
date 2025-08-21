
// 取得使用者 IP 位址的函數
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw new Error('無法取得 IP 位址');
  }
};
