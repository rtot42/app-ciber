import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  Volume2,
  VolumeX,
  SlidersHorizontal,
} from 'lucide-react';
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
import { AppPermissionsGame } from '../games/AppPermissionsGame';
import { UrlInspectorGame } from '../games/UrlInspectorGame';
import { WifiShieldGame } from '../games/WifiShieldGame';
import { CyberBullyShieldGame } from '../games/CyberBullyShieldGame';
import { DigitalFootprintGame } from '../games/DigitalFootprintGame';
import { CyberRunnerGame } from '../games/CyberRunnerGame';
import { CyberSnakeGame } from '../games/CyberSnakeGame';
import { CyberPacmanGame } from '../games/CyberPacmanGame';
import { CyberInvadersGame } from '../games/CyberInvadersGame';
import { CyberFlappyGame } from '../games/CyberFlappyGame';
import { CyberTetrisGame } from '../games/CyberTetrisGame';
import { CyberPvzGame } from '../games/CyberPvzGame';
import { CyberDinoGame } from '../games/CyberDinoGame';
import { CiberMascot } from '../CiberMascot';
import {
  UserProfile,
  Mission,
  GameType,
  MascotExpression,
  ChildAgeGroup,
  GameResultStats,
} from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { isGameAudioMuted, toggleGameAudioMuted } from '../../utils/gameAudio';

interface InteractiveGameScreenProps {
  mission?: Mission;
  profile?: UserProfile;
  initialGameType?: GameType;
  openPickerInitially?: boolean;
  onChangeAgeGroup?: (age: ChildAgeGroup) => void;
  onCompleteGame: (stats?: GameResultStats) => void;
  onExitGame: () => void;
}

const AGE_TIERS: ChildAgeGroup[] = ['8–10', '11–12', '13–14'];

