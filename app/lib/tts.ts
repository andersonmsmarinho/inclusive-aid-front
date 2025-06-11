export function speak(text: string) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;

  const doSpeak = () => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    // Cancela discursos em andamento para evitar sobreposição
    synth.cancel();
    synth.speak(utter);

    // Dispara evento para exibir legenda, independentemente de narração ativa
    window.dispatchEvent(new CustomEvent('inclusiveaid_caption', { detail: text }));
  };

  // Alguns navegadores (Chrome) requerem que as vozes sejam carregadas
  // de forma assíncrona; se ainda não estiverem disponíveis, aguarda evento
  if (synth.getVoices().length === 0) {
    const handle = () => {
      doSpeak();
      synth.removeEventListener('voiceschanged', handle);
    };
    synth.addEventListener('voiceschanged', handle);
  } else {
    doSpeak();
  }
} 