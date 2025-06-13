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

  // Persiste alterações no backend (Back4App) via API interna
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const controller = new AbortController();

    // Debounce para evitar múltiplas requisições rápidas
    const timer = setTimeout(async () => {
      if (!navigator.onLine) {
        console.warn('[AccessibilityContext] Offline – adiando sync');
        return;
      }

      const storedId = localStorage.getItem('inclusive_aid_profile_id');
      let idToUse = storedId || undefined;

      async function push(method: 'POST' | 'PUT', url: string) {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ needs, features }),
          signal: controller.signal,
        });
        return res;
      }

      try {
        let res: Response;
        if (idToUse) {
          // tenta atualizar
          res = await push('PUT', `/api/profiles/${idToUse}`);
          if (res.status === 404) {
            // perfil removido — recria
            localStorage.removeItem('inclusive_aid_profile_id');
            idToUse = undefined;
          } else if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
        }

        if (!idToUse) {
          res = await push('POST', '/api/profiles');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data?.id) localStorage.setItem('inclusive_aid_profile_id', data.id);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('[AccessibilityContext] Sync error', err);
        }
      }
    }, 500); // 500 ms debounce

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
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