import React from 'react';
import {
  Coins,
  Sparkles,
  Shield,
  Lock,
  ChevronRight,
  Edit3,
  Globe,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AVATAR_OPTIONS } from '../../data';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLevelTitle } from '../../utils/levelSystem';

interface ProfileScreenProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onOpenParentGate: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onEditProfile,
  onOpenParentGate,
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const avatarData = AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const skillList: {
    key: keyof UserProfile['skills'];
    label: string;
    value: number;
    color: string;
  }[] = [
    { key: 'privacidad', label: t('profile.skills.privacidad'), value: profile.skills.privacidad, color: '#0ea5e9' },
    { key: 'contrasenas', label: t('profile.skills.contrasenas'), value: profile.skills.contrasenas, color: '#a855f7' },
    { key: 'phishing', label: t('profile.skills.phishing'), value: profile.skills.phishing, color: '#f59e0b' },
    { key: 'redesSociales', label: t('profile.skills.redesSociales'), value: profile.skills.redesSociales, color: '#ec4899' },
    { key: 'gamingSeguro', label: t('profile.skills.gamingSeguro'), value: profile.skills.gamingSeguro, color: '#10b981' },
    { key: 'iaDeepfakes', label: t('profile.skills.iaDeepfakes'), value: profile.skills.iaDeepfakes, color: '#6366f1' },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-28 space-y-6 sm:space-y-7">
      {/* Top Profile Card */}
      <section className="shrink-0 rounded-3xl p-5 sm:p-6 bg-white border border-slate-100 shadow-sm relative space-y-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-18 h-18 rounded-3xl flex items-center justify-center text-4xl relative shadow-xs shrink-0"
            style={{
              backgroundColor: `${profile.avatarColor}15`,
              border: `2px solid ${profile.avatarColor}`,
            }}
          >
            <span>{avatarData.icon}</span>
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-black shadow-xs ring-2 ring-white">
              {t('common.level')} {profile.level}
            </div>
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black text-slate-900 truncate">
                {profile.nickname}
              </h1>
              <button
                onClick={onEditProfile}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title={t('profile.editTooltip')}
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-cyan-700 font-bold truncate">
              {getLevelTitle(profile.level, language)} · {t('profile.guardianTitle', { age: profile.ageGroup })}
            </div>

            {/* Quick stats mini row */}
            <div className="flex items-center gap-4 pt-1 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-cyan-600 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                {profile.xp} {t('common.xp')}
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {profile.coins} {t('common.coins')}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Counters */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-lg font-black text-slate-900">4 / 45</span>
            <span className="block text-xs text-slate-500 font-bold">{t('profile.missionsCountLabel')}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-lg font-black text-slate-900">
              {profile.unlockedBadges.length} / 18
            </span>
            <span className="block text-xs text-slate-500 font-bold">{t('profile.badgesCountLabel')}</span>
          </div>
        </div>
      </section>

      {/* Language Selector Card */}
      <section className="shrink-0 rounded-3xl p-5 sm:p-6 bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-cyan-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {t('common.language')}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase">
            {language}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                language === lang.id
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CYBERSECURITY SKILLS SECTION */}
      <section className="shrink-0 rounded-3xl p-5 sm:p-6 bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-cyan-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {t('profile.skillsTitle')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">{t('profile.masteryLevel')}</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {skillList.map((skill) => (
            <div key={skill.key} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{skill.label}</span>
                <span className="font-mono text-xs font-black" style={{ color: skill.color }}>
                  {skill.value}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${skill.value}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARENT MODE BANNER */}
      <div
        onClick={onOpenParentGate}
        className="shrink-0 rounded-3xl p-5 sm:p-6 bg-amber-50/90 border border-amber-200 hover:border-amber-300 transition cursor-pointer flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-sm font-black text-amber-900">
              {t('profile.parentModeTitle')}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('profile.parentModeDesc')}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-amber-700 shrink-0" />
      </div>
    </div>
  );
};
