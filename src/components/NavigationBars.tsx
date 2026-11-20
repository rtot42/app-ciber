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
    <nav
      className="w-full shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-2 sm:px-4 pt-1.5 z-30 shadow-xs"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 gap-1 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeScreen === tab.id ||
            (tab.id === 'worlds' && activeScreen === 'world-detail');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`min-h-[46px] min-w-0 flex flex-col items-center justify-center gap-0.5 relative px-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-bold'
                  : 'text-slate-500 hover:text-slate-700 font-semibold'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-cyan-50/90 rounded-xl -z-10" />
              )}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.4] text-cyan-600' : 'stroke-[2]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-2xs tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] sm:text-xs leading-tight tracking-tight truncate max-w-full px-0.5 ${
                  isActive ? 'font-bold text-cyan-700' : 'font-semibold text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-2xs" />
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
    <nav
      className="w-full shrink-0 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-2 sm:px-4 pt-1.5 z-30 shadow-xs"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-4 gap-1 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[46px] min-w-0 flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-bold bg-cyan-50/90'
                  : 'text-slate-500 hover:text-slate-700 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-2'}`} />
              <span className="text-[11px] sm:text-xs leading-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
