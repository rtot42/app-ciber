import React from 'react';
import { ArrowLeft, Play, ShieldAlert, Sparkles, Award, Target, Coins } from 'lucide-react';
import { Mission } from '../../types';
import { CiberMascot } from '../CiberMascot';
import { useLanguage } from '../../i18n/LanguageContext';

interface MissionIntroScreenProps {
  mission: Mission;
  onStartGame: () => void;
  onBack: () => void;
}

export const MissionIntroScreen: React.FC<MissionIntroScreenProps> = ({
  mission,
  onStartGame,
  onBack,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between p-5 sm:p-6 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-6 sm:space-y-7 pb-8">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200">
          {t('missionIntro.briefing')}
        </span>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto">
        {/* Scenario Graphic Card */}
        <div className="relative w-full max-w-[340px] rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white flex flex-col items-center justify-center p-6 space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-sm mb-1">
            {mission.gameType === 'password-forge' ? '🔐' : mission.gameType === 'phishing-inbox' ? '🎣' : '📸'}
          </div>
          <div className="text-sm font-black text-slate-900">
            {mission.title}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[260px]">
            {mission.subtitle}
          </p>

          <div className="mt-2 text-amber-900 bg-amber-100 border border-amber-200 text-xs font-bold px-3 py-1 rounded-2xl flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('missionIntro.interactiveChallenge')}</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mission.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {mission.description || mission.subtitle}
          </p>
        </div>

        {/* Mascot Advice Box */}
        <div className="w-full bg-cyan-50/80 border border-cyan-100 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 text-left shadow-xs">
          <CiberMascot size="sm" expression="thinking" className="shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm text-cyan-950 leading-relaxed space-y-0.5">
            <span className="font-extrabold text-cyan-800 block">
              {t('missionIntro.cyberTipTitle')}
            </span>
            <p className="text-cyan-900">{t('missionIntro.cyberTipBody')}</p>
          </div>
        </div>

        {/* Mission Objectives Breakdown */}
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-5 text-left space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-cyan-600" />
            <span>{t('missionIntro.objectives')}</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc list-inside pl-1 leading-relaxed">
            <li>{t('missionIntro.obj1')}</li>
            <li>{t('missionIntro.obj2')}</li>
            <li>{t('missionIntro.obj3')}</li>
          </ul>
        </div>
      </div>

      {/* Rewards & Start CTA */}
      <div className="space-y-4 pt-2 shrink-0">
        <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-white border border-slate-100 text-xs sm:text-sm font-bold shadow-xs">
          <div className="flex items-center gap-1.5 text-cyan-600 font-extrabold">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 font-extrabold">
            <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>+{mission.coinReward} {t('common.coins')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700 font-extrabold">
            <Award className="w-4 h-4 text-purple-500" />
            <span>{t('common.badge')}</span>
          </div>
        </div>

        <button
          onClick={onStartGame}
          className="w-full py-4 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{t('missionIntro.startMission')}</span>
        </button>
      </div>
    </div>
  );
};
