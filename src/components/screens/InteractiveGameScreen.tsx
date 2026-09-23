import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Gamepad2, Sparkles, ChevronDown } from 'lucide-react';
import { InteractivePhoto } from '../InteractivePhoto';
import { PasswordForgeGame } from '../games/PasswordForgeGame';
import { PhishingInboxGame } from '../games/PhishingInboxGame';
import { ChatSimGame } from '../games/ChatSimGame';
import { PrivacyDialGame } from '../games/PrivacyDialGame';
import { SafeRiskySortGame } from '../games/SafeRiskySortGame';
import { DragDropGame } from '../games/DragDropGame';
import { MemoryMatchGame } from '../games/MemoryMatchGame';
import { PuzzleVaultGame } from '../games/PuzzleVaultGame';
import { AiDetectorGame } from '../games/AiDetectorGame';
import { IncidentResponseGame } from '../games/IncidentResponseGame';
import { QuizGame } from '../games/QuizGame';
import { CiberMascot } from '../CiberMascot';
import { UserProfile, Mission, GameType, MascotExpression, ChildAgeGroup } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface InteractiveGameScreenProps {
  mission?: Mission;
  profile?: UserProfile;
  initialGameType?: GameType;
  onCompleteGame: () => void;
  onExitGame: () => void;
}

