import { useEffect } from 'react';
import { speak } from '../lib/tts';
import { useAccessibility } from '../context/AccessibilityContext';

export function useSpeakOnMount(message: string) {
  const { features } = useAccessibility();

  useEffect(() => {
    if (features['Ativar narração']) {
      speak(message);
    }
    // Depend on message but not recreate speech for every render when features flag unchanged
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features['Ativar narração'], message]);
} 