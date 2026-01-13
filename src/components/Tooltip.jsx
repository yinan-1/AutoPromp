import React, { useState } from 'react';

/**
 * Tooltip 组件 - 提供圆角质感的简洁气泡提示
 */
export const Tooltip = ({ children, content, isDarkMode, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 根据位置计算样式
  const getPositionStyles = () => {
    switch (position) {
      case 'right':
        return 'left-full ml-1 top-1/2 -translate-y-1/2';
      case 'left':
        return 'right-full mr-1 top-1/2 -translate-y-1/2';
      case 'top':
        return 'bottom-full mb-1 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-1 left-1/2 -translate-x-1/2';
      default:
        return 'left-full ml-1 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div 
          className={`
            absolute ${getPositionStyles()} px-3 py-2 rounded-xl text-[11px] font-bold z-[1000]
            w-max max-w-[180px] min-w-[56px] whitespace-normal leading-relaxed text-center
            pointer-events-none animate-in fade-in zoom-in-95 duration-200
            ${isDarkMode 
              ? 'bg-[#2A2928] text-gray-200 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
              : 'bg-white text-gray-700 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.1)]'}
          `}
          style={{
            backgroundImage: isDarkMode 
              ? 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)' 
              : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
