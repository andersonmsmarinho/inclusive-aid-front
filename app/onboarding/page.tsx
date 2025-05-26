'use client';
import { useState } from 'react';
import NecessidadesPage from './necessidades/page';
import AcessibilidadePage from './acessibilidade/page';
import WelcomePage from './welcome/page';

export default function Onboarding() {
  const [step, setStep] = useState(0);

  return (
    <>
      {step === 0 && <WelcomePage onContinue={() => setStep(1)} />}
      {step === 1 && <NecessidadesPage onContinue={() => setStep(2)} />}
      {step === 2 && <AcessibilidadePage onBack={() => setStep(1)} />}
    </>
  );
} 