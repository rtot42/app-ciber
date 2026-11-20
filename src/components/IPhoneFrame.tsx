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
export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen h-[100dvh] flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden select-none font-sans selection:bg-cyan-500 selection:text-white">
      {/* Full width mobile app container, gracefully centered with max-w-2xl for iPads/tablets */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col min-h-0 relative overflow-x-hidden bg-slate-50">
        {children}
      </div>
    </div>
  );
};
