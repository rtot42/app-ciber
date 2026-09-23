import React, { useState } from 'react';
import { IPhoneFrame } from './components/IPhoneFrame';
import { ChildBottomNav } from './components/NavigationBars';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { ProfileCreationScreen } from './components/screens/ProfileCreationScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorldMapScreen } from './components/screens/WorldMapScreen';
import { WorldDetailScreen } from './components/screens/WorldDetailScreen';
import { MissionIntroScreen } from './components/screens/MissionIntroScreen';
import { InteractiveGameScreen } from './components/screens/InteractiveGameScreen';
import { MissionResultScreen } from './components/screens/MissionResultScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { EducationScreen } from './components/screens/EducationScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ParentGateScreen } from './components/screens/ParentGateScreen';
import { ParentDashboardScreen } from './components/screens/ParentDashboardScreen';
import { ScreenId, UserProfile, World, Mission } from './types';
import { INITIAL_PROFILE } from './data';
import { useLanguage } from './i18n/LanguageContext';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';
import { checkLevelUp } from './utils/levelSystem';

export default function App() {
  const { worlds: localizedWorlds } = useLanguage();
  const [activeScreen, setActiveScreen] = useState<ScreenId>('onboarding');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [extraCompletedCounts, setExtraCompletedCounts] = useState<Record<string, number>>({});
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-1');
  const [activeMissionId, setActiveMissionId] = useState<string>('w1-m1');

  // Celebratory Level-Up Modal Overlay State
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
  } | null>(null);

  // Derived reactive worlds, selectedWorld, and activeMission
  const worlds = localizedWorlds.map((w) => ({
    ...w,
    completedMissions: extraCompletedCounts[w.id] !== undefined ? extraCompletedCounts[w.id] : w.completedMissions,
  }));

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId) || worlds[0];
  const activeMission = selectedWorld.missions.find((m) => m.id === activeMissionId) || selectedWorld.missions[0];

  // Track parent mode
  const isParentMode = activeScreen === 'parent-gate' || activeScreen === 'parent-dashboard';

  // Navigation handlers
  const handleUpdateProfile = (newProps: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProps }));
  };

  const handleStartMissionById = (missionId: string) => {
    const foundWorld = worlds.find((w) => w.missions.some((m) => m.id === missionId)) || worlds[0];
    setSelectedWorldId(foundWorld.id);
    setActiveMissionId(missionId);
    setActiveScreen('mission-intro');
  };

  const handleSelectWorld = (world: World) => {
    setSelectedWorldId(world.id);
    setActiveScreen('world-detail');
  };

  const handleSelectMission = (mission: Mission) => {
    setActiveMissionId(mission.id);
    setActiveScreen('mission-intro');
  };

  // Centralized XP increment handler with level-up trigger
  const handleAwardXp = (amount: number) => {
    setProfile((prev) => {
      const progression = checkLevelUp(
        prev.xp,
        prev.level,
        prev.xpToNextLevel,
        amount
      );

      if (progression.leveledUp) {
        setLevelUpData({
          isOpen: true,
          oldLevel: progression.oldLevel,
          newLevel: progression.newLevel,
          bonusCoins: progression.bonusCoins,
        });
      }

      return {
        ...prev,
        xp: progression.newXp,
        level: progression.newLevel,
        xpToNextLevel: progression.newXpToNextLevel,
        coins: prev.coins + progression.bonusCoins,
      };
    });
  };

  // Called when child completes the interactive cybersecurity game
  const handleCompleteGame = () => {
    // Award rewards and check level up
    setProfile((prev) => {
      const progression = checkLevelUp(
        prev.xp,
        prev.level,
        prev.xpToNextLevel,
        120
      );

      if (progression.leveledUp) {
        setLevelUpData({
          isOpen: true,
          oldLevel: progression.oldLevel,
          newLevel: progression.newLevel,
          bonusCoins: progression.bonusCoins,
        });
      }

      const newCoins = prev.coins + 25 + progression.bonusCoins;
      const newSkills = {
        ...prev.skills,
        privacidad: Math.min(100, prev.skills.privacidad + 8),
      };
      const newUnlockedBadges = prev.unlockedBadges.includes('badge-detective-digital')
        ? prev.unlockedBadges
        : [...prev.unlockedBadges, 'badge-detective-digital'];

      const newCompletedMissions = prev.completedMissions.includes('w1-m1')
        ? prev.completedMissions
        : [...prev.completedMissions, 'w1-m1'];

      return {
        ...prev,
        xp: progression.newXp,
        level: progression.newLevel,
        xpToNextLevel: progression.newXpToNextLevel,
        coins: newCoins,
        skills: newSkills,
        unlockedBadges: newUnlockedBadges,
        completedMissions: newCompletedMissions,
      };
    });

    // Update World 1 mission count if not updated
    setExtraCompletedCounts((prev) => ({
      ...prev,
      'world-1': Math.max(prev['world-1'] || 0, 4),
    }));

    setActiveScreen('mission-result');
  };

  const showChildNav = [
    'home',
    'worlds',
    'world-detail',
    'education',
    'achievements',
    'profile',
  ].includes(activeScreen);

  return (
    <IPhoneFrame
      activeScreen={activeScreen}
      onNavigateScreen={(screen) => setActiveScreen(screen)}
      isParentMode={isParentMode}
    >
      {/* Dynamic Screen Viewport */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {activeScreen === 'onboarding' && (
          <OnboardingScreen
            onFinish={() => setActiveScreen('profile-creation')}
          />
        )}

        {activeScreen === 'profile-creation' && (
          <ProfileCreationScreen
            initialProfile={profile}
            onSaveProfile={handleUpdateProfile}
            onComplete={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'home' && (
          <HomeScreen
            profile={profile}
            currentWorld={selectedWorld}
            onStartMission={handleStartMissionById}
            onNavigateToWorlds={() => setActiveScreen('worlds')}
            onNavigateToEducation={() => setActiveScreen('education')}
            onNavigateToAchievements={() => setActiveScreen('achievements')}
            onOpenParentGate={() => setActiveScreen('parent-gate')}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeScreen === 'worlds' && (
          <WorldMapScreen
            onSelectWorld={handleSelectWorld}
            selectedWorldId={selectedWorld.id}
          />
        )}

        {activeScreen === 'world-detail' && (
          <WorldDetailScreen
            world={selectedWorld}
            onBackToMap={() => setActiveScreen('worlds')}
            onSelectMission={handleSelectMission}
          />
        )}

        {activeScreen === 'education' && (
          <EducationScreen
            profile={profile}
            onEarnXp={handleAwardXp}
          />
        )}

        {activeScreen === 'mission-intro' && (
          <MissionIntroScreen
            mission={activeMission}
            onStartGame={() => setActiveScreen('game')}
            onBack={() => setActiveScreen('world-detail')}
          />
        )}

        {activeScreen === 'game' && (
          <InteractiveGameScreen
            mission={activeMission}
            profile={profile}
            onCompleteGame={handleCompleteGame}
            onExitGame={() => setActiveScreen('mission-intro')}
          />
        )}

        {activeScreen === 'mission-result' && (
          <MissionResultScreen
            onContinue={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'achievements' && (
          <AchievementsScreen
            unlockedBadgeIds={profile.unlockedBadges}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onEditProfile={() => setActiveScreen('profile-creation')}
            onOpenParentGate={() => setActiveScreen('parent-gate')}
          />
        )}

        {activeScreen === 'parent-gate' && (
          <ParentGateScreen
            onSuccess={() => setActiveScreen('parent-dashboard')}
            onCancel={() => setActiveScreen('home')}
          />
        )}

        {activeScreen === 'parent-dashboard' && (
          <ParentDashboardScreen
            profile={profile}
            onReturnToChildMode={() => setActiveScreen('home')}
            onNavigateToWorld={() => setActiveScreen('worlds')}
          />
        )}
      </div>

      {/* Child Bottom Navigation Bar */}
      {showChildNav && (
        <ChildBottomNav
          activeScreen={activeScreen}
          onNavigate={(screen) => setActiveScreen(screen)}
          unlockedBadgesCount={profile.unlockedBadges.length}
        />
      )}

      {/* Celebratory Level-Up Modal Overlay with CSS Animations */}
      {levelUpData && levelUpData.isOpen && (
        <LevelUpCelebrationModal
          isOpen={levelUpData.isOpen}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          bonusCoins={levelUpData.bonusCoins}
          nickname={profile.nickname}
          onClose={() =>
            setLevelUpData((prev) => (prev ? { ...prev, isOpen: false } : null))
          }
        />
      )}
    </IPhoneFrame>
  );
}
