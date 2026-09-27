export type Language = 'es' | 'fr' | 'en';

export type ScreenId =
  | 'onboarding'
  | 'profile-creation'
  | 'home'
  | 'worlds'
  | 'world-detail'
  | 'education'
  | 'mission-intro'
  | 'game'
  | 'mission-result'
  | 'achievements'
  | 'profile'
  | 'parent-gate'
  | 'parent-dashboard'
  | 'arcade-modes';

export type MascotExpression =
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'surprised'
  | 'concerned'
  | 'celebrating';

export type ChildAgeGroup = '8–10' | '11–12' | '13–14';

export type GameType =
  | 'image-detection'
  | 'password-forge'
  | 'phishing-inbox'
  | 'chat-sim'
  | 'privacy-dial'
  | 'safe-risky-sort'
  | 'drag-drop'
  | 'memory-match'
  | 'puzzle-vault'
  | 'ai-detector'
  | 'incident-response'
  | 'quiz';

export interface UserProfile {
  nickname: string;
  avatarId: string;
  avatarColor: string;
  ageGroup: ChildAgeGroup;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streakDays: number;
  skills: {
    privacidad: number;
    contrasenas: number;
    phishing: number;
    redesSociales: number;
    gamingSeguro: number;
    amigosDesconocidos: number;
    dispositivos: number;
    ciberacoso: number;
    iaDeepfakes: number;
    respuestaIncidentes: number;
  };
  completedMissions: string[];
  unlockedBadges: string[];
}

export interface Mission {
  id: string;
  worldId: string;
  number: number;
  title: string;
  subtitle: string;
  gameType: GameType;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  xpReward: number;
  coinReward: number;
  skillBonus: { skill: keyof UserProfile['skills']; points: number };
  status: 'completed' | 'available' | 'locked';
  description: string;
  timeEstimate: string;
  isBoss?: boolean;
  bossName?: string;
}

export interface World {
  id: string;
  number: number;
  name: string;
  title: string;
  subtitle: string;
  motto: string;
  biome: string;
  status: 'active' | 'unlocked' | 'locked';
  icon: string;
  color: string;
  accentBg: string;
  completedMissions: number;
  totalMissions: number;
  finalChallengeTitle: string;
  finalChallengeDesc: string;
  missions: Mission[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  rarity: 'Común' | 'Raro' | 'Épico';
}

export interface GameHotspot {
  id: string;
  label: string;
  isSensitiveRisk: boolean;
  feedbackTitle: string;
  feedbackText: string;
  ciberReaction: MascotExpression;
  rect: { x: number; y: number; width: number; height: number }; // percentage coordinates
}
