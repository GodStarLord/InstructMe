import React from 'react';
import { Home, Flame, BarChart3, BookOpen, EyeOff } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: 'home' | 'session' | 'routines' | 'wiki' | 'stats' | 'settings';
  onNavigate: (screen: 'home' | 'routines' | 'wiki' | 'stats' | 'settings') => void;
  onTriggerBossKey: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  onTriggerBossKey,
}) => {
  // Do not show bottom nav during an active session
  if (currentScreen === 'session') return null;

  const navItems = [
    { id: 'home', label: 'Pacing', icon: Home },
    { id: 'routines', label: 'Routines', icon: Flame },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'wiki', label: 'Wiki', icon: BookOpen },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '540px',
      background: 'rgba(12, 12, 16, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 12px',
      paddingBottom: 'calc(var(--safe-bottom) + 8px)',
      zIndex: 50,
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id as typeof currentScreen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '12px',
              color: isActive ? 'var(--accent-coral)' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <Icon size={20} />
            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Stealth Boss Key Trigger */}
      <button
        type="button"
        onClick={onTriggerBossKey}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 10px',
          color: 'var(--text-muted)',
          opacity: 0.6,
        }}
        title="Discreet Stealth Mode (Esc)"
      >
        <EyeOff size={18} />
        <span style={{ fontSize: '10px' }}>Stealth</span>
      </button>
    </nav>
  );
};
