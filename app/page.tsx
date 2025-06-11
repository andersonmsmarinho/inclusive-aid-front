"use client";

import styles from './page.module.css';
import { Button } from './components/Button';
import { useAccessibility } from './context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { speak } from './lib/tts';

const NEED_LABELS: Record<string, string> = {
  visual: 'Usuário com baixa visão',
  auditiva: 'Usuário com deficiência auditiva',
  motora: 'Usuário com deficiência motora',
  cognitiva: 'Usuário com limitação cognitiva',
  sensorial: 'Usuário com deficiência sensorial',
};

const FEATURE_LABELS: Record<string, string> = {
  'Ativar alto contraste': 'Alto contraste',
  'Ativar narração': 'Narração',
  'Ativar Legenda': 'Legenda',
  'Assistente de libras': 'Assistente de Libras',
  'Ativar feedback tátil': 'Feedback tátil',
  'Ativar feedback sonoro': 'Feedback sonoro',
  'Ativar controle por movimento ocular': 'Controle por movimento ocular',
};

function NeedsList() {
  const { needs } = useAccessibility();
  if (!needs.length) return <li>Nenhuma necessidade selecionada</li>;
  return needs.map((n, idx) => (
    <li key={n}>
      {NEED_LABELS[n] ?? n}
    </li>
  ));
}

function FeaturesList() {
  const { features } = useAccessibility();
  const enabledKeys = Object.keys(features).filter((k) => features[k]);
  if (!enabledKeys.length) return <li>Nenhum recurso ativado</li>;
  return enabledKeys.map((k, idx) => (
    <li key={k}>{idx + 1}. {FEATURE_LABELS[k] ?? k}</li>
  ));
}

export default function Home() {
  const { needs, features } = useAccessibility();
  const router = useRouter();

  useEffect(() => {
    if (needs.length === 0) {
      router.push('/onboarding');
    }
  }, [needs, router]);

  // Narração resumo ao montar / atualizar configurações
  useEffect(() => {
    if (!features['Ativar narração']) return;

    const needsText = needs.length
      ? `Necessidades selecionadas: ${needs.map((n) => NEED_LABELS[n] ?? n).join(', ').replace(/, ([^,]*)$/, ' e $1')}.`
      : 'Nenhuma necessidade selecionada.';

    const enabledFeatures = Object.keys(features).filter((k) => features[k]);
    const featuresText = enabledFeatures.length
      ? `Recursos ativos: ${enabledFeatures.map((f) => FEATURE_LABELS[f] ?? f).join(', ').replace(/, ([^,]*)$/, ' e $1')}.`
      : 'Nenhum recurso de acessibilidade ativado.';

    const summary = `${needsText} ${featuresText}`;

    speak(summary);

  }, [needs, features]);

  if (needs.length === 0) {
    // Evita renderizar conteúdo enquanto redireciona
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Início</h1>
      </header>
      <main className={styles.main}>
        <h2 className={styles.success}>Permissões concedidas!</h2>
        <p className={styles.intro}>
          Tudo pronto para usar o <span className={styles.brand}>InclusiveAID</span><br />
          como seu assistente inclusivo!
        </p>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Principais ajustes</h3>
          <div className={styles.listsWrapper}>
            <div className={styles.listBlock}>
              <span className={styles.listLabel}>Necessidades:</span>
              <ol className={styles.list}>
                <NeedsList />
              </ol>
            </div>
            <div className={styles.listBlock}>
              <span className={styles.listLabel}>Assistências prestadas:</span>
              <ol className={styles.list}>
                <FeaturesList />
              </ol>
            </div>
          </div>
        </div>
        <Button className={styles.primaryBtn} onClick={() => router.push('/navegador')}>Usar o InclusiveAID</Button>
        <a className={styles.premiumLink} href="#">Assine o AID Premium</a>
        <div className={styles.actions}>
          <Button className={styles.secondaryBtn} variant="secondary">Revogar permissões</Button>
          <Button className={styles.secondaryBtn} variant="secondary" onClick={() => router.push('/onboarding/acessibilidade')}>Configurações</Button>
        </div>
      </main>
    </div>
  );
}