export const InteractiveGameScreen: React.FC<InteractiveGameScreenProps> = ({
  mission,
  profile,
  initialGameType,
  onCompleteGame,
  onExitGame,
}) => {
  const { t, language } = useLanguage();
  const [activeGameType, setActiveGameType] = useState<GameType>(
    initialGameType || mission?.gameType || 'image-detection'
  );
  const [showMechanicPicker, setShowMechanicPicker] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ciberExpression, setCiberExpression] = useState<MascotExpression>('happy');

  const ageGroup: ChildAgeGroup = profile?.ageGroup || '8–10';

  const getMechanicLabels = () => {
    if (language === 'fr') {
      return [
        { type: 'image-detection' as GameType, label: '1. Détection Photos', icon: '📸' },
        { type: 'password-forge' as GameType, label: '2. Forge Mots de Passe', icon: '🔐' },
        { type: 'phishing-inbox' as GameType, label: '3. Boîte Hameçonnage', icon: '🎣' },
        { type: 'chat-sim' as GameType, label: '4. Simulateur Chat', icon: '💬' },
        { type: 'privacy-dial' as GameType, label: '5. Cadran Vie Privée', icon: '🎛️' },
        { type: 'safe-risky-sort' as GameType, label: '6. Sûr ou Risqué', icon: '⚖️' },
        { type: 'drag-drop' as GameType, label: '7. Blocs Pare-feu', icon: '🧱' },
        { type: 'memory-match' as GameType, label: '8. Paires de Mémoire', icon: '🃏' },
        { type: 'puzzle-vault' as GameType, label: '9. Coffre-fort Énigmes', icon: '🗝️' },
        { type: 'ai-detector' as GameType, label: '10. Détecteur IA', icon: '✨' },
        { type: 'incident-response' as GameType, label: '11. Aide aux Incidents', icon: '🛟' },
        { type: 'quiz' as GameType, label: '12. Choix Visuel', icon: '❓' },
      ];
    }
    if (language === 'es') {
      return [
        { type: 'image-detection' as GameType, label: '1. Detección en Fotos', icon: '📸' },
        { type: 'password-forge' as GameType, label: '2. Forja de Contraseñas', icon: '🔐' },
        { type: 'phishing-inbox' as GameType, label: '3. Bandeja Phishing', icon: '🎣' },
        { type: 'chat-sim' as GameType, label: '4. Simulador de Chat', icon: '💬' },
        { type: 'privacy-dial' as GameType, label: '5. Dial de Privacidad', icon: '🎛️' },
        { type: 'safe-risky-sort' as GameType, label: '6. Seguro o Riesgoso', icon: '⚖️' },
        { type: 'drag-drop' as GameType, label: '7. Armador de Bloques', icon: '🧱' },
        { type: 'memory-match' as GameType, label: '8. Parejas de Memoria', icon: '🃏' },
        { type: 'puzzle-vault' as GameType, label: '9. Bóveda de Enigmas', icon: '🗝️' },
        { type: 'ai-detector' as GameType, label: '10. Detector de IA', icon: '✨' },
        { type: 'incident-response' as GameType, label: '11. Respuesta a Incidentes', icon: '🛟' },
        { type: 'quiz' as GameType, label: '12. Decisión Visual', icon: '❓' },
      ];
    }
    return [
      { type: 'image-detection' as GameType, label: '1. Photo Risk Hunt', icon: '📸' },
      { type: 'password-forge' as GameType, label: '2. Password Forge', icon: '🔐' },
      { type: 'phishing-inbox' as GameType, label: '3. Phishing Inbox', icon: '🎣' },
      { type: 'chat-sim' as GameType, label: '4. Safe Chat Sim', icon: '💬' },
      { type: 'privacy-dial' as GameType, label: '5. Privacy Dial', icon: '🎛️' },
      { type: 'safe-risky-sort' as GameType, label: '6. Safe or Risky', icon: '⚖️' },
      { type: 'drag-drop' as GameType, label: '7. Firewall Blocks', icon: '🧱' },
      { type: 'memory-match' as GameType, label: '8. Memory Match', icon: '🃏' },
      { type: 'puzzle-vault' as GameType, label: '9. Enigma Vault', icon: '🗝️' },
      { type: 'ai-detector' as GameType, label: '10. AI Detector', icon: '✨' },
      { type: 'incident-response' as GameType, label: '11. Incident Help', icon: '🛟' },
      { type: 'quiz' as GameType, label: '12. Visual Choice', icon: '❓' },
    ];
  };

  const gameMechanics = getMechanicLabels();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 select-none relative overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <button
          onClick={onExitGame}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('gameScreen.back')}</span>
        </button>

        {/* Mechanic Quick Selector Dropdown & Age Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-800">
            {ageGroup} {language === 'fr' ? 'ans' : language === 'es' ? 'años' : 'yrs'}
          </span>
          <div className="relative">
          <button
            onClick={() => setShowMechanicPicker(!showMechanicPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200/60"
          >
            <span>{gameMechanics.find((m) => m.type === activeGameType)?.icon}</span>
            <span className="max-w-[130px] truncate">{gameMechanics.find((m) => m.type === activeGameType)?.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showMechanicPicker && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('gameScreen.allMechanics')}
              </div>
              <div className="space-y-1 mt-1">
                {gameMechanics.map((gm) => (
                  <button
                    key={gm.type}
                    onClick={() => {
                      setActiveGameType(gm.type);
                      setShowMechanicPicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer ${
                      activeGameType === gm.type
                        ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{gm.icon}</span>
                    <span className="truncate">{gm.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Hint button */}
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center transition cursor-pointer hover:bg-cyan-100"
          title={t('gameScreen.hintTitle')}
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Hint Overlay */}
      {showHint && (
        <div className="bg-sky-50 border-b border-sky-200 p-3 px-4 flex items-center gap-3 z-30 shadow-sm animate-in slide-in-from-top-1">
          <CiberMascot size="sm" expression="thinking" className="shrink-0" />
          <div className="text-xs text-sky-950 flex-1">
            <span className="font-bold">{t('gameScreen.hintTitle')}</span> {t('gameScreen.hintText')}
          </div>
          <button
            onClick={() => setShowHint(false)}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 px-2 py-1"
          >
            {t('gameScreen.understood')}
          </button>
        </div>
      )}

      {/* Render Active Game Mechanic */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeGameType === 'image-detection' && (
          <InteractivePhoto
            ageGroup={ageGroup}
            onAllRisksFound={onCompleteGame}
            onCiberReact={(exp) => setCiberExpression(exp)}
          />
        )}
        {activeGameType === 'password-forge' && (
          <PasswordForgeGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'phishing-inbox' && (
          <PhishingInboxGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'chat-sim' && (
          <ChatSimGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'privacy-dial' && (
          <PrivacyDialGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'safe-risky-sort' && (
          <SafeRiskySortGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'drag-drop' && (
          <DragDropGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'memory-match' && (
          <MemoryMatchGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'puzzle-vault' && (
          <PuzzleVaultGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'ai-detector' && (
          <AiDetectorGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'incident-response' && (
          <IncidentResponseGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'quiz' && (
          <QuizGame ageGroup={ageGroup} onComplete={onCompleteGame} />
        )}
      </div>
    </div>
  );
};