export const InteractiveGameScreen: React.FC<InteractiveGameScreenProps> = ({
  mission,
  profile,
  initialGameType,
  openPickerInitially = false,
  onChangeAgeGroup,
  onCompleteGame,
  onExitGame,
}) => {
  const { t, language } = useLanguage();
  const [activeGameType, setActiveGameType] = useState<GameType>(
    initialGameType || mission?.gameType || 'image-detection'
  );
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<ChildAgeGroup>(
    profile?.ageGroup || '8–10'
  );
  const [showMechanicPicker, setShowMechanicPicker] = useState(openPickerInitially);
  const [showHint, setShowHint] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => isGameAudioMuted());
  const [, setCiberExpression] = useState<MascotExpression>('happy');

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
        { type: 'puzzle-vault' as GameType, label: '9. Coffre Énigmes', icon: '🗝️' },
        { type: 'ai-detector' as GameType, label: '10. Détecteur IA', icon: '✨' },
        { type: 'incident-response' as GameType, label: '11. Aide Incidents', icon: '🛟' },
        { type: 'quiz' as GameType, label: '12. Quiz Tactique', icon: '❓' },
        { type: 'app-permissions' as GameType, label: '13. Permissions Applis', icon: '📱' },
        { type: 'url-inspector' as GameType, label: '14. Inspecteur URL', icon: '🔗' },
        { type: 'wifi-shield' as GameType, label: '15. Bouclier Wi-Fi', icon: '📡' },
        { type: 'cyber-bully-shield' as GameType, label: '16. Anti-Cyberharcèlement', icon: '🛡️' },
        { type: 'digital-footprint' as GameType, label: '17. Empreinte Numérique', icon: '👣' },
        { type: 'cyber-runner' as GameType, label: '18. CiberMario 2D', icon: '🕹️' },
        { type: 'cyber-snake' as GameType, label: '19. CiberSnake Réseau', icon: '🐍' },
        { type: 'cyber-pacman' as GameType, label: '20. CiberPac Labyrinthe', icon: '👻' },
        { type: 'cyber-invaders' as GameType, label: '21. Envahisseurs Malware', icon: '🚀' },
        { type: 'cyber-flappy' as GameType, label: '22. Flappy Pare-feu', icon: '🐦' },
        { type: 'cyber-tetris' as GameType, label: '23. Tetris Pare-feu', icon: '🧱' },
        { type: 'cyber-pvz' as GameType, label: '24. Défense par Voies (PvZ)', icon: '🌻' },
        { type: 'cyber-dino' as GameType, label: '25. CiberDino Runner', icon: '🦖' },
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
        { type: 'drag-drop' as GameType, label: '7. Bloques Cortafuegos', icon: '🧱' },
        { type: 'memory-match' as GameType, label: '8. Parejas de Memoria', icon: '🃏' },
        { type: 'puzzle-vault' as GameType, label: '9. Bóveda de Enigmas', icon: '🗝️' },
        { type: 'ai-detector' as GameType, label: '10. Detector de IA', icon: '✨' },
        { type: 'incident-response' as GameType, label: '11. Respuesta a Incidentes', icon: '🛟' },
        { type: 'quiz' as GameType, label: '12. Trivia Táctica', icon: '❓' },
        { type: 'app-permissions' as GameType, label: '13. Auditoría de Permisos', icon: '📱' },
        { type: 'url-inspector' as GameType, label: '14. Inspector de Enlaces', icon: '🔗' },
        { type: 'wifi-shield' as GameType, label: '15. Escudo Wi-Fi Público', icon: '📡' },
        { type: 'cyber-bully-shield' as GameType, label: '16. Testigo Solidario', icon: '🛡️' },
        { type: 'digital-footprint' as GameType, label: '17. Huella Digital', icon: '👣' },
        { type: 'cyber-runner' as GameType, label: '18. CiberMario 2D', icon: '🕹️' },
        { type: 'cyber-snake' as GameType, label: '19. CiberSnake de Red', icon: '🐍' },
        { type: 'cyber-pacman' as GameType, label: '20. CiberPac Laberinto', icon: '👻' },
        { type: 'cyber-invaders' as GameType, label: '21. Invasores Malware', icon: '🚀' },
        { type: 'cyber-flappy' as GameType, label: '22. Flappy Cortafuegos', icon: '🐦' },
        { type: 'cyber-tetris' as GameType, label: '23. Tetris Cortafuegos', icon: '🧱' },
        { type: 'cyber-pvz' as GameType, label: '24. Defensa Cyber PvZ', icon: '🌻' },
        { type: 'cyber-dino' as GameType, label: '25. CiberDino Runner', icon: '🦖' },
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
      { type: 'quiz' as GameType, label: '12. Tactical Quiz', icon: '❓' },
      { type: 'app-permissions' as GameType, label: '13. App Permissions', icon: '📱' },
      { type: 'url-inspector' as GameType, label: '14. URL Inspector', icon: '🔗' },
      { type: 'wifi-shield' as GameType, label: '15. Public Wi-Fi Shield', icon: '📡' },
      { type: 'cyber-bully-shield' as GameType, label: '16. Upstander Defense', icon: '🛡️' },
      { type: 'digital-footprint' as GameType, label: '17. Digital Footprint', icon: '👣' },
      { type: 'cyber-runner' as GameType, label: '18. CyberMario 2D', icon: '🕹️' },
      { type: 'cyber-snake' as GameType, label: '19. CyberSnake Network', icon: '🐍' },
      { type: 'cyber-pacman' as GameType, label: '20. CyberPac Maze', icon: '👻' },
      { type: 'cyber-invaders' as GameType, label: '21. Malware Invaders', icon: '🚀' },
      { type: 'cyber-flappy' as GameType, label: '22. Flappy Firewall', icon: '🐦' },
      { type: 'cyber-tetris' as GameType, label: '23. Firewall Tetris', icon: '🧱' },
      { type: 'cyber-pvz' as GameType, label: '24. Cyber Defense PvZ', icon: '🌻' },
      { type: 'cyber-dino' as GameType, label: '25. CyberDino Runner', icon: '🦖' },
    ];
  };

  const gameMechanics = getMechanicLabels();
  const activeMeta = gameMechanics.find((m) => m.type === activeGameType) || gameMechanics[0];

  const handleSwitchAge = (age: ChildAgeGroup) => {
    setSelectedAgeGroup(age);
    onChangeAgeGroup?.(age);
  };

  const handleToggleSound = () => {
    const nextMuted = toggleGameAudioMuted();
    setMuted(nextMuted);
  };

  const getAgePillLabel = (age: ChildAgeGroup) => {
    if (age === '8–10') {
      return language === 'fr' ? 'Cadet 8–10' : language === 'en' ? 'Cadet 8–10' : 'Cadete 8–10';
    }
    if (age === '11–12') {
      return language === 'fr' ? 'Tactique 11–12' : language === 'en' ? 'Tactical 11–12' : 'Táctico 11–12';
    }
    return language === 'fr' ? 'Pro 13–14' : language === 'en' ? 'Pro 13–14' : 'Pro 13–14';
  };

  const difficultyBarLabel =
    language === 'fr'
      ? 'Difficulté :'
      : language === 'en'
      ? 'Difficulty:'
      : 'Dificultad:';

  return (
    <div
      className="flex-1 min-h-0 w-full max-w-full flex flex-col bg-slate-50 text-slate-800 select-none relative overflow-x-hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Top Header */}
      <div className="px-3 py-1.5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 z-20 shadow-xs w-full">
        <button
          type="button"
          onClick={onExitGame}
          aria-label={t('gameScreen.back')}
          className="min-w-[40px] min-h-[40px] px-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span className="hidden sm:inline">{t('gameScreen.back')}</span>
        </button>

        {/* 25-Game Selector Dropdown */}
        <div className="relative flex-1 flex justify-center min-w-0">
          <button
            type="button"
            onClick={() => setShowMechanicPicker((v) => !v)}
            className="min-h-[38px] flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer border border-slate-200/60 max-w-full"
          >
            <span className="text-sm shrink-0">{activeMeta.icon}</span>
            <span className="truncate">{activeMeta.label}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {showMechanicPicker && (
            <div className="absolute top-11 left-1/2 -translate-x-1/2 w-[min(18rem,calc(100vw-2rem))] bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>{t('gameScreen.allMechanics')}</span>
                <span className="text-cyan-700 tabular-nums">25</span>
              </div>
              <div className="space-y-1 mt-1">
                {gameMechanics.map((gm) => (
                  <button
                    key={gm.type}
                    type="button"
                    onClick={() => {
                      setActiveGameType(gm.type);
                      setShowMechanicPicker(false);
                    }}
                    className={`w-full min-h-[40px] text-left px-2.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                      activeGameType === gm.type
                        ? 'bg-cyan-50 text-cyan-700 font-bold border border-cyan-200'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="text-base">{gm.icon}</span>
                    <span className="truncate">{gm.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio & Hint Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleSound}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer hover:bg-slate-200 active:scale-95"
            aria-label="Toggle audio"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center transition cursor-pointer hover:bg-cyan-100 active:scale-95"
            title={t('gameScreen.hintTitle')}
            aria-label={t('gameScreen.hintTitle')}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Tier Age Difficulty Switcher Strip */}
      <div className="px-3 py-1 bg-slate-100/90 border-b border-slate-200/70 flex items-center justify-between gap-2 shrink-0 z-10">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-700" />
          <span className="hidden xs:inline">{difficultyBarLabel}</span>
        </span>
        <div className="grid grid-cols-3 gap-1 flex-1 max-w-md bg-white/85 p-0.5 rounded-xl border border-slate-200/80">
          {AGE_TIERS.map((tierAge) => {
            const isActive = selectedAgeGroup === tierAge;
            return (
              <button
                key={tierAge}
                type="button"
                onClick={() => handleSwitchAge(tierAge)}
                className={`min-h-[30px] py-1 px-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer truncate ${
                  isActive
                    ? tierAge === '13–14'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : tierAge === '11–12'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {getAgePillLabel(tierAge)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Hint Overlay */}
      {showHint && (
        <div className="bg-sky-50 border-b border-sky-200 p-3 px-4 flex items-center gap-3 z-30 shadow-sm">
          <CiberMascot size="sm" expression="thinking" className="shrink-0" />
          <div className="text-xs text-sky-950 flex-1 leading-relaxed font-medium">
            <span className="font-bold">{t('gameScreen.hintTitle')}</span> {t('gameScreen.hintText')}
          </div>
          <button
            type="button"
            onClick={() => setShowHint(false)}
            className="min-h-[38px] text-xs font-bold text-sky-700 hover:text-sky-900 px-2.5 py-1 cursor-pointer"
          >
            {t('gameScreen.understood')}
          </button>
        </div>
      )}

      {/* Render Active Game Mechanic keyed by game + age difficulty */}
      <div
        key={`${activeGameType}-${selectedAgeGroup}`}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        {activeGameType === 'image-detection' && (
          <InteractivePhoto
            ageGroup={selectedAgeGroup}
            onAllRisksFound={onCompleteGame}
            onCiberReact={(exp) => setCiberExpression(exp)}
          />
        )}
        {activeGameType === 'password-forge' && (
          <PasswordForgeGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'phishing-inbox' && (
          <PhishingInboxGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'chat-sim' && (
          <ChatSimGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'privacy-dial' && (
          <PrivacyDialGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'safe-risky-sort' && (
          <SafeRiskySortGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'drag-drop' && (
          <DragDropGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'memory-match' && (
          <MemoryMatchGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'puzzle-vault' && (
          <PuzzleVaultGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'ai-detector' && (
          <AiDetectorGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'incident-response' && (
          <IncidentResponseGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'quiz' && (
          <QuizGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'app-permissions' && (
          <AppPermissionsGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'url-inspector' && (
          <UrlInspectorGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'wifi-shield' && (
          <WifiShieldGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-bully-shield' && (
          <CyberBullyShieldGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'digital-footprint' && (
          <DigitalFootprintGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-runner' && (
          <CyberRunnerGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-snake' && (
          <CyberSnakeGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-pacman' && (
          <CyberPacmanGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-invaders' && (
          <CyberInvadersGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-flappy' && (
          <CyberFlappyGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-tetris' && (
          <CyberTetrisGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-pvz' && (
          <CyberPvzGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
        {activeGameType === 'cyber-dino' && (
          <CyberDinoGame ageGroup={selectedAgeGroup} onComplete={onCompleteGame} />
        )}
      </div>
    </div>
  );
};
