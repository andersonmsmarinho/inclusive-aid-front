# Documentação Técnica - InclusiveAID

## Índice
1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Componentes](#3-componentes)
4. [Acessibilidade](#4-acessibilidade)
5. [Desenvolvimento](#5-desenvolvimento)
6. [Deploy](#6-deploy)

## 1. Visão Geral

O InclusiveAID é uma aplicação web moderna desenvolvida com Next.js e React, focada em fornecer uma experiência digital inclusiva para pessoas com diferentes tipos de deficiência. O projeto utiliza TypeScript para garantir type safety e implementa diversas funcionalidades de acessibilidade.

### 1.1 Objetivos
- Criar uma interface adaptável às necessidades específicas de cada usuário
- Implementar recursos de acessibilidade avançados
- Fornecer uma experiência digital inclusiva
- Facilitar a navegação e interação para todos os usuários

### 1.2 Stack Tecnológica
- **Framework**: Next.js 14.1.0
- **Linguagem**: TypeScript/JavaScript
- **UI Framework**: React 18.2.0
- **Estilização**: Tailwind CSS + CSS Modules
- **Componentes UI**: Radix UI
- **Gerenciamento de Estado**: React Hooks

## 2. Arquitetura

### 2.1 Estrutura de Diretórios
```
inclusive-aid-front/
├── app/                    # Diretório principal da aplicação
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes de UI base
│   │   └── Button.tsx     # Componente de botão customizado
│   ├── onboarding/        # Fluxo de onboarding
│   │   ├── welcome/       # Tela de boas-vindas
│   │   ├── necessidades/  # Seleção de necessidades
│   │   └── acessibilidade/# Configurações de acessibilidade
│   ├── lib/              # Utilitários e helpers
│   ├── globals.css       # Estilos globais
│   └── layout.tsx        # Layout principal
├── public/               # Assets estáticos
├── lib/                  # Utilitários compartilhados
└── docs/                # Documentação do projeto
```

### 2.2 Fluxo de Dados
1. **Inicialização**
   - Carregamento da aplicação Next.js
   - Inicialização do tema e configurações globais
   - Verificação de preferências salvas

2. **Onboarding**
   - Sequência: Welcome → Necessidades → Acessibilidade
   - Coleta de preferências do usuário
   - Persistência de configurações

3. **Aplicação Principal**
   - Carregamento das configurações
   - Aplicação de adaptações
   - Interface adaptativa

## 3. Componentes

### 3.1 Componentes Principais

#### Button (`app/components/Button.tsx`)
```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}
```
- Componente de botão reutilizável
- Suporte a diferentes variantes e tamanhos
- Implementação de acessibilidade com ARIA
- Estilização com Tailwind CSS

#### Onboarding Components
1. **WelcomePage**
   - Tela inicial de boas-vindas
   - Apresentação da marca
   - Versão da aplicação

2. **NecessidadesPage**
   - Seleção de necessidades específicas
   - Suporte para múltiplas seleções
   - Categorias: Visual, Auditiva, Motora, Cognitiva, Sensorial

3. **AcessibilidadePage**
   - Configuração de recursos
   - Toggles para ativar/desativar
   - Recursos disponíveis:
     - Alto contraste
     - Narração
     - Legendas
     - Assistente de libras
     - Feedback tátil/sonoro
     - Controle por movimento ocular

## 4. Acessibilidade

### 4.1 Implementações
- **Alto Contraste**
  - Implementado via CSS variables
  - Tema claro/escuro
  - Contraste configurável

- **Navegação**
  - Suporte a teclado
  - Focus management
  - Skip links

- **Semântica**
  - ARIA labels
  - Roles apropriados
  - HTML semântico

- **Feedback**
  - Visual
  - Sonoro
  - Tátil

### 4.2 Diretrizes WCAG
- Nível A: Implementado
- Nível AA: Em implementação
- Nível AAA: Planejado

## 5. Desenvolvimento

### 5.1 Setup do Ambiente
```bash
# Instalação
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start
```

### 5.2 Convenções de Código
- **Nomenclatura**
  - Componentes UI: Português
  - Funções/Variáveis: Inglês
  - Arquivos: kebab-case
  - Componentes: PascalCase

- **Estilização**
  - CSS Modules
  - Tailwind CSS
  - Variáveis CSS para temas

- **TypeScript**
  - Strict mode
  - Interfaces explícitas
  - Tipos customizados

### 5.3 Testes
- **Unitários**
  - Jest
  - React Testing Library

- **Acessibilidade**
  - axe-core
  - Lighthouse
  - Testes manuais

## 6. Deploy

### 6.1 Ambiente de Produção
- **Plataforma**: Vercel
- **Domínio**: TBD
- **CDN**: Edge Network

### 6.2 CI/CD
- **Build**: Automático via Vercel
- **Testes**: GitHub Actions
- **Deploy**: Automático após merge

### 6.3 Monitoramento
- **Performance**: Vercel Analytics
- **Erros**: Sentry (planejado)
- **Acessibilidade**: Lighthouse CI

## 7. Manutenção

### 7.1 Atualizações
- Dependências: Mensal
- Next.js: Seguindo versões LTS
- React: Seguindo versões estáveis

### 7.2 Backup
- Código: GitHub
- Configurações: Vercel
- Assets: CDN

## 8. Roadmap

### 8.1 Curto Prazo
- [ ] Implementar testes automatizados
- [ ] Adicionar mais feedback sonoro
- [ ] Melhorar suporte a screen readers

### 8.2 Médio Prazo
- [ ] Suporte a mais idiomas
- [ ] Integração com assistentes de voz
- [ ] Personalização avançada de temas

### 8.3 Longo Prazo
- [ ] Modo offline
- [ ] Sincronização entre dispositivos
- [ ] Perfis de usuário personalizados

## 9. Contribuição

### 9.1 Como Contribuir
1. Fork do repositório
2. Branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Pull Request

### 9.2 Diretrizes
- Seguir convenções de código
- Implementar testes
- Atualizar documentação
- Seguir WCAG 2.1

## 10. Suporte

### 10.1 Canais
- Issues: GitHub
- Email: TBD
- Discord: TBD

### 10.2 Documentação Adicional
- [README.md](../README.md)
- [docs/ui-context/](./ui-context/)
- [docs/dev-context/](./dev-context/)

---

Última atualização: Fevereiro 2024
Versão: 0.9.2024.2 