'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import styles from './Acessibilidade.module.css';

const recursosList = [
  'Ativar alto contraste',
  'Ativar narração',
  'Ativar Legenda',
  'Assistente de libras',
  'Ativar feedback tátil',
  'Ativar feedback sonoro',
  'Ativar controle por movimento ocular',
];

export default function AcessibilidadePage({ onBack }: { onBack?: () => void }) {
  const [recursos, setRecursos] = useState<boolean[]>(Array(recursosList.length).fill(true));

  function toggleRecurso(idx: number) {
    setRecursos((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.header}>Configuração Inicial</h1>
        <div className="mb-8">
          <h2 className={styles.title}>Recursos de acessibilidade</h2>
          <p className={styles.subtitle}>Você poderá ativar ou desativar esses recursos a qualquer momento em configurações</p>
          <div className={styles.options}>
            {recursosList.map((label, idx) => (
              <div key={label} className={styles.switchRow}>
                <button
                  type="button"
                  aria-pressed={recursos[idx]}
                  onClick={() => toggleRecurso(idx)}
                  className={`${styles.switch} ${recursos[idx] ? styles.active : ''}`}
                >
                  <span className={styles.switchKnob + (recursos[idx] ? ' ' + styles.active : '')} />
                </button>
                <span className={styles.label}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-8">
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          Voltar à pagina anterior
        </button>
        <Button className={styles.continueButton}>
          Continuar
        </Button>
      </div>
    </div>
  );
} 