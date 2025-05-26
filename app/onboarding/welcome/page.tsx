import styles from './Welcome.module.css';
import { Button } from '../../components/Button';

interface WelcomePageProps {
  onContinue: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        {/* Substitua pelo logo SVG quando disponível */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#F4F4F4" />
          <path d="M60 30 L90 45 L60 60 L30 45 Z" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="30" y1="45" x2="90" y2="45" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#0000FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 className={styles.title}>Bem-vindo ao <span className={styles.brand}>InclusiveAID</span></h1>
      <p className={styles.subtitle}>Seu Assistente de Inclusão Digital por IA</p>
      <Button className={styles.button} onClick={onContinue}>Começar</Button>
      <div className={styles.version}>Versão 0.9.2024.2</div>
    </div>
  );
} 