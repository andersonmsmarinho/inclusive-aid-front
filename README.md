# InclusiveAID – Assistente Virtual Inclusivo

InclusiveAID é uma aplicação web "by-default" acessível pensada para pessoas cegas, com baixa visão e outras deficiências. O projeto foi construído com **Next.js 14**, **React 18** e **TypeScript**, ofertando uma experiência modular e facilmente extensível.

## Índice rápido

1. [Instalação](#instalação)
2. [Scripts disponíveis](#scripts-disponíveis)
3. [Fluxo de Onboarding](#fluxo-de-onboarding)
4. [Gerenciamento de Acessibilidade](#gerenciamento-de-acessibilidade)
5. [Testes automatizados](#testes-automatizados)

---

## Instalação

Pré-requisitos: Node.js ≥ 18 e npm ≥ 9.

```bash
git clone https://github.com/sua-organizacao/inclusive-aid-front.git
cd inclusive-aid-front
npm install

# Ambiente de desenvolvimento
npm run dev
```

A aplicação estará disponível em <http://localhost:3000>.

---

## Scripts disponíveis

| Script          | Descrição                          |
|-----------------|-------------------------------------|
| `npm run dev`   | Inicia ambiente de dev com HMR      |
| `npm run build` | Gera build de produção              |
| `npm start`     | Sobe servidor Next de produção      |
| `npm run lint`  | Verifica padrões ESLint + TS        |

---

## Fluxo de Onboarding

1. **Boas-vindas** – Tela de apresentação e início.
2. **Necessidades** – Seleção de necessidades do usuário (visual, auditiva, etc.).
3. **Recursos de acessibilidade** – Definição de features como alto contraste, narração, libras…

Preferências são salvas em **localStorage** e disponibilizadas globalmente via `AccessibilityContext`.

---

## Gerenciamento de Acessibilidade

O arquivo `app/context/AccessibilityContext.tsx` centraliza estado, persistência e métodos helpers:

* `needs` – Deficiências selecionadas.
* `features` – Mapa de recursos ativos.
* `setNeeds(needs)` – Atualiza necessidades.
* `setFeature(key, enabled)` – Liga/desliga recurso individual.

O `RootLayout` injeta o provider em toda aplicação. Um link "Pular para conteúdo" foi adicionado para navegação por teclado.

---

## Testes automatizados

Ainda **não** existem testes. Sugestão de stack:

* **Jest** + **React Testing Library** para testes unitários/componentes.
* **axe-core** para verificação de regras WCAG.

Exemplo de caso de teste (não implementado):

```ts
import { render } from '@testing-library/react';
import { AccessibilityProvider } from '@/context/AccessibilityContext';

test('seleciona necessidade visual', () => {
  // TODO: Exemplo – implementar lógica de teste
});
```

---

## Contribuindo

1. Crie branch: `git checkout -b feature/minha-feature`.
2. Abra PR descrevendo mudanças.
3. Garanta que CI passe sem falhas.

Siga sempre as diretrizes de código limpo, SOLID e WCAG 2.1.

---

© 2024 InclusiveAID

---

## Documentação Técnica – Conteúdo Unificado

> Esta seção consolida as informações de `docs/TECHNICAL.md` e `docs/FUNCTIONALIDADES.md`, oferecendo uma visão completa da arquitetura e do funcionamento interno do InclusiveAID diretamente no README.

### Índice técnico
1. Visão Geral & Arquitetura
2. Fluxo de Dados
3. Componentes & Hooks
4. Funcionalidades detalhadas
5. Persistência de Preferências
6. Diretrizes de Extensão & Testes

### 1. Visão Geral & Arquitetura
Inclui-se aqui um resumo da estrutura de diretórios, stack tecnológica e objetivos do projeto (detalhados originalmente em `TECHNICAL.md`). Para o diagrama completo de pastas consulte a árvore abaixo:

```
app/
 ├─ components/      # UI e lógica reutilizável
 ├─ onboarding/      # Passo-a-passo inicial
 ├─ navegador/       # Navegador acessível em <iframe>
 ├─ context/         # Contextos globais (AccessibilityContext)
 └─ lib/             # Helpers (TTS, áudio, utils)
```

### 2. Fluxo de Dados
1. **Inicialização** – Next.js monta `<RootLayout>` ➜ carrega preferências de `localStorage` ➜ aplica adaptações visuais/sonoras.
2. **Onboarding** – rotas `/onboarding/*` salvam `needs` e `features` no contexto.
3. **Aplicação Principal** – páginas consomem contexto e reagem a mudanças em tempo-real.

### 3. Componentes & Hooks
| Arquivo | Tipo | Descrição curta |
|---------|------|-----------------|
| `app/components/Button.tsx` | Componente | Botão acessível com variantes e *feedback sonoro* integrado. |
| `app/components/CaptionOverlay.tsx` | Componente | Exibe legendas de tudo que for falado pela engine TTS. |
| `app/components/FocusNarrator.tsx` | Componente | Narra labels de qualquer elemento focado ou *hovered*. |
| `app/hooks/useTTS.ts` | Hook | `useSpeakOnMount` para falar instruções no *mount*. |
| `app/context/AccessibilityContext.tsx` | Contexto | Estado global + persistência de necessidades/recursos. |

### 4. Funcionalidades detalhadas
A seguir apresenta-se **explicação linha-a-linha** (alto nível) das principais funcionalidades. Para referências completas consulte os arquivos fonte.

#### 4.1 TTS (`app/lib/tts.ts`)
1. Verifica ambiente *client-side* e suporte a `speechSynthesis`.
2. Cria `SpeechSynthesisUtterance` em `pt-BR`.
3. Cancela narrações anteriores para evitar sobreposição.
4. Dispara `CustomEvent('inclusiveaid_caption')` – consumido por `CaptionOverlay`.
5. Caso o Chrome ainda esteja carregando vozes, aguarda o evento `voiceschanged` antes de falar.

#### 4.2 Som (`app/lib/sound.ts`)
Usa `AudioContext` para tocar um *beep* (440 Hz/100 ms). Fecha o contexto em `onended` garantindo que não haja *memory leaks*.

#### 4.3 AccessibilityContext
- **Carregamento**: `useEffect` inicial lê `localStorage` e injeta defaults.
- **Persistência**: outro `useEffect` grava estado sempre que `needs` ou `features` mudam.
- **Side-effects**: alto contraste altera `<html>.classList`; narração ativa fala mensagem inicial.

#### 4.4 CaptionOverlay
Escuta `inclusiveaid_caption`; quando o evento ocorre, mostra a legenda por 6 s e então some. Só renderiza se a flag *Ativar Legenda* estiver `true`.

#### 4.5 FocusNarrator
Registra listeners globais `focusin` e `mouseover`; quando disparam, extrai label acessível ( `aria-label`, `alt`, `innerText` ) e chama `speak()` se narração estiver ativa.

#### 4.6 Fluxo de Onboarding
- **WelcomePage**: usa `useSpeakOnMount` para orientar usuário.
- **NecessidadesPage**: popula `needs` via `setNeeds`; cada clique emite *beep* se feedback sonoro ativo.
- **AcessibilidadePage**: toggles atualizam `features` em tempo-real e descrevem via narração.

### 5. Persistência de Preferências
As configurações são serializadas em `localStorage` sob a chave `inclusive_aid_accessibility`:

```json
{
  "needs": ["visual", "auditiva"],
  "features": {
    "Ativar narração": true,
    "Ativar alto contraste": false,
    "Ativar Legenda": true
  }
}
```

### 6. Diretrizes de Extensão & Testes
1. **Adicionar recurso novo**: inclua label em `recursosList` (onboarding) e valor-padrão em `AccessibilityContext`.
2. **Internacionalização**: mover strings para arquivo JSON e parametrizar `SpeechSynthesisUtterance.lang`.
3. **Testes**: usar Jest + React Testing Library. Para acessibilidade utilize `axe-core` e Lighthouse.
4. **Performance**: modules pesados devem ser *lazy-loaded* via `next/dynamic`.

---

> Conteúdo completo das fontes originais permanece disponível em `docs/TECHNICAL.md` e `docs/FUNCTIONALIDADES.md`.
