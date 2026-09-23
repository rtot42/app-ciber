import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Settings,
  Bell,
  Globe,
  Brain,
  FileText,
  Moon,
  Lock,
  Plus,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ParentBottomNav } from '../NavigationBars';
import { useLanguage } from '../../i18n/LanguageContext';
import { ConversationStarterCard } from '../parent/ConversationStarterCard';
import { ParentPedagogyTracker } from '../parent/ParentPedagogyTracker';
import { ParentStudyHub } from '../parent/ParentStudyHub';

interface ParentDashboardScreenProps {
  profile: UserProfile;
  onReturnToChildMode: () => void;
  onNavigateToWorld?: () => void;
}

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  profile,
  onReturnToChildMode,
  onNavigateToWorld,
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'children' | 'insights' | 'settings'>('dashboard');

  const [selectedTimeLimit, setSelectedTimeLimit] = useState<string>('30');
  const [nightCurfew, setNightCurfew] = useState<boolean>(true);
  const [weeklyReports, setWeeklyReports] = useState<boolean>(true);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('2468');

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between bg-slate-50 text-slate-800 select-none overflow-hidden">
      {/* Mature, Calm Parent Header */}
      <header className="px-5 sm:px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm">
            P
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
              {t('parentDashboard.title')}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'fr'
                ? 'Suivi pédagogique & école de cybersécurité'
                : language === 'es'
                ? 'Seguimiento pedagógico y escuela de ciberseguridad'
                : 'Pedagogical tracking & cybersecurity hub'}
            </p>
          </div>
        </div>

        <button
          onClick={onReturnToChildMode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('parentDashboard.childModeBtn')}</span>
        </button>
      </header>

      {/* Main Content Area per Tab */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6 sm:space-y-7 scrollbar-none pb-28">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Child Profile Bar */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">
                    {profile.nickname}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('profile.guardianTitle', { age: profile.ageGroup })} • Lvl {profile.level}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase font-bold text-slate-400 block">
                  {t('parentDashboard.lastActivity')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {t('parentDashboard.lastActivityTime')}
                </span>
              </div>
            </div>

            {/* General Progress Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">
                    {t('parentDashboard.safetyScore')}
                  </span>
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>92%</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +12% {t('parentDashboard.trendUp')}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t('parentDashboard.missionsCompleted')}
                  </span>
                  <span className="text-base font-black text-slate-900">
                    4 / 45
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t('parentDashboard.screenTimeToday')}
                  </span>
                  <span className="text-base font-black text-slate-900">
                    18 min
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Conversation Starter */}
            <ConversationStarterCard ageGroup={profile.ageGroup} />

            {/* Direct Link to Family Study Hub */}
            <div
              onClick={() => setActiveTab('insights')}
              className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black">
                    {language === 'fr'
                      ? 'Centre d’Études Familial'
                      : language === 'es'
                      ? 'Centro de Aprendizaje Familiar'
                      : 'Family Cyber Study Hub'}
                  </div>
                  <div className="text-xs text-blue-100">
                    {language === 'fr'
                      ? '6 guides essentiels (Roblox, Deepfakes, Mots de Passe)'
                      : language === 'es'
                      ? '6 guías esenciales (Roblox, Deepfakes, Contraseñas)'
                      : '6 essential guides (Roblox, Deepfakes, Passwords)'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
            </div>

            {/* Recent Activity Feed */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{t('parentDashboard.recentActivity')}</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">{t('parentDashboard.today')}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {t('parentDashboard.activity1Title')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('parentDashboard.activity1Desc')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {t('parentDashboard.activity2Title')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('parentDashboard.activity2Desc')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            {/* Child Profile Header Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">{profile.nickname}</div>
                  <div className="text-xs text-slate-500">
                    {profile.ageGroup} {t('profileCreation.years')} • {t('worlds.status.active')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-cyan-700 font-black block">Lvl {profile.level}</span>
                <span className="text-xs text-emerald-600 font-bold">78% {language === 'fr' ? 'maîtrise' : language === 'es' ? 'dominio' : 'mastery'}</span>
              </div>
            </div>

            {/* Detailed Pedagogical Tracking Engine */}
            <ParentPedagogyTracker
              profile={profile}
              onExploreWorld={onNavigateToWorld}
            />

            <button className="w-full py-4 rounded-3xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>{t('parentDashboard.addChildBtn')}</span>
            </button>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                {language === 'fr'
                  ? 'École de Cybersécurité pour Parents'
                  : language === 'es'
                  ? 'Escuela de Ciberseguridad para Familias'
                  : 'Family Cybersecurity Learning Center'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'fr'
                  ? 'Guides pratiques et accords familiaux pour naviguer sereinement'
                  : language === 'es'
                  ? 'Guías prácticas y acuerdos familiares para navegar con confianza'
                  : 'Actionable guides and agreements to foster digital resilience'}
              </p>
            </div>

            {/* Full Parent Study Hub */}
            <ParentStudyHub />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('parentDashboard.settingsTabTitle')}
            </h2>

            {/* Language Setting */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-800 font-bold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-600" />
                  <span>{t('parentDashboard.languageSelect')}</span>
                </span>
                <span className="text-xs text-slate-400 font-black uppercase">{language}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
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
            </div>

            {/* Screen Time Limit Control */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{t('parentDashboard.timeLimitLabel')}</span>
                </span>
                <span className="font-black text-amber-600">
                  {selectedTimeLimit === '0'
                    ? (language === 'fr' ? 'Illimité' : language === 'es' ? 'Sin límite' : 'Unlimited')
                    : `${selectedTimeLimit} min`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: '20', label: '20m' },
                  { val: '30', label: '30m' },
                  { val: '45', label: '45m' },
                  { val: '0', label: language === 'fr' ? 'Sans' : language === 'es' ? 'Sin' : 'None' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedTimeLimit(item.val)}
                    className={`py-2 rounded-2xl text-xs font-bold transition cursor-pointer border ${
                      selectedTimeLimit === item.val
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Night Curfew Switch */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {language === 'fr'
                      ? 'Couvre-Feu Nocturne'
                      : language === 'es'
                      ? 'Bloqueo Nocturno'
                      : 'Nighttime Curfew'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {language === 'fr'
                      ? 'Désactive l’accès entre 21h00 et 07h00'
                      : language === 'es'
                      ? 'Pausa el acceso entre las 21:00 y las 07:00'
                      : 'Pauses access between 9:00 PM and 7:00 AM'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setNightCurfew(!nightCurfew)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  nightCurfew ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    nightCurfew ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Reports Switch */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {language === 'fr'
                      ? 'Rapports Hebdomadaires par E-mail'
                      : language === 'es'
                      ? 'Reportes Semanales por Correo'
                      : 'Weekly Email Reports'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {language === 'fr'
                      ? 'Recevez un résumé des leçons réussies'
                      : language === 'es'
                      ? 'Recibe un resumen de conceptos aprendidos'
                      : 'Receive a summary of mastered concepts'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  weeklyReports ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    weeklyReports ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Parent Bottom Navigation Bar */}
      <ParentBottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
    </div>
  );
};
