import React from 'react';
import { Home, Gamepad2, Award, User, BarChart3, Users, Lightbulb, Settings, GraduationCap } from 'lucide-react';
import { ScreenId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ChildBottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unlockedBadgesCount?: number;
}

export const ChildBottomNav: React.FC<ChildBottomNavProps> = ({
  activeScreen,
  onNavigate,
  unlockedBadgesCount = 2,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home' as ScreenId, label: t('nav.home'), icon: Home },
    { id: 'worlds' as ScreenId, label: t('nav.worlds'), icon: Gamepad2 },
    { id: 'education' as ScreenId, label: t('nav.education'), icon: GraduationCap },
    { id: 'achievements' as ScreenId, label: t('nav.achievements'), icon: Award, badge: unlockedBadgesCount },
    { id: 'profile' as ScreenId, label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="w-full shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-2 sm:px-4 pt-2.5 pb-3.5 sm:py-3 z-30 shadow-xs">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeScreen === tab.id ||
            (tab.id === 'worlds' && activeScreen === 'world-detail');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 relative px-3 sm:px-4.5 py-1.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-black'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-cyan-50/90 rounded-2xl -z-10" />
              )}
              <div className="relative">
                <Icon
                  className={`w-7 h-7 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.7] text-cyan-600' : 'stroke-[2.1]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs sm:text-sm tracking-tight ${isActive ? 'font-black text-cyan-700' : 'font-bold text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-2xs" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface ParentBottomNavProps {
  activeTab: 'dashboard' | 'children' | 'insights' | 'settings';
  onTabChange: (tab: 'dashboard' | 'children' | 'insights' | 'settings') => void;
  onExitParentMode: () => void;
}

export const ParentBottomNav: React.FC<ParentBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard' as const, label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'children' as const, label: t('nav.children'), icon: Users },
    { id: 'insights' as const, label: t('nav.insights'), icon: Lightbulb },
    { id: 'settings' as const, label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="w-full shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-2 sm:px-4 pt-2 pb-3 sm:py-2.5 z-30 shadow-xs">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-1.5 rounded-2xl transition cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-extrabold bg-cyan-50/80'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.6]' : 'stroke-2'}`} />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
