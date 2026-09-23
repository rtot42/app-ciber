import React from 'react';
import { motion } from 'motion/react';
import {
  Coins,
  Sparkles,
  Shield,
  Award,
  Lock,
  ChevronRight,
  Edit3,
  CheckCircle2,
  Sliders,
  Globe,
} from 'lucide-react';
import { UserProfile, Language } from '../../types';
import { AVATAR_OPTIONS } from '../../data';
import { CiberMascot } from '../CiberMascot';
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
    <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none pb-24 space-y-4">
      {/* Top Profile Card */}
      <div className="shrink-0 rounded-3xl p-4 sm:p-5 bg-white border border-slate-100 shadow-sm relative">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative shadow-xs shrink-0"
            style={{
              backgroundColor: `${profile.avatarColor}15`,
              border: `2px solid ${profile.avatarColor}`,
            }}
          >
            <span>{avatarData.icon}</span>
            <div className="absolute -bottom-2 px-2 py-0.2 rounded-full bg-cyan-500 text-white text-[10px] font-black shadow-xs">
              Lvl {profile.level}
            </div>
          </div>

          {/* Player info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-black text-slate-900 truncate">
                {profile.nickname}
              </h1>
              <button
                onClick={onEditProfile}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title={t('profile.editTooltip')}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-cyan-700 font-bold truncate">
              {getLevelTitle(profile.level, language)} · {t('profile.guardianTitle', { age: profile.ageGroup })}
            </div>

            {/* Quick stats mini row */}
            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-cyan-600">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                {profile.xp} {t('common.xp')}
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <Coins className="w-3 h-3 fill-amber-400 text-amber-500" />
                {profile.coins} {t('common.coins')}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Counters */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-base font-black text-slate-900">4 / 45</span>
            <span className="block text-[10px] text-slate-500 font-bold">{t('profile.missionsCountLabel')}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-base font-black text-slate-900">3 / 18</span>
            <span className="block text-[10px] text-slate-500 font-bold">{t('profile.badgesCountLabel')}</span>
          </div>
        </div>
      </div>

      {/* Language Selector Card */}
      <div className="shrink-0 rounded-3xl p-4 sm:p-5 bg-white border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {t('common.language')}
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">
            {language.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
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
      </div>

      {/* CYBERSECURITY SKILLS SECTION */}
      <div className="shrink-0 rounded-3xl p-4 sm:p-5 bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {t('profile.skillsTitle')}
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">{t('profile.masteryLevel')}</span>
        </div>

        <div className="space-y-2.5">
          {skillList.map((skill) => (
            <div key={skill.key} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 text-[11px] font-bold">{skill.label}</span>
                <span className="font-mono text-[11px] font-black" style={{ color: skill.color }}>
                  {skill.value}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
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
      </div>

      {/* PARENT MODE BANNER */}
      <div
        onClick={onOpenParentGate}
        className="shrink-0 rounded-3xl p-4 sm:p-5 bg-amber-50/80 border border-amber-200 hover:border-amber-300 transition cursor-pointer flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-amber-900">
              {t('profile.parentModeTitle')}
            </div>
            <p className="text-[10px] text-slate-600">
              {t('profile.parentModeDesc')}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-amber-700" />
      </div>
    </div>
  );
};
