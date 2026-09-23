import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Sparkles } from 'lucide-react';
import { ScreenId } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface IPhoneFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenId;
  onNavigateScreen: (screen: ScreenId) => void;
  isParentMode: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  activeScreen,
  onNavigateScreen,
  isParentMode,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isFrameMode, setIsFrameMode] = useState(true);
  const [showScreenPicker, setShowScreenPicker] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const screenList: { id: ScreenId; label: string; mode: 'child' | 'parent' | 'flow' }[] = [
    { id: 'onboarding', label: '1. Onboarding', mode: 'child' },
    { id: 'profile-creation', label: '2. Crear Perfil Niño', mode: 'child' },
    { id: 'home', label: '3. Home (Game Hub)', mode: 'child' },
    { id: 'worlds', label: '4. Mapa de Mundos', mode: 'child' },
    { id: 'world-detail', label: '5. Detalle de Mundo 1', mode: 'child' },
    { id: 'mission-intro', label: '6. Intro Misión', mode: 'child' },
    { id: 'game', label: '7. Juego Interactivo', mode: 'child' },
    { id: 'mission-result', label: '8. Recompensa & Victoria', mode: 'child' },
    { id: 'achievements', label: '9. Logros & Medallas', mode: 'child' },
    { id: 'profile', label: '10. Perfil & Habilidades', mode: 'child' },
    { id: 'parent-gate', label: '11. Puerta Modo Padres', mode: 'parent' },
    { id: 'parent-dashboard', label: '12. Dashboard para Padres', mode: 'parent' },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 flex flex-col items-center justify-center relative overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Bar for Prototype Controls (Outside the phone) */}
      <header className="w-full max-w-5xl px-4 py-2.5 z-30 flex items-center justify-between text-xs border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white shadow-xs text-xs">
            CK
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-900">CiberKids</span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
              iOS Adventure Game Prototype
            </span>
          </div>
        </div>

        {/* Prototype language & screen controls */}
        <div className="flex items-center gap-2">
          {/* Global Language Selector */}
          <LanguageSelector variant="pills" />

          <div className="relative">
            <button
              onClick={() => setShowScreenPicker(!showScreenPicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer text-xs font-semibold shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden sm:inline">Pantalla:</span>
              <span className="text-cyan-700 max-w-[130px] truncate">
                {screenList.find((s) => s.id === activeScreen)?.label}
              </span>
            </button>

            {showScreenPicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Navegación Directa del Prototipo
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1 mt-1 pr-1 scrollbar-thin">
                  {screenList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onNavigateScreen(s.id);
                        setShowScreenPicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        activeScreen === s.id
                          ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{s.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          s.mode === 'parent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {s.mode === 'parent' ? 'Padres' : 'Niño'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle device frame mode */}
          <button
            onClick={() => setIsFrameMode(!isFrameMode)}
            title={isFrameMode ? 'Ver en pantalla completa' : 'Ver en marco iPhone'}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            {isFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-4 z-10">
        <div
          className={`transition-all duration-300 w-full ${
            isFrameMode
              ? 'max-w-[420px] h-[92vh] max-h-[890px] rounded-[50px] ring-12 ring-slate-900/90 shadow-2xl border-4 border-slate-800 overflow-hidden relative flex flex-col bg-white'
              : 'max-w-2xl min-h-[90vh] rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 flex flex-col bg-white overflow-hidden shadow-md'
          }`}
        >
          {/* iOS Dynamic Island & Status Bar */}
          <div className="w-full shrink-0 z-40 px-7 pt-3 pb-1 flex items-center justify-between text-xs font-semibold select-none bg-white text-slate-800">
            {/* iOS Clock */}
            <span className="tracking-tight text-[13px] font-bold">{currentTime}</span>

            {/* Dynamic Island Pill */}
            <div className="h-6 w-24 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4 fill-slate-800 text-slate-800" />
              </div>
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative bg-slate-50">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full shrink-0 h-5 pb-1 flex items-center justify-center bg-white select-none">
            <div className="w-32 h-1 bg-slate-300 rounded-full hover:bg-slate-400 transition cursor-pointer" />
          </div>
        </div>
      </main>
    </div>
  );
};
