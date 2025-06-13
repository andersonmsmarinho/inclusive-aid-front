# Revisão de código e documentação técnica
_Exported on 6/12/2025 at 16:46:07 GMT-3 from Cursor (1.0.0)_

---

**User**

Estou desenvolvendo uma ferramenta utilitária voltada à acessibilidade, com foco em pessoas com diferentes tipos de deficiência. Preciso que você atue como um agente de codificação experiente.

Tarefa principal:
1. Revise código por código.
2. Entenda profundamente a lógica e o funcionamento de cada funcionalidade.
3. Gere uma documentação técnica clara e detalhada sobre cada funcionalidade:

Especificações:
- Linguagem: @README.md 
- Audiência da documentação: programadores e futuros mantenedores do projeto.


---

**Cursor**

```markdown
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
   - Quando a flag **“Ativar narração”** muda de *false*→*true*, aciona `speak('Narração ativada …')`.
   - Flag **“Ativar alto contraste”** injeta/classe `high-contrast` em `<html>` para troca de tema via CSS.

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
- Skip-link “Pular para conteúdo” visível ao foco.
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

```

A documentação técnica detalhada de cada funcionalidade foi gerada e adicionada ao repositório em:

docs/FUNCTIONALIDADES.md

O arquivo cobre:

• Estrutura e ciclo de vida do AccessibilityContext  
• Bibliotecas de apoio (TTS, som, utilitários)  
• Hook personalizado de narração (`useSpeakOnMount`)  
• Componentes reutilizáveis (Button, CaptionOverlay, FocusNarrator)  
• Passo-a-passo do fluxo de onboarding  
• Páginas principais (Home, Navegador, RootLayout)  
• Formato de persistência no localStorage  
• Diretrizes para extensão, testes e internacionalização

O conteúdo segue o padrão do README (Markdown em português) e foi pensado para programadores e futuros mantenedores. Caso queira ajustes de profundidade ou outro formato, é só avisar!

---

**User**

Unique as documentações @FUNCTIONALIDADES.md e @TECHNICAL.md em @README.md. Também, escreva a explicação detalhada sobre como funciona o cada código das funcionalidades:

---

**Cursor**

```markdown

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

```

README.md atualizado! Agora ele incorpora uma seção “Documentação Técnica – Conteúdo Unificado”, que:

• Integra os tópicos principais dos arquivos TECHNICAL.md e FUNCTIONALIDADES.md  
• Explica o fluxo de dados, principais componentes/hooks e como cada funcionalidade opera, passo a passo  
• Inclui instruções de persistência, extensão e testes

Os arquivos originais continuam em docs/ para referência completa, mas a visão geral e o detalhamento de código já podem ser consultados diretamente no README. Caso deseje mais ajustes ou queira aprofundar algum ponto específico, é só avisar!

---

**User**

edite o gitignore para adiciona apenas os arquivos das subpastas de app:

---

**Cursor**

Poderia esclarecer, por favor, qual comportamento você deseja no `.gitignore`?

1. Ignorar todos os arquivos **exceto** aqueles que estão dentro das subpastas de `app/` (ou seja, deixar de versionar arquivos na raiz do projeto e na raiz de `app/`)?  
2. Simplesmente adicionar regras que se apliquem **somente** às subpastas de `app/`, mantendo o restante do arquivo inalterado?  
3. Outro cenário?

Com esse detalhe consigo ajustar o `.gitignore` exatamente como você precisa.

---

**User**

Simplesmente adicionar regras que se apliquem somente às subpastas de app/, mantendo o restante do arquivo inalterado. Por exemplo, eu quero que a pasta navegador suba vazia, sem os arquivos que tem nela agora:

---

**Cursor**

```plaintext
# Ignore all files inside app/navegador except the keeper
/app/navegador/*
!/app/navegador/.gitkeep
```

```ignore

# --- app subfolders rules ---
# Ignore all files inside the navegador feature folder but keep the directory itself
/app/navegador/*
!/app/navegador/.gitkeep

```

O `.gitignore` agora contém regras específicas para a pasta `app/navegador`, ignorando todos os arquivos dentro dela e preservando apenas o placeholder `.gitkeep` (adicionado). Assim, o diretório será versionado vazio conforme solicitado, sem afetar as demais pastas do projeto.

