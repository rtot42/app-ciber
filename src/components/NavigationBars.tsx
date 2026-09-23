import React from 'react';
import { Home, Gamepad2, Award, User, BarChart3, Users, Lightbulb, Settings, ShieldCheck, GraduationCap } from 'lucide-react';
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
    <nav className="w-full shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-2 z-30 shadow-xs">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeScreen === tab.id ||
            (tab.id === 'worlds' && activeScreen === 'world-detail');

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 relative px-3 py-1.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-cyan-50 rounded-2xl -z-10" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
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
  onExitParentMode,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard' as const, label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'children' as const, label: t('nav.children'), icon: Users },
    { id: 'insights' as const, label: t('nav.insights'), icon: Lightbulb },
    { id: 'settings' as const, label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="w-full shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-xl px-3 py-2 z-30 shadow-xs">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
