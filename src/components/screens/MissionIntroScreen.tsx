import React from 'react';
import { motion } from 'motion/react';
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
    <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50 text-slate-800 select-none overflow-y-auto scrollbar-none space-y-4">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
          {t('missionIntro.briefing')}
        </span>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Scenario Graphic Card */}
        <div className="relative w-full max-w-[320px] h-40 rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-gradient-to-b from-sky-50 via-cyan-50/50 to-white flex flex-col items-center justify-center p-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-sm mb-1.5">
            {mission.gameType === 'password-forge' ? '🔐' : mission.gameType === 'phishing-inbox' ? '🎣' : '📸'}
          </div>
          <div className="text-xs font-black text-slate-900">
            {mission.title}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-[220px]">
            {mission.subtitle}
          </p>

          <div className="absolute bottom-2 bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            <span>{t('missionIntro.interactiveChallenge')}</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            {mission.title}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {mission.description || mission.subtitle}
          </p>
        </div>

        {/* Mascot Advice Box */}
        <div className="w-full bg-cyan-50/80 border border-cyan-100 rounded-3xl p-3.5 flex items-start gap-3 text-left shadow-xs">
          <CiberMascot size="sm" expression="thinking" className="shrink-0" />
          <div className="flex-1 text-xs text-cyan-950 leading-relaxed">
            <span className="font-bold text-cyan-800 block mb-0.5">
              {t('missionIntro.cyberTipTitle')}
            </span>
            {t('missionIntro.cyberTipBody')}
          </div>
        </div>

        {/* Mission Objectives Breakdown */}
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-4 text-left space-y-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Target className="w-3.5 h-3.5 text-cyan-600" />
            <span>{t('missionIntro.objectives')}</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pl-1">
            <li>{t('missionIntro.obj1')}</li>
            <li>{t('missionIntro.obj2')}</li>
            <li>{t('missionIntro.obj3')}</li>
          </ul>
        </div>
      </div>

      {/* Rewards & Start CTA */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-white border border-slate-100 text-xs font-bold shadow-xs">
          <div className="flex items-center gap-1.5 text-cyan-600">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>+{mission.coinReward} {t('common.coins')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700">
            <Award className="w-3.5 h-3.5 text-purple-500" />
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
