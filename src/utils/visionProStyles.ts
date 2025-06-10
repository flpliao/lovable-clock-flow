
// Vision Pro 風格的樣式工具函數
export const visionProStyles = {
  // 玻璃效果背景
  glassBackground: "backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl",
  
  // 卡片背景 - 更接近圖片中的淡藍色風格
  cardBackground: "backdrop-blur-2xl bg-gradient-to-br from-white/60 to-white/40 border border-white/30 shadow-xl",
  
  // 主要卡片樣式 - 基於圖片的設計
  dashboardCard: "backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/60 hover:bg-gradient-to-br hover:from-white/75 hover:to-white/55",
  
  // 統計卡片樣式 - 類似圖片中的數據卡片
  statsCard: "backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6",
  
  // 大型功能卡片
  featureCard: "backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/60",
  
  // Liquid Glass 卡片樣式 - 極淡的藍色背景，更接近圖片效果
  liquidGlassCard: "backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/60 hover:bg-gradient-to-br hover:from-white/75 hover:to-white/60",
  
  // 帶光線效果的 Liquid Glass 卡片
  liquidGlassCardWithGlow: "backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/70 hover:bg-gradient-to-br hover:from-white/80 hover:to-white/65 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]",
  
  // 頂部控制欄樣式 - 類似圖片中的時間範圍選擇器
  topControlBar: "backdrop-blur-2xl bg-gradient-to-r from-white/60 to-white/40 border border-white/50 rounded-2xl shadow-lg p-4",
  
  // 按鈕樣式
  glassButton: "backdrop-blur-xl bg-white/50 rounded-xl border border-white/40 shadow-lg hover:bg-white/60 transition-all duration-200",
  
  // 文字對比度
  primaryText: "text-gray-900 drop-shadow-sm",
  secondaryText: "text-gray-700 font-medium drop-shadow-sm",
  
  // 圖標容器 - 更接近圖片中的彩色圖標設計
  iconContainer: "p-3 bg-white/60 rounded-xl shadow-md backdrop-blur-xl border border-white/40",
  
  // 彩色圖標容器 - 類似圖片中的藍色、綠色、紫色圖標
  coloredIconContainer: {
    blue: "p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white",
    green: "p-3 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white",
    purple: "p-3 bg-purple-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-purple-400/50 text-white",
    orange: "p-3 bg-orange-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50 text-white",
    red: "p-3 bg-red-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-red-400/50 text-white",
    teal: "p-3 bg-teal-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-teal-400/50 text-white",
    indigo: "p-3 bg-indigo-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-indigo-400/50 text-white",
    gray: "p-3 bg-gray-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-gray-400/50 text-white"
  },
  
  // 漂浮動畫
  floatingElements: [
    "absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float",
    "absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float",
    "absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"
  ],
  
  // 淡藍色背景漸變 - 基於圖片的背景色調
  blueGradientBackground: "bg-gradient-to-br from-blue-300/30 via-blue-200/20 to-blue-100/15",
  
  // 光線效果邊框
  glowingBorder: "before:absolute before:inset-0 before:rounded-2xl before:padding-[1px] before:bg-gradient-to-br before:from-white/50 before:via-white/30 before:to-white/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-white/20 after:via-white/10 after:to-transparent after:-z-10"
};

// 漸變背景生成器
export const createGradientBackground = (colors: string[]) => {
  return `bg-gradient-to-br ${colors.join(' ')}`;
};

// 光效背景生成器
export const createRadialGradient = (position: string, fromColor: string) => {
  return `bg-[radial-gradient(ellipse_at_${position},_var(--tw-gradient-stops))] ${fromColor} via-transparent to-transparent`;
};

// Vision Pro 淡藍色背景 - 基於圖片的背景設計
export const createVisionProBackground = () => {
  return "bg-gradient-to-br from-blue-400/40 via-blue-300/30 to-blue-200/20 relative overflow-hidden";
};

// Dashboard風格背景 - 類似圖片中的背景
export const createDashboardBackground = () => {
  return "bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden min-h-screen";
};

// Liquid Glass 效果組合 - 基於圖片風格
export const createLiquidGlassEffect = (withGlow: boolean = false, variant: 'default' | 'stats' | 'feature' = 'default') => {
  const variants = {
    default: "backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/60 hover:bg-gradient-to-br hover:from-white/75 hover:to-white/60",
    stats: "backdrop-blur-2xl bg-gradient-to-br from-white/80 to-white/60 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
    feature: "backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/60"
  };
  
  const baseClasses = variants[variant];
  
  if (withGlow) {
    return `${baseClasses} hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]`;
  }
  
  return baseClasses;
};

// 圖標顏色對應
export const getIconColorClass = (index: number) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'indigo', 'gray'];
  return colors[index % colors.length];
};
