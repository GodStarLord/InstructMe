import React, { useState, useEffect } from 'react';
import { SessionConfig, Routine, SessionRecord } from './types';
import { storage } from './core/db/storage';
import { HomeScreen } from './features/home/HomeScreen';
import { SessionScreen } from './features/session/SessionScreen';
import { RoutineListScreen } from './features/routines/RoutineListScreen';
import { WikiScreen } from './features/wiki/WikiScreen';
import { StatsScreen } from './features/stats/StatsScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { PreSessionModal } from './components/session/PreSessionModal';
import { SessionConfigModal } from './components/session/SessionConfigModal';
import { DiscreetOverlay } from './components/layout/DiscreetOverlay';
import { BottomNavigation } from './components/layout/BottomNavigation';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'session' | 'routines' | 'wiki' | 'stats' | 'settings'>('home');
  const [wikiReferrer, setWikiReferrer] = useState<'home' | 'session'>('home');

  // Config State
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    startingArousal: 'flaccid',
    minSps: 0.8,
    maxSps: 2.5,
    allowDepths: ['tip', 'shallow', 'mid', 'deep', 'full'],
    allowSqueeze: true,
    allowPauses: true,
    targetDurationMinutes: 15,
    unpredictability: 'medium',
  });

  // Modals
  const [isPreSessionOpen, setIsPreSessionOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  // Discreet Boss Key Mode
  const [isDiscreetOpen, setIsDiscreetOpen] = useState<boolean>(false);
  const settings = storage.getSettings();

  // Listen for Global Escape key to trigger Boss Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDiscreetOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLaunchSession = (finalConfig: SessionConfig) => {
    setSessionConfig(finalConfig);
    setIsPreSessionOpen(false);
    setCurrentScreen('session');
  };

  const handleSelectRoutine = (routine: Routine) => {
    // Configure session from routine parameters
    setSessionConfig({
      startingArousal: 'flaccid',
      minSps: routine.steps[0]?.minSps || 0.8,
      maxSps: Math.max(...routine.steps.map(s => s.maxSps)),
      allowDepths: Array.from(new Set(routine.steps.flatMap(s => s.allowedDepths))),
      allowSqueeze: true,
      allowPauses: true,
      targetDurationMinutes: Math.round(routine.totalDurationSeconds / 60),
      unpredictability: 'medium',
    });
    setIsPreSessionOpen(true);
  };

  const recentSessions = storage.getSessions();
  const mostRecentSession: SessionRecord | null = recentSessions.length > 0 ? recentSessions[0] : null;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Discreet Stealth Overlay */}
      <DiscreetOverlay
        isOpen={isDiscreetOpen}
        pin={settings.discreetPin}
        onExitDiscreet={() => setIsDiscreetOpen(false)}
      />

      {/* Main Screens */}
      {currentScreen === 'home' && (
        <HomeScreen
          config={sessionConfig}
          onOpenPreSession={() => setIsPreSessionOpen(true)}
          onOpenConfig={() => setIsConfigOpen(true)}
          onNavigate={(screen) => setCurrentScreen(screen)}
          recentSession={mostRecentSession}
        />
      )}

      {currentScreen === 'session' && (
        <SessionScreen
          config={sessionConfig}
          onExit={() => setCurrentScreen('home')}
          onOpenWiki={() => {
            setWikiReferrer('session');
            setCurrentScreen('wiki');
          }}
        />
      )}

      {currentScreen === 'routines' && (
        <RoutineListScreen
          onSelectRoutine={handleSelectRoutine}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'wiki' && (
        <WikiScreen
          onBack={() => setCurrentScreen(wikiReferrer)}
        />
      )}

      {currentScreen === 'stats' && (
        <StatsScreen
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onTriggerBossKey={() => setIsDiscreetOpen(true)}
      />

      {/* Pre-Session Arousal Check-In Modal */}
      <PreSessionModal
        isOpen={isPreSessionOpen}
        onClose={() => setIsPreSessionOpen(false)}
        baseConfig={sessionConfig}
        onStartSession={handleLaunchSession}
      />

      {/* Session Config Parameters Modal */}
      <SessionConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={sessionConfig}
        onSaveConfig={(newConfig) => setSessionConfig(newConfig)}
      />
    </div>
  );
}

export default App;
