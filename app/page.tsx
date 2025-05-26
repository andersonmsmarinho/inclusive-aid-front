import styles from './page.module.css';
import { Button } from './components/Button';

export default function Home() {
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
                <li>1. Usuário com <b>baixa visão</b></li>
                <li>2. Usuário com <b>limitação cognitiva</b></li>
              </ol>
            </div>
            <div className={styles.listBlock}>
              <span className={styles.listLabel}>Assistências prestadas:</span>
              <ol className={styles.list}>
                <li>1. Alto contraste</li>
                <li>2. Tamanho da fonte: 16px</li>
                <li>3. Feedback sonoro</li>
                <li>4. Assistência básica por IA</li>
              </ol>
            </div>
          </div>
        </div>
        <Button className={styles.primaryBtn}>Usar o InclusiveAID</Button>
        <a className={styles.premiumLink} href="#">Assine o AID Premium</a>
        <div className={styles.actions}>
          <Button className={styles.secondaryBtn} variant="secondary">Revogar permissões</Button>
          <Button className={styles.secondaryBtn} variant="secondary">Configurações</Button>
        </div>
      </main>
    </div>
  );
}
