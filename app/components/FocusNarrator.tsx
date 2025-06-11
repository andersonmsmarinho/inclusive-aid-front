'use client';
import { useEffect } from 'react';
import { speak } from '../lib/tts';
import { useAccessibility } from '../context/AccessibilityContext';

function getAccessibleLabel(el: HTMLElement): string | null {
  if (!el) return null;
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = el.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ref = document.getElementById(ariaLabelledBy);
    if (ref) return ref.innerText.trim();
  }
  const alt = (el as HTMLImageElement).alt;
  if (alt) return alt;
  const text = el.innerText?.trim();
  if (text) return text;
  return null;
}

export default function FocusNarrator() {
  const { features } = useAccessibility();

  useEffect(() => {
    if (!features['Ativar narração']) return;

    function handleFocus(e: FocusEvent) {
      const label = getAccessibleLabel(e.target as HTMLElement);
      if (label) speak(label);
    }

    function handleMouseOver(e: MouseEvent) {
      const label = getAccessibleLabel(e.target as HTMLElement);
      if (label) speak(label);
    }

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [features['Ativar narração']]);

  return null;
} 