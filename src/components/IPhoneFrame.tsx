import React from 'react';
import { ScreenId } from '../types';

interface IPhoneFrameProps {
  children: React.ReactNode;
  activeScreen?: ScreenId;
  onNavigateScreen?: (screen: ScreenId) => void;
  isParentMode?: boolean;
}

/**
 * Full-screen responsive app layout for CiberKids.
 * Replaces the device mockup with a 100% width/height native mobile experience.
 * Fully responsive for mobile (iPhone, Android) and tablets (iPad) with zero horizontal overflow.
 */
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children, activeScreen }) => {
  const isFullGameScreen = activeScreen === 'game';

  return (
    <div
      className="w-full min-h-[100dvh] h-[100dvh] flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden select-none font-sans selection:bg-cyan-500 selection:text-white"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      {/* Full width mobile app container; expands during minigames for full-screen immersion */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col min-h-0 relative overflow-x-hidden bg-slate-50 ${
          isFullGameScreen ? 'max-w-5xl' : 'max-w-2xl'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
