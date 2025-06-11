'use client';
import { useAccessibility } from "../context/AccessibilityContext";
import { useEffect, useState } from "react";
import styles from './CaptionOverlay.module.css';

export default function CaptionOverlay() {
  const { features } = useAccessibility();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const custom = e as CustomEvent<string>;
      setText(custom.detail);
      // limpa legenda após 6s
      setTimeout(() => setText((prev) => (prev === custom.detail ? null : prev)), 6000);
    }
    window.addEventListener('inclusiveaid_caption', handler as EventListener);
    return () => window.removeEventListener('inclusiveaid_caption', handler as EventListener);
  }, []);

  if (!features['Ativar Legenda'] || !text) return null;

  return (
    <div aria-live="assertive" className={styles.overlay}>
      {text}
    </div>
  );
} 