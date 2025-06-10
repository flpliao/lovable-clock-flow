// Vision Pro 風格的樣式工具函數
export const visionProStyles = {
  // 玻璃效果背景
  glassBackground: "backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl",
  
  // 卡片背景
  cardBackground: "backdrop-blur-3xl bg-gradient-to-br from-white/40 to-white/25 border border-white/50 shadow-2xl",
  
  // Liquid Glass 卡片樣式 - 極淡的藍色背景，更接近圖片效果
  liquidGlassCard: "backdrop-blur-3xl bg-gradient-to-br from-blue-50/25 via-blue-25/15 to-white/10 border border-blue-100/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-100/50 hover:bg-gradient-to-br hover:from-blue-50/30 hover:via-blue-25/20 hover:to-white/15",
  
  // 帶光線效果的 Liquid Glass 卡片 - 極淡藍色版本
  liquidGlassCardWithGlow: "backdrop-blur-3xl bg-gradient-to-br from-blue-50/25 via-blue-25/15 to-white/10 border border-blue-100/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-100/50 hover:bg-gradient-to-br hover:from-blue-50/30 hover:via-blue-25/20 hover:to-white/15 hover:shadow-[0_0_40px_rgba(219,234,254,0.4)] before:absolute before:inset-0 before:rounded-3xl before:border before:border-transparent before:bg-gradient-to-br before:from-blue-50/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
  
  // 更柔和的淡藍色玻璃卡片 - 接近圖片的極淡色調
  softBlueGlassCard: "backdrop-blur-3xl bg-gradient-to-br from-blue-50/20 via-slate-50/15 to-white/10 border border-blue-50/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-50/60 hover:bg-gradient-to-br hover:from-blue-50/25 hover:via-slate-50/20 hover:to-white/15",
  
  // 帶光效的極淡藍色玻璃卡片
  softBlueGlassCardWithGlow: "backdrop-blur-3xl bg-gradient-to-br from-blue-50/20 via-slate-50/15 to-white/10 border border-blue-50/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-50/60 hover:bg-gradient-to-br hover:from-blue-50/25 hover:via-slate-50/20 hover:to-white/15 hover:shadow-[0_0_50px_rgba(219,234,254,0.3)] relative before:absolute before:inset-0 before:rounded-3xl before:border before:border-transparent before:bg-gradient-to-br before:from-blue-50/15 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none",
  
  // 按鈕樣式
  glassButton: "backdrop-blur-xl bg-white/40 rounded-2xl border border-white/40 shadow-lg",
  
  // 文字對比度
  primaryText: "text-gray-900 drop-shadow-lg",
  secondaryText: "text-gray-800 font-medium drop-shadow-md",
  
  // 圖標容器 - 更接近 Vision Pro 風格
  iconContainer: "p-3 bg-white/50 rounded-2xl shadow-lg backdrop-blur-xl border border-white/30",
  
  // 漂浮動畫
  floatingElements: [
    "absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float",
    "absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float",
    "absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"
  ],
  
  // 極淡藍色背景漸變
  blueGradientBackground: "bg-gradient-to-br from-blue-50/15 via-blue-25/10 to-slate-50/20",
  
  // 光線效果邊框
  glowingBorder: "before:absolute before:inset-0 before:rounded-3xl before:padding-[1px] before:bg-gradient-to-br before:from-white/50 before:via-white/30 before:to-white/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-3xl after:bg-gradient-to-br after:from-white/20 after:via-white/10 after:to-transparent after:-z-10"
};

// 漸變背景生成器
export const createGradientBackground = (colors: string[]) => {
  return `bg-gradient-to-br ${colors.join(' ')}`;
};

// 光效背景生成器
export const createRadialGradient = (position: string, fromColor: string) => {
  return `bg-[radial-gradient(ellipse_at_${position},_var(--tw-gradient-stops))] ${fromColor} via-transparent to-transparent`;
};

// Vision Pro 淡藍色背景
export const createVisionProBackground = () => {
  return "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden";
};

// Liquid Glass 效果組合 - 新增極淡藍色版本
export const createLiquidGlassEffect = (withGlow: boolean = false, blueTheme: boolean = false) => {
  if (blueTheme) {
    const baseClasses = "backdrop-blur-3xl bg-gradient-to-br from-blue-50/20 via-slate-50/15 to-white/10 border border-blue-50/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-blue-50/60 hover:bg-gradient-to-br hover:from-blue-50/25 hover:via-slate-50/20 hover:to-white/15";
    
    if (withGlow) {
      return `${baseClasses} hover:shadow-[0_0_50px_rgba(219,234,254,0.3)] relative before:absolute before:inset-0 before:rounded-3xl before:border before:border-transparent before:bg-gradient-to-br before:from-blue-50/15 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none`;
    }
    
    return baseClasses;
  }
  
  const baseClasses = "backdrop-blur-3xl bg-gradient-to-br from-white/30 via-white/20 to-white/15 border border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-white/60 hover:bg-gradient-to-br hover:from-white/35 hover:via-white/25 hover:to-white/20";
  
  if (withGlow) {
    return `${baseClasses} hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] relative before:absolute before:inset-0 before:rounded-3xl before:border before:border-transparent before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none`;
  }
  
  return baseClasses;
};
