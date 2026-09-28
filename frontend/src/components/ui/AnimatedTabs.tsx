import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'emerald' | 'amber' | 'rose' | 'violet';
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'segmented';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  className = '',
  size = 'md',
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 gap-1.5',
    md: 'text-xs py-2 px-3.5 gap-2',
    lg: 'text-sm py-2.5 px-4 gap-2.5',
  };

  if (variant === 'segmented') {
    return (
      <div
        className={`relative inline-flex items-center p-1 rounded-xl bg-[#EEEAE5]/70 border border-[rgba(20,20,20,0.06)] backdrop-blur-md ${className}`}
        onMouseLeave={() => setHoveredTab(null)}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              className={`relative z-10 flex items-center font-medium rounded-lg transition-colors duration-160 select-none cursor-pointer ${
                sizeClasses[size]
              } ${
                isActive
                  ? 'text-[#161616] font-semibold'
                  : 'text-[#68656A] hover:text-[#161616]'
              }`}
            >
              {/* Hover Glider suave */}
              {isHovered && !isActive && (
                <motion.div
                  layoutId="tabs-hover-glider"
                  className="absolute inset-0 rounded-lg bg-white/60 border border-white/80 -z-10 shadow-xs"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}

              {/* Active Glider blanco sólido con elevación sutil */}
              {isActive && (
                <motion.div
                  layoutId="tabs-active-pill"
                  className="absolute inset-0 rounded-lg bg-white border border-[rgba(20,20,20,0.06)] shadow-[0_2px_8px_rgba(20,20,30,0.06)] -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {tab.icon && (
                <span className={`shrink-0 transition-colors ${isActive ? 'text-[#695CFF]' : 'text-[#8F8B92]'}`}>
                  {tab.icon}
                </span>
              )}

              <span className="truncate">{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold ml-1 ${
                    tab.badgeVariant === 'rose'
                      ? 'bg-[#FEF0F0] text-[#D93838] border border-[#FCD2D2]'
                      : tab.badgeVariant === 'amber'
                      ? 'bg-[#FEF7EC] text-[#975A16] border border-[#FCE1B8]'
                      : tab.badgeVariant === 'emerald'
                      ? 'bg-[#EDFBF2] text-[#137A43] border border-[#C6F0D4]'
                      : isActive
                      ? 'bg-[#EEEAFE] text-[#5749F5] border border-[#D5CCFE]'
                      : 'bg-black/[0.05] text-[#68656A]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant Underline
  return (
    <div
      className={`relative flex items-center border-b border-[rgba(20,20,20,0.08)] gap-6 ${className}`}
      onMouseLeave={() => setHoveredTab(null)}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            className={`relative pb-3 pt-1 flex items-center font-medium transition-colors duration-160 cursor-pointer ${
              sizeClasses[size]
            } ${
              isActive
                ? 'text-[#161616] font-semibold'
                : 'text-[#68656A] hover:text-[#161616]'
            }`}
          >
            {isHovered && !isActive && (
              <motion.div
                layoutId="tabs-underline-hover"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-black/10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            {isActive && (
              <motion.div
                layoutId="tabs-active-underline"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[#695CFF] shadow-[0_1px_4px_rgba(105,92,255,0.4)]"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}

            {tab.icon && (
              <span className={`shrink-0 ${isActive ? 'text-[#695CFF]' : 'text-[#8F8B92]'}`}>
                {tab.icon}
              </span>
            )}

            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold ml-1 ${
                  isActive
                    ? 'bg-[#EEEAFE] text-[#5749F5]'
                    : 'bg-black/[0.05] text-[#68656A]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
