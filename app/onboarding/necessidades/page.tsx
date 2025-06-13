'use client';
import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import styles from './Necessidades.module.css';
import Image from 'next/image';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSpeakOnMount } from '../../hooks/useTTS';
import { playBeep } from '../../lib/sound';


const necessidadesList = [
 { key: 'visual', label: 'Visual', icon: 'icon-visual.svg' },
 { key: 'auditiva', label: 'Auditiva', icon: 'icon-auditivo.svg' },
 { key: 'motora', label: 'Motora', icon: 'icon-motora.svg' },
 { key: 'cognitiva', label: 'Cognitiva', icon: 'icon-cognitivo.svg' },
 { key: 'sensorial', label: 'Sensorial', icon: 'icon-sensorial.svg' },
];


export default function NecessidadesPage({ onContinue }: { onContinue?: () => void }) {
 const { needs, setNeeds, features } = useAccessibility();
 const [selecionadas, setSelecionadas] = useState<string[]>(needs);

 useEffect(() => {
   setNeeds(selecionadas);
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [selecionadas]);

 useEffect(() => {
   // Carrega necessidades a partir do backend se existir profile_id
   (async () => {
     if (typeof window === 'undefined') return;
     const id = localStorage.getItem('inclusive_aid_profile_id');
     if (!id) return;
     try {
       const res = await fetch(`/api/profiles/${id}`);
       if (res.ok) {
         const data = await res.json();
         if (Array.isArray(data?.needs)) {
           setSelecionadas(data.needs);
         }
       }
     } catch (err) {
       console.error('[NecessidadesPage] Falha ao buscar necessidades remotas', err);
     }
   })();
 }, []);

 useSpeakOnMount('Selecione suas necessidades. Use Tab para navegar pelos botões e Enter para selecionar.');

 function toggleNecessidade(key: string) {
  setSelecionadas((prev) =>
   prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
  );
  if (features['Ativar feedback sonoro']) playBeep();
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
        <span className={styles.icon}><Image src={`/${n.icon}`} width={24} height={24} alt={`Ícone representando deficiência ${n.label}`}/></span> {n.label}
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
