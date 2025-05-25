'use client';
import { useState } from 'react';
import NecessidadesPage from './necessidades/page';
import AcessibilidadePage from './acessibilidade/page';

export default function Onboarding() {
  const [step, setStep] = useState(0);

  return (
    <>
      {step === 0 && <NecessidadesPage onContinue={() => setStep(1)} />}
      {step === 1 && <AcessibilidadePage onBack={() => setStep(0)} />}
    </>
  );
} 