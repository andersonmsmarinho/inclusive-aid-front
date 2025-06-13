'use client';
import { useState, useEffect } from 'react';
import NecessidadesPage from './necessidades/page';
import AcessibilidadePage from './acessibilidade/page';
import WelcomeClient from './welcome/WelcomeClient';
import { useAccessibility } from '../context/AccessibilityContext';
import { speak } from '../lib/tts';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const { features } = useAccessibility();

  useEffect(() => {
    if (!features['Ativar narração']) return;
    const messages = [
      'Tela de boas-vindas. Pressione o botão começar para prosseguir.',
      'Etapa de seleção de necessidades.',
      'Etapa de configuração de acessibilidade.'] as const;

    speak(messages[step]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, features['Ativar narração']]);

  return (
    <>
      {step === 0 && <WelcomeClient onContinue={() => setStep(1)} />}
      {step === 1 && <NecessidadesPage onContinue={() => setStep(2)} />}
      {step === 2 && <AcessibilidadePage onBack={() => setStep(1)} />}
    </>
  );
} 