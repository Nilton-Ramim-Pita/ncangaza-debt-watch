# DOCUMENTAÇÃO TÉCNICA
## Sistema de Gestão de Dívidas - Ncangaza Multiservices

---

**Autor:** Nilton Ramim Pita

**Instituição:** Universidade Católica de Moçambique (UCM)

**Versão:** 1.0.0

**Ano:** 2025

---

# ÍNDICE

1. [Introdução](#1-introdução)
   - 1.1 [Objetivo da Documentação](#11-objetivo-da-documentação)
   - 1.2 [Público-Alvo](#12-público-alvo)
   - 1.3 [Contexto do Sistema](#13-contexto-do-sistema)

2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
   - 2.1 [Diagrama de Arquitetura](#21-diagrama-de-arquitetura)
   - 2.2 [Descrição da Arquitetura](#22-descrição-da-arquitetura)
   - 2.3 [Justificativa da Arquitetura](#23-justificativa-da-arquitetura)
   - 2.4 [Vantagens e Limitações](#24-vantagens-e-limitações)

3. [Diagramas do Sistema](#3-diagramas-do-sistema)
   - 3.1 [Diagramas de Fluxo](#31-diagramas-de-fluxo)
   - 3.2 [Diagrama de Caso de Uso](#32-diagrama-de-caso-de-uso)
   - 3.3 [Diagrama Entidade-Relacionamento](#33-diagrama-entidade-relacionamento)
   - 3.4 [Diagrama de Sequência](#34-diagrama-de-sequência)

4. [Base de Dados](#4-base-de-dados)
   - 4.1 [Scripts SQL Completos](#41-scripts-sql-completos)
   - 4.2 [Descrição das Tabelas](#42-descrição-das-tabelas)
   - 4.3 [Políticas RLS](#43-políticas-rls)
   - 4.4 [Funções e Triggers](#44-funções-e-triggers)

5. [Backend / Lógica do Sistema](#5-backend--lógica-do-sistema)
   - 5.1 [Tecnologias Utilizadas](#51-tecnologias-utilizadas)
   - 5.2 [APIs e Endpoints](#52-apis-e-endpoints)
   - 5.3 [Fluxo de Autenticação](#53-fluxo-de-autenticação)
   - 5.4 [Edge Functions](#54-edge-functions)

6. [Frontend](#6-frontend)
   - 6.1 [Tecnologias](#61-tecnologias)
   - 6.2 [Estrutura de Pastas](#62-estrutura-de-pastas)
   - 6.3 [Componentes Principais](#63-componentes-principais)
   - 6.4 [Hooks Personalizados](#64-hooks-personalizados)

7. [Interface do Sistema](#7-interface-do-sistema)
   - 7.1 [Tela de Login](#71-tela-de-login)
   - 7.2 [Dashboard](#72-dashboard)
   - 7.3 [Gestão de Clientes](#73-gestão-de-clientes)
   - 7.4 [Gestão de Dívidas](#74-gestão-de-dívidas)
   - 7.5 [Notificações](#75-notificações)
   - 7.6 [Relatórios](#76-relatórios)

8. [Segurança](#8-segurança)
   - 8.1 [Row Level Security (RLS)](#81-row-level-security-rls)
   - 8.2 [Autenticação](#82-autenticação)
   - 8.3 [Gestão de Permissões](#83-gestão-de-permissões)
   - 8.4 [Logs e Auditoria](#84-logs-e-auditoria)

9. [Testes](#9-testes)
   - 9.1 [Estratégia de Testes](#91-estratégia-de-testes)
   - 9.2 [Testes Manuais](#92-testes-manuais)
   - 9.3 [Validações do Sistema](#93-validações-do-sistema)

10. [Deployment](#10-deployment)
    - 10.1 [Hospedagem](#101-hospedagem)
    - 10.2 [Processo de Deploy](#102-processo-de-deploy)
    - 10.3 [Variáveis de Ambiente](#103-variáveis-de-ambiente)
    - 10.4 [Backup e Failover](#104-backup-e-failover)

11. [Manutenção](#11-manutenção)
    - 11.1 [Tarefas Diárias](#111-tarefas-diárias)
    - 11.2 [Tarefas Semanais](#112-tarefas-semanais)
    - 11.3 [Backup](#113-backup)
    - 11.4 [Monitorização de Logs](#114-monitorização-de-logs)

12. [Manual de Instalação](#12-manual-de-instalação)
    - 12.1 [Requisitos do Sistema](#121-requisitos-do-sistema)
    - 12.2 [Instalação Local](#122-instalação-local)
    - 12.3 [Configuração do Supabase](#123-configuração-do-supabase)

13. [Manual do Utilizador](#13-manual-do-utilizador)
    - 13.1 [Perfis do Sistema](#131-perfis-do-sistema)
    - 13.2 [Guia de Utilização](#132-guia-de-utilização)
    - 13.3 [Erros Comuns e Soluções](#133-erros-comuns-e-soluções)

---

# 1. INTRODUÇÃO

## 1.1 Objetivo da Documentação

Esta documentação técnica tem como objetivo fornecer uma descrição completa e detalhada do **Sistema de Gestão de Dívidas** desenvolvido para a empresa **Ncangaza Multiservices**. O documento abrange todos os aspectos técnicos do sistema, desde a arquitetura até aos procedimentos de manutenção.

A documentação serve como:
- **Referência técnica** para desenvolvedores e equipas de manutenção
- **Material de avaliação académica** para a monografia universitária
- **Guia de operação** para administradores do sistema
- **Documentação de suporte** para futuras extensões e melhorias

## 1.2 Público-Alvo

Esta documentação destina-se a:

| Público | Secções Relevantes |
|---------|-------------------|
| **Desenvolvedores** | Arquitetura, Base de Dados, Backend, Frontend |
| **Avaliadores Académicos** | Todas as secções, especialmente Diagramas e Justificativas |
| **Administradores de Sistema** | Deployment, Manutenção, Segurança |
| **Utilizadores Avançados** | Manual do Utilizador, Interface do Sistema |

## 1.3 Contexto do Sistema

O Sistema de Gestão de Dívidas foi desenvolvido para atender às necessidades operacionais da **Ncangaza Multiservices**, uma empresa moçambicana que necessita de controlar e gerir dívidas de clientes de forma eficiente e automatizada.

### Problema Identificado
- Gestão manual de dívidas propensa a erros
- Falta de notificações automáticas de vencimento
- Dificuldade em gerar relatórios consolidados
- Ausência de histórico de comunicações com clientes

### Solução Implementada
Um sistema web completo com:
- **Dashboard interativo** com estatísticas em tempo real
- **Gestão de clientes e dívidas** com interface intuitiva
- **Sistema de notificações multi-canal** (Email, WhatsApp, Chamadas)
- **Relatórios automatizados** em PDF, CSV e TXT
- **Notificações automáticas** de vencimento e pagamento

---

# 2. ARQUITETURA DO SISTEMA

## 2.1 Diagrama de Arquitetura

```mermaid
graph TB
    subgraph "Camada de Apresentação - Vercel"
        A[React 18 + TypeScript]
        B[Vite Build Tool]
        C[TailwindCSS + shadcn/ui]
        D[React Query - Cache]
        E[React Router - Navegação]
    end
    
    subgraph "Camada de Aplicação - Supabase"
        F[Edge Functions - Deno Runtime]
        G[Supabase Auth - JWT]
        H[Realtime Subscriptions - WebSocket]
    end
    
    subgraph "Camada de Dados - PostgreSQL"
        I[(PostgreSQL 15)]
        J[Row Level Security - RLS]
        K[Triggers & Functions]
        L[Views Materializadas]
    end
    
    subgraph "Serviços Externos"
        M[Resend API - Emails]
        N[WhatsApp - wa.me Links]
        O[Telefonia - Native App]
    end
    
    subgraph "Armazenamento"
        P[Supabase Storage - Avatars]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    
    D -->|REST API| F
    D -->|REST API| I
    A -->|Auth| G
    A -->|WebSocket| H
    
    F --> I
    F --> M
    G --> J
    H --> K
    
    I --> J
    I --> K
    I --> L
    
    A -->|Upload| P
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style I fill:#3ecf8e,stroke:#333,stroke-width:2px
    style F fill:#ffd93d,stroke:#333,stroke-width:2px
    style M fill:#ff6b6b,stroke:#333,stroke-width:2px
```

## 2.2 Descrição da Arquitetura

O sistema segue uma arquitetura **cliente-servidor** com separação clara entre frontend e backend, utilizando o modelo **Serverless** para a lógica de negócio.

### Componentes da Arquitetura

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Apresentação** | React + Vite | Interface do utilizador, navegação, estado local |
| **Aplicação** | Supabase Edge Functions | Lógica de negócio, validações, integrações |
| **Dados** | PostgreSQL + RLS | Persistência, segurança a nível de linha |
| **Autenticação** | Supabase Auth | Gestão de sessões, tokens JWT |
| **Tempo Real** | Supabase Realtime | Actualizações instantâneas via WebSocket |

### Padrão de Comunicação

```
[Browser] --> HTTPS --> [Vercel CDN] --> [React App]
                                              |
                                              v
                                        [Supabase API]
                                              |
                        +---------------------+---------------------+
                        |                     |                     |
                        v                     v                     v
                  [PostgreSQL]       [Edge Functions]        [Realtime]
```

## 2.3 Justificativa da Arquitetura

### Porquê React + Vite?
- **Performance**: Vite oferece Hot Module Replacement (HMR) ultra-rápido
- **Ecossistema**: React possui a maior comunidade e bibliotecas disponíveis
- **Manutenibilidade**: TypeScript garante type-safety e auto-complete
- **Produtividade**: shadcn/ui fornece componentes prontos e personalizáveis

### Porquê Supabase?
- **Open Source**: Baseado em PostgreSQL, sem vendor lock-in
- **Serverless**: Escalabilidade automática sem gestão de servidores
- **RLS Nativo**: Segurança a nível de base de dados
- **Realtime**: WebSockets integrados nativamente
- **Custo**: Tier gratuito generoso, adequado para MVP

### Porquê Arquitectura Serverless?
- **Escalabilidade**: Adapta-se automaticamente à carga
- **Custo**: Paga-se apenas pelo uso real
- **Manutenção**: Sem necessidade de gerir servidores
- **Deploy**: Actualizações contínuas sem downtime

## 2.4 Vantagens e Limitações

### Vantagens

| Aspecto | Benefício |
|---------|-----------|
| **Custo Inicial** | Baixo - utiliza serviços gratuitos ou pay-as-you-go |
| **Time-to-Market** | Rápido - ferramentas modernas aceleram desenvolvimento |
| **Escalabilidade** | Alta - serverless escala automaticamente |
| **Segurança** | Forte - RLS + JWT + HTTPS |
| **Manutenção** | Simples - menos infraestrutura para gerir |
| **Performance** | Boa - CDN global + cache inteligente |

### Limitações

| Aspecto | Limitação | Mitigação |
|---------|-----------|-----------|
| **Cold Starts** | Edge Functions podem ter latência inicial | Cache agressivo, keep-alive |
| **Complexidade SQL** | RLS pode complicar queries complexas | Funções SQL SECURITY DEFINER |
| **Vendor Lock-in** | Dependência de Supabase | Código SQL standard, fácil migração |
| **Offline** | Sistema requer conexão internet | PWA futuro, cache local |
| **Limite de Funções** | Timeout de 60s em Edge Functions | Operações assíncronas, filas |

---

# 3. DIAGRAMAS DO SISTEMA

## 3.1 Diagramas de Fluxo

### 3.1.1 Fluxo de Login

```mermaid
flowchart TD
    A([Utilizador Acede ao Sistema]) --> B[Mostrar Página de Login]
    B --> C[Inserir Email e Senha]
    C --> D{Validar Formato}
    
    D -->|Inválido| E[Mostrar Erro de Formato]
    E --> C
    
    D -->|Válido| F[Chamar Supabase Auth]
    F --> G{Autenticação OK?}
    
    G -->|Não| H[Mostrar Erro: Credenciais Inválidas]
    H --> C
    
    G -->|Sim| I[Buscar Perfil do Utilizador]
    I --> J[Buscar Role na Tabela user_roles]
    J --> K[Registar Login em login_history]
    K --> L[Armazenar Sessão no Estado]
    L --> M{É Admin?}
    
    M -->|Sim| N[Redirecionar para Dashboard Completo]
    M -->|Não| O[Redirecionar para Dashboard Limitado]
    
    N --> P([Sistema Carregado])
    O --> P
```

### 3.1.2 Fluxo de Registo de Dívida

```mermaid
flowchart TD
    A([Utilizador Clica Nova Dívida]) --> B[Abrir Modal de Formulário]
    B --> C[Preencher Dados]
    C --> D{Validar Campos}
    
    D -->|Inválido| E[Mostrar Erros de Validação]
    E --> C
    
    D -->|Válido| F[Submeter Formulário]
    F --> G[INSERT na Tabela dividas]
    G --> H{Inserção OK?}
    
    H -->|Não| I[Mostrar Erro de BD]
    I --> C
    
    H -->|Sim| J[Trigger: notify_new_debt]
    J --> K[Criar Notificação In-App]
    K --> L[Emitir Evento Realtime]
    L --> M[Actualizar UI Automaticamente]
    M --> N[Mostrar Toast de Sucesso]
    N --> O[Fechar Modal]
    O --> P([Fim])
```

### 3.1.3 Fluxo de Envio de Notificações

```mermaid
flowchart TD
    A([CRON Diário 00:00 UTC]) --> B[Invocar Edge Function check-debts]
    B --> C[Consultar Dívidas a Vencer em 1 Dia]
    C --> D{Existem Dívidas?}
    
    D -->|Não| E([Fim - Nenhuma Acção])
    
    D -->|Sim| F[Loop: Para Cada Dívida]
    F --> G[Obter Dados do Cliente]
    G --> H{Cliente Tem Email?}
    
    H -->|Não| I[Registar: Sem Email]
    I --> F
    
    H -->|Sim| J[Construir Mensagem]
    J --> K[Chamar send-email]
    K --> L{Email Enviado?}
    
    L -->|Não| M[Registar Erro]
    M --> F
    
    L -->|Sim| N[Registar Sucesso]
    N --> O[Notificar Admins]
    O --> F
    
    F -->|Fim Loop| P[Actualizar Status Dívidas Vencidas]
    P --> Q([Fim do CRON])
```

### 3.1.4 Fluxo de Pagamento

```mermaid
flowchart TD
    A([Utilizador Clica Pagar]) --> B[Mostrar Modal de Confirmação]
    B --> C{Confirmar?}
    
    C -->|Não| D([Cancelar])
    
    C -->|Sim| E[UPDATE dividas SET status=paga]
    E --> F{UPDATE OK?}
    
    F -->|Não| G[Mostrar Erro]
    G --> A
    
    F -->|Sim| H[Trigger: notify_payment_completed]
    H --> I[Criar Notificação In-App]
    I --> J[Buscar Admins Activos]
    J --> K[Loop: Enviar Email para Cada Admin]
    K --> L[Emitir Evento Realtime]
    L --> M[Actualizar Dashboard]
    M --> N[Mostrar Toast Sucesso]
    N --> O([Fim])
```

### 3.1.5 Fluxo de Gestão de Clientes

```mermaid
flowchart TD
    A([Aceder Menu Clientes]) --> B[Carregar Lista de Clientes]
    B --> C{Acção?}
    
    C -->|Novo| D[Abrir Formulário Vazio]
    C -->|Editar| E[Abrir Formulário Preenchido]
    C -->|Desactivar| F[Confirmar Desactivação]
    C -->|Apagar| G{É Admin?}
    
    D --> H[Preencher Dados]
    E --> H
    
    H --> I{Validar?}
    I -->|Não| J[Mostrar Erros]
    J --> H
    
    I -->|Sim| K[Guardar no BD]
    K --> L[Actualizar Lista]
    L --> M[Toast Sucesso]
    
    F --> N[UPDATE ativo=false]
    N --> L
    
    G -->|Não| O[Toast: Sem Permissão]
    G -->|Sim| P[Confirmar Apagar]
    P -->|Sim| Q[DELETE Cliente]
    Q --> L
    P -->|Não| R([Cancelar])
    
    M --> S([Fim])
```

## 3.2 Diagrama de Caso de Uso

```mermaid
graph TB
    subgraph "Sistema de Gestão de Dívidas"
        UC1([Fazer Login/Logout])
        UC2([Visualizar Dashboard])
        UC3([Gerir Clientes])
        UC4([Gerir Dívidas])
        UC5([Marcar Pagamento])
        UC6([Enviar Notificações Manuais])
        UC7([Gerar Relatórios])
        UC8([Ver Notificações])
        UC9([Editar Perfil])
        UC10([Ver Histórico])
        UC11([Gerir Utilizadores])
        UC12([Configurar Templates])
        UC13([Ver Análises])
    end
    
    Admin((👤 Administrador))
    User((👤 Utilizador))
    Sistema((⚙️ Sistema))
    
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
    
    Sistema -.-> UC8
    Sistema -.-> UC2
    
    style Admin fill:#ff6b6b,stroke:#333,stroke-width:2px
    style User fill:#4ecdc4,stroke:#333,stroke-width:2px
    style Sistema fill:#95e1d3,stroke:#333,stroke-width:2px
```

### Tabela de Casos de Uso

| ID | Caso de Uso | Admin | User | Sistema |
|----|-------------|:-----:|:----:|:-------:|
| UC1 | Login/Logout | ✅ | ✅ | - |
| UC2 | Dashboard | ✅ | ✅ | ✅ |
| UC3 | Gerir Clientes | ✅ CRUD | ✅ CRU | - |
| UC4 | Gerir Dívidas | ✅ CRUD | ✅ CRU | - |
| UC5 | Marcar Pagamento | ✅ | ✅ | - |
| UC6 | Notificações Manuais | ✅ | - | - |
| UC7 | Gerar Relatórios | ✅ | ✅ | - |
| UC8 | Ver Notificações | ✅ | ✅ | ✅ |
| UC9 | Editar Perfil | ✅ | ✅ | - |
| UC10 | Ver Histórico | ✅ | ✅ | - |
| UC11 | Gerir Utilizadores | ✅ | ❌ | - |
| UC12 | Templates Notif. | ✅ | ❌ | - |
| UC13 | Análises Avançadas | ✅ | ❌ | - |

## 3.3 Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    CLIENTES ||--o{ DIVIDAS : "possui"
    CLIENTES ||--o{ NOTIFICACOES : "recebe"
    DIVIDAS ||--o{ NOTIFICACOES : "gera"
    AUTH_USERS ||--|| PROFILES : "tem"
    AUTH_USERS ||--|| USER_ROLES : "possui"
    AUTH_USERS ||--o{ USER_ACTIVITIES : "realiza"
    AUTH_USERS ||--o{ LOGIN_HISTORY : "regista"
    
    CLIENTES {
        uuid id PK "gen_random_uuid()"
        text nome "NOT NULL"
        text nuit "9 dígitos"
        text telefone "Formato +258"
        text email "Formato válido"
        text endereco "Endereço completo"
        boolean ativo "DEFAULT true"
        timestamp data_registro "DEFAULT now()"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "DEFAULT now()"
    }
    
    DIVIDAS {
        uuid id PK "gen_random_uuid()"
        uuid cliente_id FK "NOT NULL"
        numeric valor "NOT NULL > 0"
        text descricao "NOT NULL"
        text status "pendente|vencida|paga"
        date data_vencimento "NOT NULL"
        timestamp data_criacao "DEFAULT now()"
        timestamp data_pagamento "NULL até pago"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "DEFAULT now()"
    }
    
    NOTIFICACOES {
        uuid id PK "gen_random_uuid()"
        uuid divida_id FK "Opcional"
        uuid cliente_id FK "Opcional"
        text tipo "email|whatsapp|sms|in_app"
        text status "pendente|enviada|falha"
        text mensagem "Corpo da notificação"
        text erro "Se status=falha"
        boolean lida "DEFAULT false"
        timestamp data_agendamento "NOT NULL"
        timestamp data_envio "Quando enviada"
        timestamp created_at "DEFAULT now()"
    }
    
    PROFILES {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "auth.users NOT NULL"
        text full_name "NOT NULL"
        text avatar_url "URL do avatar"
        text telefone "Contacto"
        text cargo "Cargo na empresa"
        text departamento "Departamento"
        text bio "Descrição pessoal"
        boolean active "DEFAULT true"
        boolean email_notifications "DEFAULT true"
        boolean sms_notifications "DEFAULT false"
        boolean whatsapp_notifications "DEFAULT true"
        uuid created_by FK "Quem criou"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "DEFAULT now()"
    }
    
    USER_ROLES {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "auth.users NOT NULL"
        enum role "admin|user"
        timestamp created_at "DEFAULT now()"
    }
    
    USER_ACTIVITIES {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "NOT NULL"
        text action_type "login|create|update|delete"
        text description "Descrição da acção"
        jsonb metadata "Dados adicionais"
        timestamp created_at "DEFAULT now()"
    }
    
    LOGIN_HISTORY {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "NOT NULL"
        text ip_address "IP do cliente"
        text user_agent "Browser info"
        text device_info "Dispositivo"
        text location "Localização"
        timestamp login_at "DEFAULT now()"
    }
    
    NOTIFICATION_TEMPLATES {
        uuid id PK "gen_random_uuid()"
        text name "Nome do template"
        text type "vencimento|pagamento|alerta"
        text subject "Assunto do email"
        text body "Corpo com variáveis"
        boolean is_default "DEFAULT false"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "DEFAULT now()"
    }
    
    AUTH_USERS {
        uuid id PK "Supabase Auth"
        text email "Email único"
        text encrypted_password "Senha hash"
        timestamp created_at "Auto"
        timestamp last_sign_in_at "Auto"
    }
```

## 3.4 Diagrama de Sequência

### 3.4.1 Sequência de Notificação Automática

```mermaid
sequenceDiagram
    participant CRON as CRON Job
    participant EF as Edge Function<br/>check-debts
    participant DB as PostgreSQL
    participant Trigger as DB Trigger
    participant Email as send-email
    participant Resend as Resend API
    participant RT as Realtime
    participant UI as Frontend
    
    Note over CRON,UI: Execução Diária às 00:00 UTC
    
    CRON->>EF: POST /check-debts
    activate EF
    
    EF->>DB: SELECT dívidas vencendo amanhã
    DB-->>EF: Lista de dívidas
    
    loop Para cada dívida
        EF->>DB: SELECT cliente.email
        DB-->>EF: Email do cliente
        
        alt Cliente tem email
            EF->>Email: POST /send-email
            Email->>Resend: POST /emails
            Resend-->>Email: 200 OK
            Email-->>EF: success: true
            EF->>DB: INSERT notificacoes (enviada)
        else Sem email
            EF->>DB: INSERT notificacoes (falha)
        end
    end
    
    EF->>DB: UPDATE dividas SET status='vencida'
    activate DB
    
    DB->>Trigger: notify_debt_overdue()
    activate Trigger
    Trigger->>DB: INSERT notificacoes in_app
    Trigger->>DB: SELECT admins
    
    loop Para cada admin
        Trigger->>Email: POST /send-email
        Email->>Resend: POST /emails
    end
    
    Trigger->>RT: pg_notify('divida_vencida')
    deactivate Trigger
    deactivate DB
    
    RT->>UI: WebSocket: nova notificação
    UI->>UI: Actualizar badge
    UI->>UI: Mostrar toast
    
    deactivate EF
```

---

# 4. BASE DE DADOS

## 4.1 Scripts SQL Completos

### 4.1.1 Criação de Tipos Enumerados

```sql
-- Tipo para roles de utilizador
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```

### 4.1.2 Criação de Tabelas

```sql
-- Tabela de Clientes
CREATE TABLE public.clientes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    nuit TEXT,
    telefone TEXT,
    email TEXT,
    endereco TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Dívidas
CREATE TABLE public.dividas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    valor NUMERIC NOT NULL CHECK (valor > 0),
    descricao TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'vencida', 'paga')),
    data_vencimento DATE NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_pagamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Notificações
CREATE TABLE public.notificacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    divida_id UUID REFERENCES public.dividas(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('email', 'whatsapp', 'sms', 'in_app')),
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviada', 'falha')),
    mensagem TEXT,
    erro TEXT,
    lida BOOLEAN DEFAULT false,
    data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
    data_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Perfis
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    telefone TEXT,
    cargo TEXT,
    departamento TEXT,
    bio TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    whatsapp_notifications BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Roles
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Actividades
CREATE TABLE public.user_activities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Histórico de Login
CREATE TABLE public.login_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    device_info TEXT,
    location TEXT,
    login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Templates de Notificação
CREATE TABLE public.notification_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 4.1.3 Criação de Índices

```sql
-- Índices para melhor performance
CREATE INDEX idx_clientes_nome ON public.clientes(nome);
CREATE INDEX idx_clientes_ativo ON public.clientes(ativo);
CREATE INDEX idx_dividas_cliente_id ON public.dividas(cliente_id);
CREATE INDEX idx_dividas_status ON public.dividas(status);
CREATE INDEX idx_dividas_data_vencimento ON public.dividas(data_vencimento);
CREATE INDEX idx_notificacoes_divida_id ON public.notificacoes(divida_id);
CREATE INDEX idx_notificacoes_tipo ON public.notificacoes(tipo);
CREATE INDEX idx_notificacoes_lida ON public.notificacoes(lida);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_login_history_user_id ON public.login_history(user_id);
```

## 4.2 Descrição das Tabelas

### Tabela: clientes

| Coluna | Tipo | Nulo | Default | Descrição |
|--------|------|:----:|---------|-----------|
| id | UUID | N | gen_random_uuid() | Identificador único |
| nome | TEXT | N | - | Nome completo do cliente |
| nuit | TEXT | S | - | Número único de identificação tributária (9 dígitos) |
| telefone | TEXT | S | - | Número de telefone (+258XXXXXXXXX) |
| email | TEXT | S | - | Endereço de email |
| endereco | TEXT | S | - | Endereço físico completo |
| ativo | BOOLEAN | N | true | Se o cliente está activo |
| data_registro | TIMESTAMPTZ | N | now() | Data de registo no sistema |
| created_at | TIMESTAMPTZ | N | now() | Data de criação do registo |
| updated_at | TIMESTAMPTZ | N | now() | Data da última actualização |

### Tabela: dividas

| Coluna | Tipo | Nulo | Default | Descrição |
|--------|------|:----:|---------|-----------|
| id | UUID | N | gen_random_uuid() | Identificador único |
| cliente_id | UUID | N | - | FK para clientes.id |
| valor | NUMERIC | N | - | Valor da dívida (> 0) |
| descricao | TEXT | N | - | Descrição do serviço/produto |
| status | TEXT | N | 'pendente' | pendente, vencida, paga |
| data_vencimento | DATE | N | - | Data limite para pagamento |
| data_criacao | TIMESTAMPTZ | N | now() | Data de criação da dívida |
| data_pagamento | TIMESTAMPTZ | S | - | Preenchido quando paga |
| created_at | TIMESTAMPTZ | N | now() | Data de criação do registo |
| updated_at | TIMESTAMPTZ | N | now() | Data da última actualização |

### Tabela: profiles

| Coluna | Tipo | Nulo | Default | Descrição |
|--------|------|:----:|---------|-----------|
| id | UUID | N | gen_random_uuid() | Identificador único |
| user_id | UUID | N | - | FK para auth.users |
| full_name | TEXT | N | - | Nome completo |
| avatar_url | TEXT | S | - | URL da foto de perfil |
| telefone | TEXT | S | - | Telefone de contacto |
| cargo | TEXT | S | - | Cargo na empresa |
| departamento | TEXT | S | - | Departamento |
| bio | TEXT | S | - | Descrição pessoal |
| active | BOOLEAN | N | true | Se o utilizador está activo |
| email_notifications | BOOLEAN | S | true | Receber notificações por email |
| sms_notifications | BOOLEAN | S | false | Receber notificações por SMS |
| whatsapp_notifications | BOOLEAN | S | true | Receber notificações por WhatsApp |

### Tabela: user_roles

| Coluna | Tipo | Nulo | Default | Descrição |
|--------|------|:----:|---------|-----------|
| id | UUID | N | gen_random_uuid() | Identificador único |
| user_id | UUID | N | - | FK para auth.users (UNIQUE) |
| role | app_role | N | - | 'admin' ou 'user' |
| created_at | TIMESTAMPTZ | S | now() | Data de criação |

## 4.3 Políticas RLS

### Activação de RLS

```sql
-- Activar RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dividas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
```

### Políticas para Clientes

```sql
-- Utilizadores autenticados podem ver clientes
CREATE POLICY "Authenticated users can view clients"
ON public.clientes FOR SELECT
USING (auth.role() = 'authenticated');

-- Utilizadores autenticados podem inserir clientes
CREATE POLICY "Authenticated users can insert clients"
ON public.clientes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Utilizadores autenticados podem actualizar clientes
CREATE POLICY "Authenticated users can update clients"
ON public.clientes FOR UPDATE
USING (auth.role() = 'authenticated');

-- Apenas admins podem apagar clientes
CREATE POLICY "Admins can delete clients"
ON public.clientes FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
```

### Políticas para Dívidas

```sql
-- Utilizadores autenticados podem ver dívidas
CREATE POLICY "Authenticated users can view debts"
ON public.dividas FOR SELECT
USING (auth.role() = 'authenticated');

-- Utilizadores autenticados podem criar dívidas
CREATE POLICY "Authenticated users can create debts"
ON public.dividas FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Utilizadores autenticados podem actualizar dívidas
CREATE POLICY "Authenticated users can update debts"
ON public.dividas FOR UPDATE
USING (auth.role() = 'authenticated');

-- Apenas admins podem apagar dívidas
CREATE POLICY "Admins can delete debts"
ON public.dividas FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
```

### Políticas para Perfis

```sql
-- Utilizadores autenticados podem ver perfis
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Apenas admins podem criar perfis
CREATE POLICY "Admins can create profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem actualizar perfis
CREATE POLICY "Admins can update profiles"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem apagar perfis
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
```

## 4.4 Funções e Triggers

### Função: has_role (SECURITY DEFINER)

```sql
-- Função para verificar role do utilizador (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### Função: get_user_role

```sql
-- Função para obter role do utilizador
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;
```

### Função: update_updated_at_column

```sql
-- Função para actualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
```

### Função: notify_payment_completed

```sql
-- Trigger para notificar pagamento
CREATE OR REPLACE FUNCTION public.notify_payment_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_name TEXT;
  v_admin_emails TEXT[];
  v_email TEXT;
BEGIN
  IF NEW.status = 'paga' AND (OLD.status IS NULL OR OLD.status != 'paga') THEN
    SELECT nome INTO client_name FROM clientes WHERE id = NEW.cliente_id;
    
    -- Criar notificação in-app
    INSERT INTO notificacoes (
      divida_id, cliente_id, tipo, status, mensagem, data_agendamento, data_envio
    ) VALUES (
      NEW.id, NEW.cliente_id, 'in_app', 'enviada',
      '✅ Pagamento confirmado: ' || client_name || ' | Valor: ' || NEW.valor::text || ' MTn',
      NOW(), NOW()
    );

    -- Buscar emails de administradores
    SELECT ARRAY_AGG(DISTINCT p.email)
    INTO v_admin_emails
    FROM profiles p
    INNER JOIN user_roles ur ON ur.user_id = p.user_id
    WHERE ur.role = 'admin' AND p.active = true AND p.email_notifications = true;

    -- Enviar email para cada admin
    IF v_admin_emails IS NOT NULL THEN
      FOREACH v_email IN ARRAY v_admin_emails LOOP
        -- Invocar Edge Function send-email
        PERFORM net.http_post(...);
      END LOOP;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
```

### Triggers Activos

```sql
-- Trigger para actualizar updated_at
CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dividas_updated_at
BEFORE UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para notificar pagamento
CREATE TRIGGER on_debt_payment_completed
AFTER UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.notify_payment_completed();

-- Trigger para notificar dívida vencida
CREATE TRIGGER on_debt_overdue
AFTER UPDATE ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.notify_debt_overdue();

-- Trigger para notificar nova dívida
CREATE TRIGGER on_new_debt
AFTER INSERT ON public.dividas
FOR EACH ROW EXECUTE FUNCTION public.notify_new_debt();
```

---

# 5. BACKEND / LÓGICA DO SISTEMA

## 5.1 Tecnologias Utilizadas

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Supabase** | Cloud | Backend-as-a-Service |
| **PostgreSQL** | 15.x | Base de dados relacional |
| **Deno Runtime** | Latest | Execução de Edge Functions |
| **Supabase Auth** | - | Autenticação JWT |
| **Supabase Realtime** | - | WebSockets |
| **Supabase Storage** | - | Armazenamento de ficheiros |
| **Resend** | API v1 | Envio de emails transaccionais |

## 5.2 APIs e Endpoints

### 5.2.1 Supabase REST API

O sistema utiliza a API REST gerada automaticamente pelo Supabase.

**Base URL:** `https://vmgrnkuhprxowcvydnvm.supabase.co/rest/v1`

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|:----:|
| GET | /clientes | Listar clientes | ✅ |
| POST | /clientes | Criar cliente | ✅ |
| PATCH | /clientes?id=eq.{id} | Actualizar cliente | ✅ |
| DELETE | /clientes?id=eq.{id} | Apagar cliente | ✅ Admin |
| GET | /dividas | Listar dívidas | ✅ |
| POST | /dividas | Criar dívida | ✅ |
| PATCH | /dividas?id=eq.{id} | Actualizar dívida | ✅ |
| DELETE | /dividas?id=eq.{id} | Apagar dívida | ✅ Admin |
| GET | /notificacoes | Listar notificações | ✅ |
| GET | /profiles | Listar perfis | ✅ |

### 5.2.2 Edge Functions

**Base URL:** `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1`

#### send-email

**Método:** POST  
**Auth:** Não requer JWT

**Request:**
```json
{
  "to": "cliente@email.com",
  "subject": "Lembrete de Dívida",
  "message": "Corpo do email em texto"
}
```

**Response (200):**
```json
{
  "success": true,
  "id": "resend_email_id"
}
```

**Response (400/500):**
```json
{
  "error": "Descrição do erro"
}
```

#### check-debts

**Método:** POST  
**Auth:** Service Role Key

**Descrição:** Verifica dívidas a vencer em 1 dia e actualiza status de dívidas vencidas.

**Response (200):**
```json
{
  "success": true,
  "reminders_sent": 5,
  "status_updated": 3
}
```

#### log-login

**Método:** POST  
**Auth:** Não requer JWT

**Request:**
```json
{
  "userId": "uuid",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

#### create-user

**Método:** POST  
**Auth:** JWT (Admin apenas)

**Request:**
```json
{
  "email": "novo@email.com",
  "password": "senha123",
  "full_name": "Nome Completo",
  "role": "user"
}
```

## 5.3 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente (Browser)
    participant A as Supabase Auth
    participant DB as PostgreSQL
    participant App as React App
    
    C->>A: signInWithPassword(email, senha)
    A->>A: Validar credenciais
    
    alt Credenciais Válidas
        A->>A: Gerar JWT Token
        A-->>C: {access_token, refresh_token, user}
        C->>App: Armazenar tokens
        App->>DB: SELECT * FROM profiles WHERE user_id = ?
        DB-->>App: Dados do perfil
        App->>DB: SELECT role FROM user_roles WHERE user_id = ?
        DB-->>App: Role do utilizador
        App->>App: Definir estado global
        App->>C: Redirecionar para Dashboard
    else Credenciais Inválidas
        A-->>C: Error: Invalid login credentials
        C->>C: Mostrar mensagem de erro
    end
    
    Note over C,App: Requests subsequentes incluem JWT no header
    
    C->>DB: GET /dividas (Authorization: Bearer {token})
    DB->>DB: Verificar JWT
    DB->>DB: Aplicar RLS policies
    DB-->>C: Dados filtrados por RLS
```

### Tokens JWT

| Campo | Descrição |
|-------|-----------|
| iss | Emissor: supabase |
| ref | Project reference |
| role | 'anon' ou 'authenticated' |
| iat | Timestamp de emissão |
| exp | Timestamp de expiração (1 hora) |

### Refresh Token

- **Validade:** 30 dias (configurável)
- **Renovação:** Automática pelo SDK
- **Armazenamento:** localStorage ou sessionStorage

## 5.4 Edge Functions

### Estrutura de uma Edge Function

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, message } = await req.json();
    
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const { data, error } = await resend.emails.send({
      from: 'Ncangaza <noreply@ncangaza.co.mz>',
      to: [to],
      subject: subject,
      text: message,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Configuração (supabase/config.toml)

```toml
[functions.send-email]
verify_jwt = false

[functions.check-debts]
verify_jwt = true

[functions.log-login]
verify_jwt = false

[functions.create-user]
verify_jwt = true

[functions.create-admin]
verify_jwt = false
```

---

# 6. FRONTEND

## 6.1 Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Biblioteca de UI |
| **TypeScript** | 5.8.3 | Tipagem estática |
| **Vite** | 5.4.19 | Build tool |
| **TailwindCSS** | 3.4.17 | Framework CSS |
| **shadcn/ui** | - | Componentes UI |
| **React Router** | 6.30.1 | Navegação SPA |
| **React Query** | 5.83.0 | Cache e estado servidor |
| **React Hook Form** | 7.61.1 | Gestão de formulários |
| **Zod** | 3.25.76 | Validação de schemas |
| **Recharts** | 3.1.2 | Gráficos |
| **Lucide React** | 0.462.0 | Ícones |
| **date-fns** | 3.6.0 | Manipulação de datas |
| **jsPDF** | 3.0.3 | Geração de PDFs |
| **Sonner** | 1.7.4 | Notificações toast |

## 6.2 Estrutura de Pastas

```
src/
├── assets/                     # Recursos estáticos
│   ├── logo-ncangaza.png
│   ├── logo-ncangaza-full.png
│   └── logo-ncangaza-hq.png
│
├── components/                 # Componentes React
│   ├── admin/                  # Administração
│   │   └── UserManagement.tsx  # Gestão de utilizadores
│   │
│   ├── analytics/              # Análises
│   │   ├── Analytics.tsx       # Componente mock
│   │   └── AnalyticsReal.tsx   # Componente real
│   │
│   ├── clients/                # Clientes
│   │   └── ClientsTable.tsx    # Tabela de clientes
│   │
│   ├── dashboard/              # Dashboard
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── DebtChart.tsx       # Gráfico de dívidas
│   │   ├── RecentDebts.tsx     # Dívidas recentes
│   │   └── StatsCards.tsx      # Cards de estatísticas
│   │
│   ├── debts/                  # Dívidas
│   │   ├── DebtActions.tsx     # Acções de dívida
│   │   └── DebtsTable.tsx      # Tabela de dívidas
│   │
│   ├── forms/                  # Formulários
│   │   ├── ClientForm.tsx      # Form de cliente
│   │   └── DebtForm.tsx        # Form de dívida
│   │
│   ├── layout/                 # Layout
│   │   ├── Header.tsx          # Cabeçalho
│   │   ├── MainLayout.tsx      # Layout principal
│   │   └── Sidebar.tsx         # Menu lateral
│   │
│   ├── notifications/          # Notificações
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── NotificationList.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── NotificationTemplates.tsx
│   │   ├── Notifications.tsx
│   │   └── NotificationsReal.tsx
│   │
│   ├── profile/                # Perfil
│   │   ├── ActivityLog.tsx
│   │   ├── NotificationPreferences.tsx
│   │   ├── PasswordChange.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileHeader.tsx
│   │   └── SecuritySettings.tsx
│   │
│   ├── reports/                # Relatórios
│   │   ├── Reports.tsx
│   │   └── ReportsReal.tsx
│   │
│   ├── settings/               # Configurações
│   │   └── Settings.tsx
│   │
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (50+ componentes)
│   │
│   └── ProtectedRoute.tsx      # Rota protegida
│
├── contexts/                   # Contextos React
│   ├── AuthContext.tsx         # Autenticação
│   └── ThemeContext.tsx        # Tema dark/light
│
├── hooks/                      # Custom Hooks
│   ├── use-mobile.tsx          # Detectar mobile
│   ├── use-toast.ts            # Notificações
│   ├── useClients.ts           # CRUD clientes
│   ├── useDebts.ts             # CRUD dívidas
│   ├── useLogo.ts              # Logo da empresa
│   ├── useNotifications.ts     # Notificações
│   ├── usePopularDadosAutomatico.ts
│   ├── useSettings.ts          # Configurações
│   └── useStats.ts             # Estatísticas
│
├── integrations/               # Integrações
│   └── supabase/
│       ├── client.ts           # Cliente Supabase
│       └── types.ts            # Tipos auto-gerados
│
├── lib/                        # Utilitários
│   ├── utils.ts                # Funções auxiliares
│   └── validations.ts          # Validações
│
├── pages/                      # Páginas
│   ├── Index.tsx               # Página principal
│   ├── Login.tsx               # Página de login
│   └── NotFound.tsx            # Página 404
│
├── utils/                      # Utilitários
│   ├── currency.ts             # Formatação moeda
│   ├── htmlToPdfGenerator.ts   # Geração PDF
│   ├── notifications.ts        # Lógica notificações
│   └── pdfGenerator.ts         # PDF com jsPDF
│
├── App.tsx                     # Componente raiz
├── App.css                     # Estilos globais
├── index.css                   # Design system Tailwind
├── main.tsx                    # Entry point
└── vite-env.d.ts               # Tipos Vite
```

## 6.3 Componentes Principais

### Dashboard (Dashboard.tsx)

**Responsabilidade:** Apresentar visão geral do sistema com estatísticas e gráficos.

**Componentes Filhos:**
- `StatsCards` - Cards com métricas principais
- `DebtChart` - Gráfico de evolução de dívidas
- `RecentDebts` - Lista das últimas dívidas

### ClientsTable (ClientsTable.tsx)

**Responsabilidade:** Listar, pesquisar, criar, editar e apagar clientes.

**Funcionalidades:**
- Tabela paginada com pesquisa
- Modal de criação/edição
- Confirmação de desactivação
- Indicadores de status (activo/inactivo)

### DebtsTable (DebtsTable.tsx)

**Responsabilidade:** Gerir dívidas com filtros e acções rápidas.

**Funcionalidades:**
- Filtros por status (pendente, vencida, paga)
- Acções: editar, pagar, notificar
- Indicadores visuais por status
- Integração com WhatsApp, Email, Chamadas

### NotificationCenter (NotificationCenter.tsx)

**Responsabilidade:** Centro de notificações do sistema.

**Funcionalidades:**
- Lista de notificações não lidas
- Marcar como lida
- Filtrar por tipo
- Badge com contador

## 6.4 Hooks Personalizados

### useClients

```typescript
// Gestão completa de clientes
const {
  clients,           // Lista de clientes
  loading,           // Estado de carregamento
  createClient,      // Criar novo cliente
  updateClient,      // Actualizar cliente
  deleteClient,      // Apagar cliente
  refetch,           // Recarregar dados
} = useClients();
```

### useDebts

```typescript
// Gestão completa de dívidas
const {
  debts,             // Lista de dívidas
  loading,           // Estado de carregamento
  createDebt,        // Criar nova dívida
  updateDebt,        // Actualizar dívida
  deleteDebt,        // Apagar dívida
  markAsPaid,        // Marcar como paga
  refetch,           // Recarregar dados
} = useDebts();
```

### useStats

```typescript
// Estatísticas do dashboard
const {
  totalClientes,     // Total de clientes
  totalDividas,      // Total de dívidas
  valorTotal,        // Valor total
  valorPendente,     // Valor pendente
  valorVencido,      // Valor vencido
  valorPago,         // Valor pago
  loading,           // Estado de carregamento
} = useStats();
```

---

# 7. INTERFACE DO SISTEMA

## 7.1 Tela de Login

**URL:** `/login`

**Elementos:**
- Logo da empresa
- Campo de email
- Campo de senha
- Checkbox "Lembrar-me"
- Botão "Entrar no Sistema"
- Link para recuperação de senha

**Validações:**
- Email: formato válido
- Senha: mínimo 8 caracteres

**Feedback:**
- Toast de erro para credenciais inválidas
- Toast de sucesso ao fazer login
- Redirecionamento automático para Dashboard

## 7.2 Dashboard

**URL:** `/` (rota principal)

**Elementos:**
- Cards de estatísticas (6 cards)
  - Total de Clientes
  - Total de Dívidas
  - Valor Total
  - Dívidas Pendentes
  - Dívidas Vencidas
  - Dívidas Pagas
- Gráfico de evolução (últimos 6 meses)
- Lista de dívidas recentes (5 últimas)

**Actualização:** Real-time via WebSocket

## 7.3 Gestão de Clientes

**URL:** `/clientes`

**Elementos:**
- Barra de pesquisa
- Botão "Novo Cliente"
- Tabela com colunas:
  - Nome
  - NUIT
  - Telefone
  - Email
  - Status
  - Acções

**Acções Disponíveis:**
- ✏️ Editar
- 🔄 Activar/Desactivar
- 🗑️ Apagar (admin)

## 7.4 Gestão de Dívidas

**URL:** `/dividas`

**Elementos:**
- Filtros por status
- Botão "Nova Dívida"
- Tabela com colunas:
  - Cliente
  - Descrição
  - Valor
  - Vencimento
  - Status
  - Acções

**Acções Disponíveis:**
- ✏️ Editar
- ✓ Pagar
- 📱 WhatsApp
- ✉️ Email
- 📞 Ligar

## 7.5 Notificações

**URL:** Dropdown no header

**Elementos:**
- Badge com contador
- Lista de notificações
- Botão "Marcar todas como lidas"
- Filtros por tipo

**Tipos de Notificação:**
- 🔵 Sistema
- 🟢 Pagamentos
- 🔴 Alertas
- 🟡 Clientes

## 7.6 Relatórios

**URL:** `/relatorios`

**Elementos:**
- Selector de período
- Selector de tipo de relatório
- Selector de status
- Selector de formato (PDF, CSV, TXT)
- Botão "Gerar Relatório"
- Pré-visualização

**Tipos de Relatório:**
- Relatório Mensal
- Análise de Clientes
- Relatório por Status
- Relatório Executivo

---

# 8. SEGURANÇA

## 8.1 Row Level Security (RLS)

O sistema implementa RLS em todas as tabelas para garantir que os utilizadores apenas acedem aos dados permitidos.

### Princípios de Segurança

1. **Deny by Default:** Sem políticas, nenhum acesso é permitido
2. **Least Privilege:** Utilizadores têm o mínimo de permissões necessárias
3. **Role-Based Access:** Permissões baseadas em roles (admin/user)
4. **Security Definer:** Funções privilegiadas para evitar recursão

### Matriz de Permissões

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|:------:|:------:|:------:|:------:|
| clientes | Auth | Auth | Auth | Admin |
| dividas | Auth | Auth | Auth | Admin |
| notificacoes | Auth | System | System | Admin |
| profiles | Auth | Admin | Admin | Admin |
| user_roles | Self/Admin | Admin | Admin | Admin |
| user_activities | Self | Self | ❌ | ❌ |
| notification_templates | Admin | Admin | Admin | Admin |

## 8.2 Autenticação

### Mecanismos Implementados

| Mecanismo | Implementação |
|-----------|---------------|
| **Login** | Email + Password via Supabase Auth |
| **Tokens** | JWT com expiração de 1 hora |
| **Refresh** | Token com validade de 30 dias |
| **Sessão** | Persistência em localStorage |
| **Logout** | Invalidação de tokens |

### Fluxo de Segurança

1. Utilizador submete credenciais
2. Supabase Auth valida e gera JWT
3. JWT armazenado no cliente
4. Cada request inclui JWT no header
5. Backend valida JWT antes de processar
6. RLS aplica filtros baseados no utilizador

## 8.3 Gestão de Permissões

### Roles Disponíveis

| Role | Descrição | Permissões |
|------|-----------|------------|
| **admin** | Administrador do sistema | Acesso total a todas as funcionalidades |
| **user** | Utilizador comum | Acesso limitado (sem apagar, sem gestão de utilizadores) |

### Verificação de Role

```typescript
// No frontend (AuthContext)
const isAdmin = role === 'admin';

// No backend (SQL)
CREATE POLICY "Admins only"
ON public.table
USING (public.has_role(auth.uid(), 'admin'));
```

## 8.4 Logs e Auditoria

### Dados Registados

| Evento | Tabela | Dados |
|--------|--------|-------|
| Login | login_history | user_id, ip, user_agent, timestamp |
| Acções CRUD | user_activities | user_id, action_type, description, metadata |
| Notificações | notificacoes | tipo, status, data_envio, erro |

### Retenção de Dados

- **Login History:** 90 dias
- **User Activities:** 180 dias
- **Notificações:** Indefinido

---

# 9. TESTES

## 9.1 Estratégia de Testes

O sistema utiliza uma abordagem de testes manuais abrangentes, com foco em:

| Tipo | Cobertura | Método |
|------|-----------|--------|
| **Funcional** | Alta | Teste manual de fluxos |
| **UI/UX** | Alta | Teste visual e interacção |
| **Integração** | Média | Teste de APIs |
| **Segurança** | Média | Teste de RLS e autenticação |
| **Performance** | Baixa | Teste de carregamento |

## 9.2 Testes Manuais

### Checklist de Testes - Login

- [ ] Login com credenciais válidas
- [ ] Login com email inválido
- [ ] Login com senha incorrecta
- [ ] Login com conta inactiva
- [ ] Logout funcional
- [ ] Sessão persistente (lembrar-me)
- [ ] Redirecionamento após login

### Checklist de Testes - Clientes

- [ ] Criar cliente com dados completos
- [ ] Criar cliente com dados mínimos (só nome)
- [ ] Editar cliente existente
- [ ] Desactivar cliente
- [ ] Reactivar cliente
- [ ] Apagar cliente (admin)
- [ ] Pesquisa de cliente
- [ ] Paginação funcional

### Checklist de Testes - Dívidas

- [ ] Criar dívida com todos os campos
- [ ] Validação de valor > 0
- [ ] Validação de data futura
- [ ] Marcar dívida como paga
- [ ] Editar dívida existente
- [ ] Filtrar por status
- [ ] Ordenar por data/valor
- [ ] Enviar notificação WhatsApp
- [ ] Enviar notificação Email

## 9.3 Validações do Sistema

### Validações de Formulário

| Campo | Regra | Mensagem |
|-------|-------|----------|
| Nome Cliente | Obrigatório | "Nome é obrigatório" |
| Email | Formato válido | "Email inválido" |
| NUIT | 9 dígitos | "NUIT deve ter 9 dígitos" |
| Telefone | Formato internacional | "Formato: +258XXXXXXXXX" |
| Valor Dívida | > 0 | "Valor deve ser maior que zero" |
| Data Vencimento | Futura | "Data deve ser futura" |
| Descrição | Obrigatória | "Descrição é obrigatória" |

---

# 10. DEPLOYMENT

## 10.1 Hospedagem

| Componente | Serviço | URL |
|------------|---------|-----|
| **Frontend** | Vercel | https://ncangaza.vercel.app |
| **Backend** | Supabase Cloud | https://vmgrnkuhprxowcvydnvm.supabase.co |
| **Base de Dados** | Supabase PostgreSQL | db.vmgrnkuhprxowcvydnvm.supabase.co |
| **Edge Functions** | Supabase Functions | /functions/v1/* |
| **Storage** | Supabase Storage | /storage/v1/* |

## 10.2 Processo de Deploy

### Frontend (Vercel)

```bash
# Deploy automático via GitHub
git push origin main

# Deploy manual
vercel --prod
```

**Configuração Vercel:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18.x

### Edge Functions (Supabase)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projecto
supabase link --project-ref vmgrnkuhprxowcvydnvm

# Deploy todas as funções
supabase functions deploy

# Deploy função específica
supabase functions deploy send-email
```

## 10.3 Variáveis de Ambiente

### Frontend (.env)

```env
VITE_SUPABASE_PROJECT_ID="vmgrnkuhprxowcvydnvm"
VITE_SUPABASE_URL="https://vmgrnkuhprxowcvydnvm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Backend (Supabase Secrets)

```env
SUPABASE_URL="https://vmgrnkuhprxowcvydnvm.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.vmgrnkuhprxowcvydnvm.supabase.co:5432/postgres"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

## 10.4 Backup e Failover

### Backup de Base de Dados

| Tipo | Frequência | Retenção |
|------|------------|----------|
| **Point-in-Time Recovery** | Contínuo | 7 dias |
| **Daily Backup** | Diário às 02:00 UTC | 30 dias |
| **Weekly Backup** | Domingo às 03:00 UTC | 90 dias |

### Procedimento de Restauro

```bash
# Via Supabase Dashboard
# Project Settings → Database → Backups → Restore

# Via CLI (export manual)
pg_dump -h db.vmgrnkuhprxowcvydnvm.supabase.co \
        -U postgres \
        -d postgres \
        -f backup_$(date +%Y%m%d).sql
```

---

# 11. MANUTENÇÃO

## 11.1 Tarefas Diárias

| Tarefa | Hora | Automático |
|--------|------|:----------:|
| Verificar dívidas a vencer | 00:00 UTC | ✅ |
| Actualizar status de dívidas | 00:00 UTC | ✅ |
| Enviar lembretes de vencimento | 00:01 UTC | ✅ |
| Monitorizar logs de erro | Manual | ❌ |

## 11.2 Tarefas Semanais

| Tarefa | Dia | Automático |
|--------|-----|:----------:|
| Verificar quotas de uso | Segunda | ❌ |
| Analisar métricas de performance | Segunda | ❌ |
| Limpar logs antigos | Domingo | ✅ |
| Verificar integridade de dados | Domingo | ❌ |

## 11.3 Backup

### Backup Manual da Base de Dados

```sql
-- Exportar dados via SQL Editor
COPY (SELECT * FROM clientes) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM dividas) TO STDOUT WITH CSV HEADER;
```

### Backup via Dashboard

1. Aceder a Project Settings → Database → Backups
2. Clicar em "Download backup"
3. Armazenar em local seguro

## 11.4 Monitorização de Logs

### Logs de Edge Functions

```bash
# Via CLI
supabase functions logs send-email --tail

# Via Dashboard
# https://supabase.com/dashboard/project/vmgrnkuhprxowcvydnvm/functions/send-email/logs
```

### Logs de Base de Dados

```sql
-- Consultar logs recentes
SELECT * FROM postgres_logs
ORDER BY timestamp DESC
LIMIT 100;
```

### Métricas Importantes

| Métrica | Threshold | Acção |
|---------|-----------|-------|
| Tempo de resposta API | > 2s | Investigar |
| Taxa de erro | > 1% | Investigar |
| Uso de disco | > 80% | Expandir |
| Conexões activas | > 50 | Optimizar |

---

# 12. MANUAL DE INSTALAÇÃO

## 12.1 Requisitos do Sistema

### Hardware Mínimo

- **CPU:** Dual-core 2.0 GHz
- **RAM:** 4 GB (8 GB recomendado)
- **Disco:** 500 MB livres
- **Internet:** 2 Mbps mínimo

### Software

- **Node.js:** 18.0.0+
- **npm:** 9.0.0+
- **Git:** Qualquer versão recente
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

## 12.2 Instalação Local

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/seu-usuario/ncangaza-debt-management.git
cd ncangaza-debt-management
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Editar .env com as credenciais do Supabase
```

### Passo 4: Executar em Desenvolvimento

```bash
npm run dev
# Aceder: http://localhost:8080
```

### Passo 5: Build de Produção

```bash
npm run build
npm run preview
```

## 12.3 Configuração do Supabase

### Criar Projecto

1. Aceder a https://supabase.com
2. Criar novo projecto
3. Copiar credenciais (URL, anon key)

### Executar Migrações

1. Aceder ao SQL Editor
2. Executar scripts SQL da secção 4.1
3. Verificar criação de tabelas

### Configurar Autenticação

1. Authentication → Providers → Enable Email
2. URL Configuration → Site URL
3. Email Templates (opcional)

---

# 13. MANUAL DO UTILIZADOR

## 13.1 Perfis do Sistema

### Administrador

**Permissões Completas:**
- ✅ Gerir utilizadores
- ✅ Gerir clientes (CRUD completo)
- ✅ Gerir dívidas (CRUD completo)
- ✅ Apagar registos
- ✅ Configurar templates
- ✅ Ver análises avançadas
- ✅ Gerar todos os relatórios

### Utilizador

**Permissões Limitadas:**
- ✅ Gerir clientes (criar, ver, editar)
- ✅ Gerir dívidas (criar, ver, editar, pagar)
- ✅ Ver notificações
- ✅ Gerar relatórios básicos
- ❌ Apagar registos
- ❌ Gerir utilizadores
- ❌ Configurar sistema

## 13.2 Guia de Utilização

### Login

1. Aceder ao URL do sistema
2. Inserir email e senha
3. Clicar em "Entrar no Sistema"
4. Ser redirecionado para o Dashboard

### Criar Cliente

1. Menu lateral → Clientes
2. Clicar "Novo Cliente"
3. Preencher formulário
4. Clicar "Registar Cliente"

### Criar Dívida

1. Menu lateral → Dívidas
2. Clicar "Nova Dívida"
3. Seleccionar cliente
4. Preencher valor, descrição, data
5. Clicar "Registar Dívida"

### Marcar Pagamento

1. Na tabela de dívidas, localizar a dívida
2. Clicar no botão "✓ Pagar"
3. Confirmar no modal
4. Sistema regista pagamento automaticamente

### Gerar Relatório

1. Menu lateral → Relatórios
2. Seleccionar período
3. Seleccionar tipo de relatório
4. Seleccionar formato (PDF/CSV/TXT)
5. Clicar "Gerar Relatório"

## 13.3 Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| "Email ou senha incorretos" | Credenciais inválidas | Verificar dados |
| "Acesso negado" | Sem permissão | Contactar admin |
| "Sessão expirada" | Token expirou | Fazer login novamente |
| "Erro ao carregar dados" | Conexão | Verificar internet |
| "Não é possível apagar" | Dependências | Verificar dívidas associadas |

---

# CONCLUSÃO

Esta documentação técnica fornece uma visão completa do **Sistema de Gestão de Dívidas da Ncangaza Multiservices**, cobrindo:

✅ Arquitectura completa do sistema  
✅ Diagramas de fluxo, casos de uso e ERD  
✅ Scripts SQL e estrutura da base de dados  
✅ Políticas de segurança (RLS)  
✅ Documentação de APIs e Edge Functions  
✅ Estrutura do frontend e componentes  
✅ Procedimentos de deployment e manutenção  
✅ Manuais de instalação e utilização  

---

**Autor:** Nilton Ramim Pita  
**Instituição:** Universidade Católica de Moçambique (UCM)  
**Versão:** 1.0.0  
**Data:** 2025  
**Empresa:** Ncangaza Multiservices Lda.
