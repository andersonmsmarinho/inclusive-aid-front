'use client';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { AccessibilityProvider } from './context/AccessibilityContext';
import CaptionOverlay from './components/CaptionOverlay';
import FocusNarrator from './components/FocusNarrator';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AccessibilityProvider>
        {children}
        {/* Portals / overlays that rely on client-side */}
        <CaptionOverlay />
        <FocusNarrator />
      </AccessibilityProvider>
    </Provider>
  );
} 