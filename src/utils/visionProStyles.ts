
// Vision Pro 風格的樣式工具函數
export const visionProStyles = {
  // 玻璃效果背景
  glassBackground: "backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl",
  
  // 卡片背景
  cardBackground: "backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/25 border border-white/50 shadow-2xl",
  
  // 按鈕樣式
  glassButton: "backdrop-blur-xl bg-white/40 rounded-2xl border border-white/40 shadow-lg",
  
  // 文字對比度
  primaryText: "text-gray-900 drop-shadow-lg",
  secondaryText: "text-gray-800 font-medium drop-shadow-md",
  
  // 圖標容器
  iconContainer: "p-2 bg-white/50 rounded-xl shadow-md",
  
  // 漂浮動畫
  floatingElements: [
    "absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float",
    "absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float",
    "absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"
  ]
};

// 漸變背景生成器
export const createGradientBackground = (colors: string[]) => {
  return `bg-gradient-to-br ${colors.join(' ')}`;
};

// 光效背景生成器
export const createRadialGradient = (position: string, fromColor: string) => {
  return `bg-[radial-gradient(ellipse_at_${position},_var(--tw-gradient-stops))] ${fromColor} via-transparent to-transparent`;
};
