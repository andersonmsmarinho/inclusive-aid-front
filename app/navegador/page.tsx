'use client';
import { useState } from 'react';
import { Button } from '../components/Button';
import styles from './page.module.css';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Navegador() {
  const [url, setUrl] = useState('https://example.com');
  const [input, setInput] = useState(url);
  const { features } = useAccessibility();

  const iframeStyle: React.CSSProperties = {};
  if (features['Ativar alto contraste']) {
    // Usa filtro invert/saturate para simular alto contraste em sites externos
    iframeStyle.filter = 'invert(1) grayscale(1) contrast(1.2)';
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          className={styles.addressInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Barra de endereço"
        />
        <Button variant="primary" onClick={() => setUrl(input)}>
          Ir
        </Button>
      </div>
      <iframe
        key={url}
        src={url}
        title="Site carregado"
        className={styles.iframe}
        style={iframeStyle}
      />
    </div>
  );
}