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
import { ScreenId, UserProfile, World, Mission, GameResultStats, ChildAgeGroup } from './types';
import { INITIAL_PROFILE } from './data';
import { useLanguage } from './i18n/LanguageContext';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';
import { checkLevelUp } from './utils/levelSystem';

export default function App() {
  const { worlds: localizedWorlds, t } = useLanguage();
  const [activeScreen, setActiveScreen] = useState<ScreenId>('onboarding');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-1');
  const [activeMissionId, setActiveMissionId] = useState<string>('w1-m1');
  const [arcadeMode, setArcadeMode] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<{
    mission?: Mission;
    nextMission?: Mission;
    stats?: GameResultStats;
    xpGained: number;
    coinsGained: number;
    skillLabel?: string;
    skillPoints: number;
  } | null>(null);

  // Celebratory Level-Up Modal Overlay State
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
  } | null>(null);

  // Reactive worlds & missions derived from profile.completedMissions and profile.level
  const worlds: World[] = localizedWorlds.reduce<World[]>((acc, w, worldIdx) => {
    const updatedMissions = w.missions.map((m, idx) => {
      const isCompleted = profile.completedMissions.includes(m.id);
      if (isCompleted) {
        return { ...m, status: 'completed' as const };
      }
      const prevCompleted =
        idx > 0 && profile.completedMissions.includes(w.missions[idx - 1].id);
      const isAvailable =
        m.status === 'available' || idx === 0 || prevCompleted;
      return {
        ...m,
        status: isAvailable ? ('available' as const) : ('locked' as const),
      };
    });

    const completedCount = updatedMissions.filter((m) => m.status === 'completed').length;
    const prevWorldCompleted = worldIdx > 0 ? acc[worldIdx - 1].completedMissions : 0;
    const isWorldUnlocked =
      w.status !== 'locked' ||
      profile.level >= w.number + 1 ||
      prevWorldCompleted >= 3;

    acc.push({
      ...w,
      status: w.status === 'active' ? 'active' : isWorldUnlocked ? 'unlocked' : 'locked',
      missions: updatedMissions,
      completedMissions: completedCount,
    });
    return acc;
  }, []);

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId) || worlds[0];
  const activeMission =
    selectedWorld.missions.find((m) => m.id === activeMissionId) || selectedWorld.missions[0];

  // Track parent mode
  const isParentMode = activeScreen === 'parent-gate' || activeScreen === 'parent-dashboard';

  // Navigation handlers
  const handleUpdateProfile = (newProps: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProps }));
  };

  const handleChangeAgeGroup = (ageGroup: ChildAgeGroup) => {
    setProfile((prev) => ({ ...prev, ageGroup }));
  };

  const handleStartMissionById = (missionId: string) => {
    const foundWorld = worlds.find((w) => w.missions.some((m) => m.id === missionId)) || worlds[0];
    setArcadeMode(false);
    setSelectedWorldId(foundWorld.id);
    setActiveMissionId(missionId);
    setActiveScreen('mission-intro');
  };

  const handleSelectWorld = (world: World) => {
    setSelectedWorldId(world.id);
    setActiveScreen('world-detail');
  };

  const handleSelectMission = (mission: Mission) => {
    setArcadeMode(false);
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

  // Called when child completes an interactive cybersecurity game
  const handleCompleteGame = (stats?: GameResultStats) => {
    const bonusXp = stats && stats.accuracy >= 85 ? 25 : 0;
    const bonusCoins = stats?.stars === 3 ? 10 : 0;

    if (arcadeMode) {
      const xpGained = 75 + bonusXp;
      const coinsGained = 15 + bonusCoins;

      setProfile((prev) => {
        const progression = checkLevelUp(prev.xp, prev.level, prev.xpToNextLevel, xpGained);
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
          coins: prev.coins + coinsGained + progression.bonusCoins,
        };
      });

      setLastResult({
        stats,
        xpGained,
        coinsGained,
        skillPoints: 5,
      });
      setActiveScreen('mission-result');
      return;
    }

    const mission = activeMission;
    const xpGained = (mission.xpReward || 100) + bonusXp;
    const coinsGained = (mission.coinReward || 25) + bonusCoins;
    const skillKey = mission.skillBonus.skill;
    const skillPoints = mission.skillBonus.points || 8;

    setProfile((prev) => {
      const progression = checkLevelUp(prev.xp, prev.level, prev.xpToNextLevel, xpGained);
      if (progression.leveledUp) {
        setLevelUpData({
          isOpen: true,
          oldLevel: progression.oldLevel,
          newLevel: progression.newLevel,
          bonusCoins: progression.bonusCoins,
        });
      }

      const updatedCompleted = prev.completedMissions.includes(mission.id)
        ? prev.completedMissions
        : [...prev.completedMissions, mission.id];

      const updatedBadges =
        updatedCompleted.length >= 4 && !prev.unlockedBadges.includes('badge-detective-digital')
          ? [...prev.unlockedBadges, 'badge-detective-digital']
          : prev.unlockedBadges;

      return {
        ...prev,
        xp: progression.newXp,
        level: progression.newLevel,
        xpToNextLevel: progression.newXpToNextLevel,
        coins: prev.coins + coinsGained + progression.bonusCoins,
        skills: {
          ...prev.skills,
          [skillKey]: Math.min(100, prev.skills[skillKey] + skillPoints),
        },
        unlockedBadges: updatedBadges,
        completedMissions: updatedCompleted,
      };
    });

    // Find next mission in current world or first mission of next unlocked world
    const currentIdx = selectedWorld.missions.findIndex((m) => m.id === mission.id);
    let nextMission: Mission | undefined =
      currentIdx >= 0 && currentIdx + 1 < selectedWorld.missions.length
        ? selectedWorld.missions[currentIdx + 1]
        : undefined;

    if (!nextMission) {
      const worldIdx = worlds.findIndex((w) => w.id === selectedWorld.id);
      if (worldIdx >= 0 && worldIdx + 1 < worlds.length) {
        nextMission = worlds[worldIdx + 1].missions[0];
      }
    }

    setLastResult({
      mission,
      nextMission,
      stats,
      xpGained,
      coinsGained,
      skillLabel: t(`profile.skills.${skillKey}`),
      skillPoints,
    });

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
      onNavigateScreen={(screen) => {
        setArcadeMode(false);
        setActiveScreen(screen);
      }}
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
            onOpenArcade={() => {
              setArcadeMode(true);
              setActiveScreen('game');
            }}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeScreen === 'worlds' && (
          <WorldMapScreen
            worlds={worlds}
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
            ageGroup={profile.ageGroup}
            onStartGame={() => setActiveScreen('game')}
            onBack={() => setActiveScreen('world-detail')}
          />
        )}

        {activeScreen === 'game' && (
          <InteractiveGameScreen
            mission={arcadeMode ? undefined : activeMission}
            profile={profile}
            openPickerInitially={arcadeMode}
            onChangeAgeGroup={handleChangeAgeGroup}
            onCompleteGame={handleCompleteGame}
            onExitGame={() => {
              if (arcadeMode) {
                setArcadeMode(false);
                setActiveScreen('home');
              } else {
                setActiveScreen('mission-intro');
              }
            }}
          />
        )}

        {activeScreen === 'mission-result' && (
          <MissionResultScreen
            mission={lastResult?.mission}
            nextMission={lastResult?.nextMission}
            stats={lastResult?.stats}
            xpGained={lastResult?.xpGained}
            coinsGained={lastResult?.coinsGained}
            skillLabel={lastResult?.skillLabel}
            skillPoints={lastResult?.skillPoints}
            onNextMission={(next) => {
              setArcadeMode(false);
              setSelectedWorldId(next.worldId);
              setActiveMissionId(next.id);
              setActiveScreen('mission-intro');
            }}
            onContinue={() => {
              setArcadeMode(false);
              setActiveScreen('home');
            }}
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
