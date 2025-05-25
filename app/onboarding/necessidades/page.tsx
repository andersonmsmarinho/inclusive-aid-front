'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import styles from './Necessidades.module.css';

const necessidadesList = [
  { key: 'visual', label: 'Visual', icon: '👁️' },
  { key: 'auditiva', label: 'Auditiva', icon: '👂' },
  { key: 'motora', label: 'Motora', icon: '✋' },
  { key: 'cognitiva', label: 'Cognitiva', icon: '🧠' },
  { key: 'sensorial', label: 'Sensorial', icon: '❌' },
];

export default function NecessidadesPage({ onContinue }: { onContinue?: () => void }) {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const router = useRouter();

  function toggleNecessidade(key: string) {
    setSelecionadas((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.header}>Configuração Inicial</h1>
        <div className="mb-8">
          <h2 className={styles.title}>Quais são as suas principais necessidades?</h2>
          <p className={styles.subtitle}>Selecione mais de uma, se necessário</p>
          <div className={styles.options}>
            {necessidadesList.map((n) => (
              <button
                key={n.key}
                type="button"
                aria-pressed={selecionadas.includes(n.key)}
                onClick={() => toggleNecessidade(n.key)}
                className={`${styles.optionButton} ${selecionadas.includes(n.key) ? styles.selected : ''}`}
              >
                <span className={styles.icon}>{n.icon}</span> {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button
        className={styles.continueButton}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
} 