# Changelog

## 0.9.2024.3 – **11-Jun-2025**

### Added

- `AccessibilityContext` provider para armazenar necessidades e recursos de acessibilidade com persistência em `localStorage`.
- Link "Pular para conteúdo" em `RootLayout` para navegação por teclado.
- Componente de contexto incluído globalmente via `AccessibilityProvider`.
- Renderização dinâmica das listas de necessidades e recursos na `Home`.
- Suporte a narração TTS usando Web Speech API; hook `useSpeakOnMount` e utilitário `speak()`.
- Feedback sonoro (beep) para cliques e toggles quando "Ativar feedback sonoro" estiver ativo.
- Legendas on-screen exibindo as mesmas mensagens da narração quando "Ativar Legenda" estiver ativo.
- Narrador de foco: lê automaticamente elementos focados ou sob mouse quando "Ativar narração" estiver ativo.

### Changed

- Integrado fluxo de onboarding (`