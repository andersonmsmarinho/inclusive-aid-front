'use client';
import { AccessibilityProvider } from './context/AccessibilityContext';
import CaptionOverlay from './components/CaptionOverlay';
import FocusNarrator from './components/FocusNarrator';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      {children}
      {/* Portals / overlays that rely on client-side */}
      <CaptionOverlay />
      <FocusNarrator />
    </AccessibilityProvider>
  );
} 