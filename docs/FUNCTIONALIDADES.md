# Documentação Técnica de Funcionalidades – InclusiveAID

> **Escopo**: Este documento descreve, em profundidade técnica, todas as funcionalidades presentes no front-end do InclusiveAID (commit atual). O objetivo é servir como referência rápida para novos(as) desenvolvedores(as) e para manutenção evolutiva.
>
> **Stack**: Next.js 14 · React 18 · TypeScript · Tailwind CSS · CSS Modules.

---

## Índice
1. [Camada de Contexto](#1-camada-de-contexto)
2. [Bibliotecas Utilitárias](#2-bibliotecas-utilitárias)
3. [Hooks Personalizados](#3-hooks-personalizados)
4. [Componentes Reutilizáveis](#4-componentes-reutilizáveis)
5. [Fluxo de Onboarding](#5-fluxo-de-onboarding)
6. [Páginas Principais](#6-páginas-principais)
7. [Persistência & Formato de Dados](#7-persistência--formato-de-dados)
8. [Diretrizes de Extensão](#8-diretrizes-de-extensão)

---

## 1. Camada de Contexto

### 1.1 `AccessibilityContext`
Arquivo: `app/context/AccessibilityContext.tsx`

Responsável por centralizar **estado global**, persistência e side-effects de acessibilidade.

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `needs` | `string[]` | Lista de deficiências selecionadas pelo usuário (‘visual’, ‘auditiva’ …). |
| `features` | `Record<string, boolean>` | Mapa de recursos de acessibilidade (alto contraste, narração, etc.). |
| `setNeeds(needs)` | `(string[]) => void` | Substitui completamente o array `needs`. |
| `toggleFeature(key)` | `(string) => void` | Inverte o valor de `features[key]`. |
| `setFeature(key, enabled)` | `(string, boolean) => void` | Define explicitamente o valor de `features[key]`. |

#### Ciclo de Vida
1. **Montagem**: lê `localStorage('inclusive_aid_accessibility')` e popula `needs` + `features`.
2. **Atualização**: qualquer alteração em `needs` ou `features` é refletida no `localStorage`.
3. **Efeitos extra**:
   - Quando a flag **"Ativar narração"** muda de *false*→*true*, aciona `speak('Narração ativada …')`.
   - Flag **"Ativar alto contraste"** injeta/classe `high-contrast` em `<html>` para troca de tema via CSS.

> Importante: Se novas features forem adicionadas, garanta valor-padrão no `useState` inicial OU mescle no `localStorage` durante o *load* para retro-compatibilidade.

---

## 2. Bibliotecas Utilitárias

### 2.1 `app/lib/tts.ts`
Função `speak(text: string)` – interface mínima com a API `window.speechSynthesis`.

Fluxo:
1. **Guarda-chuvas** de execução (client-side + browser support);
2. Cria `SpeechSynthesisUtterance` com idioma `pt-BR`;
3. Cancela narrações em andamento  (`synth.cancel()`);
4. Emite evento `CustomEvent('inclusiveaid_caption')` – base para legendagem.

Edge-case: Em Chrome a lista de vozes chega tardiamente; o código aguarda `voiceschanged` antes de falar.

### 2.2 `app/lib/sound.ts`
`playBeep(frequency = 440, duration = 0.1)` – gera *beep* curto via `AudioContext`; fecha o contexto em `onended` para evitar *leaks*.

### 2.3 `app/lib/utils.ts`
Alias `cn(…inputs)` → `tailwind-merge` + `clsx` (merge inteligente de classes Tailwind). Use-o em novos componentes para evitar classes duplicadas.

---

## 3. Hooks Personalizados

| Hook | Arquivo | Responsabilidade |
|------|---------|------------------|
| `useSpeakOnMount(message)` | `app/hooks/useTTS.ts` | Fala `message` assim que o componente é montado, **se** `features['Ativar narração']` estiver ativo. Dependência apenas da flag e do `message` (garante que não repete a cada render). |

> Boas-práticas: para frases dinâmicas, memorize o `message` com `useMemo` antes de passar ao hook.

---

## 4. Componentes Reutilizáveis

### 4.1 `Button`
Arquivo: `app/components/Button.tsx`

- Propagação completa de props HTML (`forwardRef`).
- *Variants*: `primary | secondary | outline`.  
- *Sizes*: `sm | md | lg`.
- Integração com **feedback sonoro**: chama `playBeep()` no `onClick` se a feature correspondente estiver ativa.

### 4.2 `CaptionOverlay`
Arquivo: `app/components/CaptionOverlay.tsx`

- Intercepta `window` → `inclusiveaid_caption` e exibe texto sobreposto.
- Auto-clear em 6 s.
- Condição de render: `features['Ativar Legenda']`.

### 4.3 `FocusNarrator`
Arquivo: `app/components/FocusNarrator.tsx`

- Observa eventos globais `focusin` + `mouseover`.
- Deriva descrição acessível do alvo (ordem: `aria-label` → `aria-labelledby` → `alt` → `innerText`).
- Dispara `speak(label)` se narração estiver ativa.

---

## 5. Fluxo de Onboarding

### 5.1 Pilha de Páginas
| Ordem | Route | Component | Objetivo |
|-------|-------|-----------|----------|
| 1 | `/onboarding/welcome` | `WelcomePage` | Saudação + introdução.
| 2 | `/onboarding/necessidades` | `NecessidadesPage` | Selecionar `needs`.
| 3 | `/onboarding/acessibilidade` | `AcessibilidadePage` | Configurar `features`.

> Navegação **forward/backward** ocorre via callbacks de alto nível ou roteador Next (`useRouter`).

#### 5.1.1 Highlights de Código
- Todas as páginas usam `useSpeakOnMount` para instruções por voz.
- **NecessidadesPage** utiliza `Image` otimizado do Next e `aria-pressed` em *buttons* para acessibilidade.
- **AcessibilidadePage** persiste cada toggle em tempo-real (`setFeature`). Caso narração esteja ativa, verbaliza o estado do toggle.

---

## 6. Páginas Principais

### 6.1 `app/page.tsx` (Home)
- Verifica se `needs` está vazio → redireciona para `/onboarding`.
- Gera **resumo falado** das configurações (necessidades + recursos).
- Renderiza listas resumidas + ações: *Usar Navegador* (`/navegador`), *Revogar* (TODO) e *Configurações*.

### 6.2 `app/navegador/page.tsx`
- Mini-browser em `<iframe>` para demonstração.
- Se alto contraste ativo, aplica filtro CSS (invert + grayscale) ao `iframe`.
- Toolbar com campo de URL e `Button` reutilizado.

### 6.3 `app/layout.tsx`
- Carrega fontes (`next/font/google`).
- Skip-link "Pular para conteúdo" visível ao foco.
- Injeta `AccessibilityProvider`, `CaptionOverlay` e `FocusNarrator` em toda a árvore.

---

## 7. Persistência & Formato de Dados

`localStorage` → chave **`inclusive_aid_accessibility`**
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
A versão do esquema é implícita; caso adicione novos campos, mantenha *fallbacks* para ler valores *undefined*.

---

## 8. Diretrizes de Extensão
1. **Novos Recursos de Acessibilidade**
   - Declare label na array `recursosList` (onboarding) **e** adicione valor-padrão em `AccessibilityContext`.
   - Crie hooks/comps isolados para efeitos visuais/sonoros.
2. **Internacionalização (i18n)**
   - Centralize strings em arquivo JSON.
   - Parametrize `SpeechSynthesisUtterance.lang`.
3. **Testes**
   - Cubra `AccessibilityContext` com *unit tests* (mock de `localStorage`).
   - Utilize `@testing-library/react` + `axe-core` para regressão de acessibilidade.
4. **Performance**
   - Lazy-load libs externas (ex.: assistente de libras) usando `dynamic(() => import())`.

---

**Última atualização:** <!-- TODO: CI irá preencher data --> 