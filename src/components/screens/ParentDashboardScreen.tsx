import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Clock,
  Award,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  User,
  Settings,
  Bell,
  Sliders,
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

  // Interactive settings state
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<string>('30');
  const [nightCurfew, setNightCurfew] = useState<boolean>(true);
  const [weeklyReports, setWeeklyReports] = useState<boolean>(true);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('2468');

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between bg-slate-50 text-slate-800 select-none overflow-hidden">
      {/* Mature, Calm Parent Header */}
      <header className="px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-xs">
            P
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">
              {t('parentDashboard.title')}
            </h1>
            <p className="text-[10px] text-slate-500">
              {language === 'fr'
                ? 'Suivi pédagogique & école de cybersécurité'
                : language === 'en'
                ? 'Pedagogical tracking & cybersecurity hub'
                : 'Seguimiento pedagógico y escuela de ciberseguridad'}
            </p>
          </div>
        </div>

        <button
          onClick={onReturnToChildMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('parentDashboard.childModeBtn')}</span>
        </button>
      </header>

      {/* Main Content Area per Tab */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-none pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5">
            {/* Child Profile Bar */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {profile.nickname}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t('profile.guardianTitle', { age: profile.ageGroup })} • Lvl {profile.level}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {t('parentDashboard.lastActivity')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {t('parentDashboard.lastActivityTime')}
                </span>
              </div>
            </div>

            {/* General Progress Card */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500">
                    {t('parentDashboard.generalProgress')}
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    78%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-400 bg-amber-50 flex items-center justify-center font-black text-amber-700 text-xs">
                  78%
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full w-[78%]" />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('parentDashboard.progressDesc')}
              </p>
            </div>

            {/* Strengths & Practice Areas */}
            <div className="grid grid-cols-2 gap-3">
              {/* Strengths */}
              <div className="p-3.5 rounded-3xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('parentDashboard.strengths')}</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-700">
                  <li className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('parentDashboard.strength1')}</span>
                  </li>
                  <li className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('parentDashboard.strength2')}</span>
                  </li>
                </ul>
              </div>

              {/* Needs Practice */}
              <div className="p-3.5 rounded-3xl bg-amber-50/70 border border-amber-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t('parentDashboard.needsPractice')}</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-700">
                  <li className="flex items-center gap-1.5 font-medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{t('parentDashboard.practice1')}</span>
                  </li>
                  <li className="flex items-center gap-1.5 font-medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{t('parentDashboard.practice2')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interactive Rotating Conversation Starter Card */}
            <ConversationStarterCard />

            {/* Quick Banner: Study Hub Shortcut */}
            <div
              onClick={() => setActiveTab('insights')}
              className="p-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-cyan-600 text-white shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:opacity-95 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                  📚
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-200 block">
                    {language === 'fr' ? 'Formation pour Parents' : language === 'en' ? 'Parent Cybersecurity Guides' : 'Centro de Estudio para Padres'}
                  </span>
                  <div className="text-xs font-black">
                    {language === 'fr'
                      ? '6 guides essentiels (Roblox, Deepfakes, Mots de passe)'
                      : language === 'en'
                      ? '6 essential guides (Roblox, Deepfakes, Passwords)'
                      : '6 guías esenciales (Roblox, Deepfakes, Contraseñas)'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
            </div>

            {/* Recent Activity Feed */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{t('parentDashboard.recentActivity')}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{t('parentDashboard.today')}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {t('parentDashboard.activity1Title')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {t('parentDashboard.activity1Desc')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {t('parentDashboard.activity2Title')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {t('parentDashboard.activity2Desc')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-3.5">
            {/* Child Profile Header Banner */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{profile.nickname}</div>
                  <div className="text-xs text-slate-500">
                    {profile.ageGroup} {t('profileCreation.years')} • {t('worlds.status.active')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-cyan-700 font-black block">Lvl {profile.level}</span>
                <span className="text-[10px] text-emerald-600 font-bold">78% {language === 'fr' ? 'maîtrise' : language === 'en' ? 'mastery' : 'dominio'}</span>
              </div>
            </div>

            {/* Detailed Pedagogical Tracking Engine */}
            <ParentPedagogyTracker
              profile={profile}
              onExploreWorld={onNavigateToWorld}
            />

            <button className="w-full py-3.5 rounded-3xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>{t('parentDashboard.addChildBtn')}</span>
            </button>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                {language === 'fr'
                  ? 'École de Cybersécurité pour Parents'
                  : language === 'en'
                  ? 'Family Cybersecurity Learning Center'
                  : 'Escuela de Ciberseguridad para Familias'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {language === 'fr'
                  ? 'Guides pratiques et accords familiaux pour naviguer sereinement'
                  : language === 'en'
                  ? 'Actionable guides and agreements to foster digital resilience'
                  : 'Guías prácticas y acuerdos familiares para navegar con confianza'}
              </p>
            </div>

            {/* Full Parent Study Hub with 6 comprehensive guides + Digital Agreement */}
            <ParentStudyHub />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('parentDashboard.settingsTabTitle')}
            </h2>

            {/* Language Setting in Parent Dashboard */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-600" />
                  <span>{t('parentDashboard.languageSelect')}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-black">{language.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`py-2 px-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
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
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>{t('parentDashboard.timeLimitLabel')}</span>
                </span>
                <span className="font-black text-amber-600">
                  {selectedTimeLimit === '0'
                    ? (language === 'fr' ? 'Illimité' : language === 'en' ? 'Unlimited' : 'Sin límite')
                    : `${selectedTimeLimit} min`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: '20', label: '20 min' },
                  { val: '30', label: '30 min' },
                  { val: '45', label: '45 min' },
                  { val: '0', label: language === 'fr' ? 'Libre' : language === 'en' ? 'None' : 'Libre' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedTimeLimit(item.val)}
                    className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      selectedTimeLimit === item.val
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-slate-50 border-slate-200/70 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Night Curfew Mode */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>
                    {language === 'fr'
                      ? 'Couvre-feu nocturne (21h - 8h)'
                      : language === 'en'
                      ? 'Night Curfew (9 PM - 8 AM)'
                      : 'Toque de queda nocturno (21:00 - 08:00)'}
                  </span>
                </span>
                <p className="text-[10px] text-slate-500">
                  {language === 'fr'
                    ? 'Bloque automatiquement l\'accès aux jeux pendant la nuit'
                    : language === 'en'
                    ? 'Automatically restricts gameplay during sleep hours'
                    : 'Bloquea el acceso a misiones para asegurar descanso'}
                </p>
              </div>

              <button
                onClick={() => setNightCurfew(!nightCurfew)}
                className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer ${
                  nightCurfew ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition shadow-xs ${
                    nightCurfew ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Notifications & Weekly Reports */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>{t('parentDashboard.notificationsLabel')}</span>
                </span>
                <p className="text-[10px] text-slate-500">
                  {language === 'fr'
                    ? 'Résumé des progrès envoyé par email chaque dimanche'
                    : language === 'en'
                    ? 'Progress digest sent by email every Sunday'
                    : 'Resumen pedagógico enviado por email cada domingo'}
                </p>
              </div>

              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer ${
                  weeklyReports ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition shadow-xs ${
                    weeklyReports ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Parent PIN */}
            <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-800 font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-600" />
                  <span>{t('parentDashboard.pinLabel')}</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  {language === 'fr' ? 'Code de sécurité : ' : language === 'en' ? 'Security code: ' : 'Código de seguridad: '}
                  ••••
                </span>
              </div>

              <button
                onClick={() => setShowPinModal(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold transition cursor-pointer border border-cyan-200 text-xs"
              >
                {t('parentDashboard.pinValue')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PIN Modifier Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-100"
            >
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {language === 'fr' ? 'Modifier le Code PIN' : language === 'en' ? 'Modify Parent PIN' : 'Modificar Código PIN'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'fr'
                    ? '4 chiffres pour protéger l\'accès à l\'espace parents'
                    : language === 'en'
                    ? '4 digits to restrict access to the parent area'
                    : '4 dígitos para restringir el acceso al área de adultos'}
                </p>
              </div>

              <input
                type="text"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-xl font-black py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-cyan-500"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer transition"
                >
                  {t('common.close')}
                </button>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 cursor-pointer transition shadow-xs"
                >
                  {t('common.save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Parent Bottom Navigation */}
      <ParentBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onExitParentMode={onReturnToChildMode}
      />
    </div>
  );
};
