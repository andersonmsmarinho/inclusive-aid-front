'use client';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { speak } from '../lib/tts';

interface AccessibilityState {
  needs: string[];
  features: Record<string, boolean>;
  setNeeds: (needs: string[]) => void;
  toggleFeature: (featureKey: string) => void;
  setFeature: (featureKey: string, enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityState>({
  /* Valores padrão (serão substituídos pelo Provider) */
  needs: [],
  features: {},
  setNeeds: () => {},
  toggleFeature: () => {},
  setFeature: () => {},
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [needs, setNeedsState] = useState<string[]>([]);
  const [features, setFeatures] = useState<Record<string, boolean>>({ 'Ativar narração': true });
  const prevFeatures = useRef<Record<string, boolean>>({});

  // Carrega preferências previamente salvas (localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('inclusive_aid_accessibility');
      if (stored) {
        const parsed = JSON.parse(stored) as { needs: string[]; features: Record<string, boolean> };
        setNeedsState(parsed.needs || []);
        const withDefault = { 'Ativar narração': true, ...(parsed.features || {}) };
        setFeatures(withDefault);
      }
    } catch (err) {
      console.error('[AccessibilityContext] Falha ao carregar preferências', err);
    }
  }, []);

  // Persiste alterações
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        'inclusive_aid_accessibility',
        JSON.stringify({ needs, features })
      );
    } catch (err) {
      console.error('[AccessibilityContext] Falha ao salvar preferências', err);
    }
  }, [needs, features]);

  // Detecta ativação da narração e envia mensagem introdutória
  useEffect(() => {
    const key = 'Ativar narração';
    if (features[key] && !prevFeatures.current[key]) {
      speak('Narração ativada. Você ouvirá instruções a cada etapa.');
    }
    prevFeatures.current = features;
  }, [features]);

  // Aplica / remove alto contraste no elemento <html>
  const HIGH_CONTRAST_LABEL = 'Ativar alto contraste';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const enabled = !!features[HIGH_CONTRAST_LABEL];
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [features[HIGH_CONTRAST_LABEL]]);

  const setNeeds = (n: string[]) => setNeedsState(n);
  const toggleFeature = (key: string) =>
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  const setFeature = (key: string, enabled: boolean) =>
    setFeatures((prev) => ({
      ...prev,
      [key]: enabled,
    }));

  const value = React.useMemo<AccessibilityState>(
    () => ({ needs, features, setNeeds, toggleFeature, setFeature }),
    [needs, features]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => useContext(AccessibilityContext); 