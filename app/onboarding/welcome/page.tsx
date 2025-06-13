'use client';
import styles from './Welcome.module.css';
import { Button } from '../../components/Button';
import { useSpeakOnMount } from '../../hooks/useTTS';
import Image from 'next/image';

interface WelcomePageProps {
  onContinue: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  useSpeakOnMount('Bem vindo ao InclusiveAID. Pressione o botão começar para iniciar.');
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Image src="/inclusive-aid-logo.svg" alt="InclusiveAID" width={120} height={120} />
      </div>
      <h1 className={styles.title}>Bem-vindo ao <span className={styles.brand}>InclusiveAID</span></h1>
      <p className={styles.subtitle}>Seu Assistente de Inclusão Digital por IA</p>
      <Button className={styles.button} onClick={onContinue}>Começar</Button>
      <div className={styles.version}>Versão 0.9.2024.2</div>
    </div>
  );
} 