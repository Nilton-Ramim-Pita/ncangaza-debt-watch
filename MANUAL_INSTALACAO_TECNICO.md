# Manual Técnico de Instalação
## Sistema Web de Gestão de Dívidas com Notificações Automáticas

**Autor:** Nilton Ramim Pita  
**Instituição:** Universidade Católica de Moçambique (UCM)  
**Data:** 2025

---

## PARTE 1 — INFORMAÇÕES DO PROJETO

### 1.1 Nome do Sistema
**Sistema Web de Gestão de Dívidas com Notificações Automáticas**

### 1.2 Finalidade do Sistema
Sistema desenvolvido para automatizar o processo de gestão de dívidas de clientes, incluindo:
- Cadastro e gestão de clientes
- Registro e acompanhamento de dívidas
- Notificações automáticas por email
- Geração de relatórios em PDF e CSV
- Dashboard com estatísticas em tempo real
- Sistema de autenticação com perfis (Admin/Utilizador)
- Histórico de atividades dos utilizadores

### 1.3 Tecnologias Principais

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.3.1 | Framework Frontend |
| TypeScript | 5.x | Linguagem de Programação |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 3.x | Estilização |
| Shadcn UI | Latest | Componentes UI |
| Supabase | 2.57.4 | Backend-as-a-Service |
| Supabase Auth | Latest | Autenticação |
| Supabase Database | PostgreSQL 15 | Base de Dados |
| Supabase Realtime | Latest | Atualizações em Tempo Real |
| Supabase Edge Functions | Deno | Funções Serverless |
| Resend API | 2.0.0 | Envio de Emails |
| TanStack Query | 5.83.0 | Gestão de Estado e Cache |
| React Hook Form | 7.61.1 | Gestão de Formulários |
| Zod | 3.25.76 | Validação de Dados |
| Recharts | 3.1.2 | Gráficos e Visualizações |
| jsPDF | 3.0.3 | Geração de PDFs |
| jsPDF AutoTable | 5.0.2 | Tabelas em PDF |
| Mermaid | 11.12.1 | Diagramas |
| html2pdf.js | 0.12.1 | Conversão HTML para PDF |
| Lucide React | 0.462.0 | Ícones |
| date-fns | 3.6.0 | Manipulação de Datas |
| Sonner | 1.7.4 | Notificações Toast |

### 1.4 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│              (React + TypeScript + Vite)                 │
│                 Hospedado na Vercel                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS/WSS
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   SUPABASE BACKEND                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                               │ │
│  │  - Tabelas: clientes, dividas, notificacoes, etc  │ │
│  │  - RLS Policies (Segurança)                       │ │
│  │  - Triggers e Functions                           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Supabase Auth                                     │ │
│  │  - JWT Token Authentication                       │ │
│  │  - Email/Password Authentication                  │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Supabase Realtime                                 │ │
│  │  - WebSocket para updates em tempo real           │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Edge Functions (Deno Runtime)                     │ │
│  │  - send-email                                      │ │
│  │  - check-debts                                     │ │
│  │  - create-user                                     │ │
│  │  - log-login                                       │ │
│  │  - popular-dados-teste                            │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Storage                                           │ │
│  │  - Bucket: avatars (público)                      │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTPS API
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    RESEND API                            │
│              (Serviço de Envio de Email)                 │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 2 — REQUISITOS DO SISTEMA

### 2.1 Sistema Operacional Recomendado
- **Windows:** Windows 10 ou superior (64-bit)
- **macOS:** macOS 10.15 Catalina ou superior
- **Linux:** Ubuntu 20.04 LTS ou superior

### 2.2 Requisitos Mínimos de Hardware
- **Processador:** Intel Core i3 ou equivalente (mínimo 2.0 GHz)
- **Memória RAM:** 4 GB (recomendado 8 GB)
- **Armazenamento:** 500 MB de espaço livre
- **Conexão à Internet:** Obrigatória (mínimo 5 Mbps)

### 2.3 Software Necessário

#### Node.js e NPM
```bash
# Versão obrigatória
Node.js: v18.x ou v20.x (LTS)
NPM: v9.x ou superior (incluído com Node.js)
```

**Download:** https://nodejs.org/

#### Git
```bash
# Versão mínima
Git: v2.30 ou superior
```

**Download:** https://git-scm.com/

#### Editor de Código
**Visual Studio Code** (recomendado)
- **Versão:** 1.80 ou superior
- **Download:** https://code.visualstudio.com/

#### Extensões Obrigatórias do VS Code
1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
5. **TypeScript** (já incluído)

#### Navegador Web
- **Google Chrome** 100+ ou **Microsoft Edge** 100+ (recomendado)
- **Mozilla Firefox** 100+
- **Safari** 15+ (macOS)

---

## PARTE 3 — ESTRUTURA DO PROJETO

### 3.1 Estrutura de Pastas do Frontend

```
ncangaza-debt-system/
│
├── public/                          # Arquivos estáticos públicos
│   ├── popular-dados.js            # Script de população de dados
│   └── robots.txt                  # Configuração para crawlers
│
├── src/                            # Código-fonte principal
│   ├── assets/                     # Recursos estáticos
│   │   ├── logo-ncangaza.png
│   │   ├── logo-ncangaza.jpg
│   │   ├── logo-ncangaza-hq.png
│   │   └── logo-ncangaza-full.png
│   │
│   ├── components/                 # Componentes React
│   │   ├── admin/
│   │   │   └── UserManagement.tsx
│   │   ├── analytics/
│   │   │   ├── Analytics.tsx
│   │   │   └── AnalyticsReal.tsx
│   │   ├── clients/
│   │   │   └── ClientsTable.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DebtChart.tsx
│   │   │   ├── RecentDebts.tsx
│   │   │   └── StatsCards.tsx
│   │   ├── debts/
│   │   │   ├── DebtActions.tsx
│   │   │   └── DebtsTable.tsx
│   │   ├── documentation/
│   │   │   ├── DocumentacaoTecnica.tsx
│   │   │   └── documentation-styles.css
│   │   ├── forms/
│   │   │   ├── ClientForm.tsx
│   │   │   └── DebtForm.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   ├── NotificationTemplates.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── NotificationsReal.tsx
│   │   ├── profile/
│   │   │   ├── ActivityLog.tsx
│   │   │   ├── NotificationPreferences.tsx
│   │   │   ├── PasswordChange.tsx
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   └── SecuritySettings.tsx
│   │   ├── reports/
│   │   │   ├── Reports.tsx
│   │   │   └── ReportsReal.tsx
│   │   ├── settings/
│   │   │   └── Settings.tsx
│   │   ├── ui/                     # Componentes Shadcn UI
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── use-toast.ts
│   │   └── ProtectedRoute.tsx
│   │
│   ├── contexts/                   # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/                      # Custom Hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useClients.ts
│   │   ├── useDebts.ts
│   │   ├── useLogo.ts
│   │   ├── useNotifications.ts
│   │   ├── usePopularDadosAutomatico.ts
│   │   ├── useSettings.ts
│   │   └── useStats.ts
│   │
│   ├── integrations/               # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts           # Tipos gerados automaticamente
│   │
│   ├── lib/                        # Utilitários
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   ├── pages/                      # Páginas da aplicação
│   │   ├── DocumentacaoPage.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   │
│   ├── utils/                      # Funções utilitárias
│   │   ├── currency.ts
│   │   ├── notifications.ts
│   │   └── pdfGenerator.ts
│   │
│   ├── App.css                     # Estilos globais
│   ├── App.tsx                     # Componente raiz
│   ├── index.css                   # Estilos base Tailwind
│   ├── main.tsx                    # Entry point
│   ├── vite-env.d.ts              # Tipos Vite
│   └── vite-env-md.d.ts           # Tipos Markdown
│
├── supabase/                       # Configuração Supabase
│   ├── config.toml                # Configuração do projeto
│   ├── functions/                 # Edge Functions
│   │   ├── check-debts/
│   │   │   └── index.ts
│   │   ├── create-admin/
│   │   │   └── index.ts
│   │   ├── create-demo-users/
│   │   │   └── index.ts
│   │   ├── create-user/
│   │   │   └── index.ts
│   │   ├── log-login/
│   │   │   └── index.ts
│   │   ├── popular-dados-teste/
│   │   │   └── index.ts
│   │   └── send-email/
│   │       └── index.ts
│   └── migrations/                # Migrações SQL
│       └── (arquivos de migração)
│
├── .env                           # Variáveis de ambiente (não versionado)
├── .gitignore                     # Arquivos ignorados pelo Git
├── components.json                # Configuração Shadcn
├── eslint.config.js              # Configuração ESLint
├── index.html                    # HTML base
├── package.json                  # Dependências do projeto
├── package-lock.json             # Lock de dependências
├── postcss.config.js             # Configuração PostCSS
├── tailwind.config.ts            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
├── tsconfig.app.json             # Config TypeScript (app)
├── tsconfig.node.json            # Config TypeScript (node)
├── vite.config.ts                # Configuração Vite
├── README.md                     # Documentação do projeto
└── DOCUMENTACAO_TECNICA_COMPLETA.md  # Documentação técnica
```

### 3.2 Estrutura das Edge Functions

Cada Edge Function segue a estrutura:

```
supabase/functions/{nome-funcao}/
└── index.ts                      # Código principal da função
```

**Edge Functions Implementadas:**

1. **send-email** - Envio de emails via Resend API
2. **check-debts** - Verificação automática de dívidas vencidas
3. **create-user** - Criação de novos utilizadores (admin)
4. **create-admin** - Criação do primeiro administrador
5. **create-demo-users** - Criação de utilizadores de demonstração
6. **log-login** - Registro de histórico de logins
7. **popular-dados-teste** - População de dados de teste

### 3.3 Estrutura da Base de Dados Supabase

#### Tabelas Principais

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENTES                           │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ nome (text, NOT NULL)                                   │
│ email (text)                                            │
│ telefone (text)                                         │
│ nuit (text)                                             │
│ endereco (text)                                         │
│ ativo (boolean, DEFAULT true)                          │
│ data_registro (timestamptz, DEFAULT now())             │
│ created_at (timestamptz, DEFAULT now())                │
│ updated_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘
                           │
                           │ 1:N
                           │
┌──────────────────────────▼──────────────────────────────┐
│                       DIVIDAS                            │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ cliente_id (uuid, FK -> clientes.id)                   │
│ valor (numeric, NOT NULL)                               │
│ descricao (text, NOT NULL)                              │
│ status (text, DEFAULT 'pendente')                      │
│ data_criacao (timestamptz, DEFAULT now())              │
│ data_vencimento (date, NOT NULL)                       │
│ data_pagamento (timestamptz)                           │
│ created_at (timestamptz, DEFAULT now())                │
│ updated_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘
                           │
                           │ 1:N
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    NOTIFICACOES                          │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ divida_id (uuid, FK -> dividas.id)                     │
│ cliente_id (uuid, FK -> clientes.id)                   │
│ tipo (text, NOT NULL) [email, in_app, sms]            │
│ status (text, DEFAULT 'pendente')                      │
│ mensagem (text)                                         │
│ data_agendamento (timestamptz, NOT NULL)               │
│ data_envio (timestamptz)                               │
│ erro (text)                                             │
│ lida (boolean, DEFAULT false)                          │
│ created_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      PROFILES                            │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ user_id (uuid, FK -> auth.users, UNIQUE)              │
│ full_name (text, NOT NULL)                              │
│ email (text)                                            │
│ avatar_url (text)                                       │
│ telefone (text)                                         │
│ cargo (text)                                            │
│ departamento (text)                                     │
│ bio (text)                                              │
│ email_notifications (boolean, DEFAULT true)            │
│ whatsapp_notifications (boolean, DEFAULT true)         │
│ sms_notifications (boolean, DEFAULT false)             │
│ active (boolean, DEFAULT true)                         │
│ created_by (uuid)                                       │
│ created_at (timestamptz, DEFAULT now())                │
│ updated_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     USER_ROLES                           │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ user_id (uuid, NOT NULL)                                │
│ role (app_role, NOT NULL) [admin, user]               │
│ created_at (timestamptz, DEFAULT now())                │
│ UNIQUE(user_id, role)                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  USER_ACTIVITIES                         │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ user_id (uuid, NOT NULL)                                │
│ action_type (text, NOT NULL)                            │
│ description (text, NOT NULL)                            │
│ metadata (jsonb)                                        │
│ created_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   LOGIN_HISTORY                          │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ user_id (uuid, NOT NULL)                                │
│ login_at (timestamptz, DEFAULT now())                  │
│ ip_address (text)                                       │
│ user_agent (text)                                       │
│ device_info (text)                                      │
│ location (text)                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              NOTIFICATION_TEMPLATES                      │
├─────────────────────────────────────────────────────────┤
│ id (uuid, PK)                                           │
│ name (text, NOT NULL)                                   │
│ type (text, NOT NULL)                                   │
│ subject (text, NOT NULL)                                │
│ body (text, NOT NULL)                                   │
│ is_default (boolean, DEFAULT false)                    │
│ created_at (timestamptz, DEFAULT now())                │
│ updated_at (timestamptz, DEFAULT now())                │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 4 — CONFIGURAÇÃO DO SUPABASE

### 4.1 Informações do Projeto Supabase

```bash
# URL do Projeto
SUPABASE_URL=https://vmgrnkuhprxowcvydnvm.supabase.co

# Project ID
PROJECT_ID=vmgrnkuhprxowcvydnvm

# Anon Key (Chave Pública)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (Chave Privada - Não expor!)
SUPABASE_SERVICE_ROLE_KEY=[SECRETO]

# Database URL
SUPABASE_DB_URL=[Fornecido pelo Supabase]
```

### 4.2 Tabelas e Colunas Detalhadas

#### Tabela: clientes

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | NO | gen_random_uuid() | Identificador único |
| nome | text | NO | - | Nome completo do cliente |
| email | text | YES | NULL | Email do cliente |
| telefone | text | YES | NULL | Telefone de contacto |
| nuit | text | YES | NULL | NUIT (NIF moçambicano) |
| endereco | text | YES | NULL | Endereço completo |
| ativo | boolean | NO | true | Cliente ativo no sistema |
| data_registro | timestamptz | NO | now() | Data de registro |
| created_at | timestamptz | NO | now() | Data de criação |
| updated_at | timestamptz | NO | now() | Data de atualização |

#### Tabela: dividas

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | NO | gen_random_uuid() | Identificador único |
| cliente_id | uuid | NO | - | Referência ao cliente |
| valor | numeric | NO | - | Valor da dívida |
| descricao | text | NO | - | Descrição da dívida |
| status | text | NO | 'pendente' | Status (pendente/paga/vencida) |
| data_criacao | timestamptz | NO | now() | Data de criação |
| data_vencimento | date | NO | - | Data de vencimento |
| data_pagamento | timestamptz | YES | NULL | Data do pagamento |
| created_at | timestamptz | NO | now() | Timestamp de criação |
| updated_at | timestamptz | NO | now() | Timestamp de atualização |

#### Tabela: notificacoes

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | NO | gen_random_uuid() | Identificador único |
| divida_id | uuid | YES | NULL | Referência à dívida |
| cliente_id | uuid | YES | NULL | Referência ao cliente |
| tipo | text | NO | - | Tipo (email/in_app/sms) |
| status | text | NO | 'pendente' | Status da notificação |
| mensagem | text | YES | NULL | Corpo da mensagem |
| data_agendamento | timestamptz | NO | - | Data de agendamento |
| data_envio | timestamptz | YES | NULL | Data de envio efetivo |
| erro | text | YES | NULL | Mensagem de erro |
| lida | boolean | YES | false | Notificação lida |
| created_at | timestamptz | NO | now() | Data de criação |

#### Tabela: profiles

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | NO | gen_random_uuid() | Identificador único |
| user_id | uuid | NO | - | Referência ao utilizador |
| full_name | text | NO | - | Nome completo |
| avatar_url | text | YES | NULL | URL do avatar |
| telefone | text | YES | NULL | Telefone |
| cargo | text | YES | NULL | Cargo no sistema |
| departamento | text | YES | NULL | Departamento |
| bio | text | YES | NULL | Biografia |
| email_notifications | boolean | YES | true | Notificações por email |
| whatsapp_notifications | boolean | YES | true | Notificações WhatsApp |
| sms_notifications | boolean | YES | false | Notificações SMS |
| active | boolean | NO | true | Utilizador ativo |
| created_by | uuid | YES | NULL | Criado por |
| created_at | timestamptz | NO | now() | Data de criação |
| updated_at | timestamptz | NO | now() | Data de atualização |

#### Tabela: user_roles

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| id | uuid | NO | gen_random_uuid() | Identificador único |
| user_id | uuid | NO | - | Referência ao utilizador |
| role | app_role | NO | - | Papel (admin/user) |
| created_at | timestamptz | YES | now() | Data de criação |

### 4.3 Row Level Security (RLS) Policies

#### Policies da tabela `clientes`

```sql
-- SELECT: Authenticated users can view clients
CREATE POLICY "Authenticated users can view clients"
ON clientes FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- INSERT: Authenticated users can insert clients
CREATE POLICY "Authenticated users can insert clients"
ON clientes FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Authenticated users can update clients
CREATE POLICY "Authenticated users can update clients"
ON clientes FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

-- DELETE: Admins can delete clients
CREATE POLICY "Admins can delete clients"
ON clientes FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

#### Policies da tabela `dividas`

```sql
-- SELECT: Authenticated users can view debts
CREATE POLICY "Authenticated users can view debts"
ON dividas FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- INSERT: Authenticated users can create debts
CREATE POLICY "Authenticated users can create debts"
ON dividas FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- UPDATE: Authenticated users can update debts
CREATE POLICY "Authenticated users can update debts"
ON dividas FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

-- DELETE: Admins can delete debts
CREATE POLICY "Admins can delete debts"
ON dividas FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

#### Policies da tabela `profiles`

```sql
-- SELECT: Authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON profiles FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- INSERT: Admins can create profiles
CREATE POLICY "Admins can create profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- UPDATE: Admins can update profiles
CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- DELETE: Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

#### Policies da tabela `user_roles`

```sql
-- SELECT: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- SELECT: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- INSERT: Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- UPDATE: Admins can update roles
CREATE POLICY "Admins can update roles"
ON user_roles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- DELETE: Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

### 4.4 Database Functions

#### Função: has_role

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

**Descrição:** Verifica se um utilizador possui determinado papel.  
**Segurança:** `SECURITY DEFINER` para evitar recursão em RLS.

#### Função: get_user_role

```sql
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;
```

**Descrição:** Retorna o papel de um utilizador.

#### Função: update_debt_status

```sql
CREATE OR REPLACE FUNCTION public.update_debt_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.dividas 
  SET status = 'vencida' 
  WHERE data_vencimento < CURRENT_DATE 
    AND status = 'pendente';
END;
$$;
```

**Descrição:** Atualiza o status de dívidas vencidas.

#### Função: log_user_activity

```sql
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_action_type text, 
  p_description text, 
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.user_activities (user_id, action_type, description, metadata)
  VALUES (auth.uid(), p_action_type, p_description, p_metadata)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;
```

**Descrição:** Registra atividades dos utilizadores.

#### Função: update_updated_at_column

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
```

**Descrição:** Trigger para atualizar automaticamente a coluna `updated_at`.

### 4.5 Database Triggers

#### Trigger: Atualizar updated_at

```sql
-- Clientes
CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Dívidas
CREATE TRIGGER update_dividas_updated_at
BEFORE UPDATE ON dividas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Trigger: Notificações

```sql
-- Notificar nova dívida
CREATE TRIGGER notify_new_debt_trigger
AFTER INSERT ON dividas
FOR EACH ROW EXECUTE FUNCTION notify_new_debt();

-- Notificar dívida atualizada
CREATE TRIGGER notify_debt_updated_trigger
AFTER UPDATE ON dividas
FOR EACH ROW EXECUTE FUNCTION notify_debt_updated();

-- Notificar dívida vencida
CREATE TRIGGER notify_debt_overdue_trigger
AFTER UPDATE OF status ON dividas
FOR EACH ROW
WHEN (NEW.status = 'vencida')
EXECUTE FUNCTION notify_debt_overdue();

-- Notificar pagamento confirmado
CREATE TRIGGER notify_payment_completed_trigger
AFTER UPDATE OF status ON dividas
FOR EACH ROW
WHEN (NEW.status = 'paga')
EXECUTE FUNCTION notify_payment_completed();
```

### 4.6 Configuração de Autenticação

```toml
# supabase/config.toml

[auth]
enabled = true
site_url = "https://seu-dominio.vercel.app"
additional_redirect_urls = ["http://localhost:5173"]

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false  # Desativado para desenvolvimento

[auth.external.google]
enabled = false
```

### 4.7 Storage Configuration

```sql
-- Bucket: avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Policy: Public access
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Authenticated users can upload
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4.8 Edge Functions Configuration

```toml
# supabase/config.toml

[functions.send-email]
verify_jwt = false

[functions.check-debts]
verify_jwt = true

[functions.create-user]
verify_jwt = true

[functions.log-login]
verify_jwt = false

[functions.popular-dados-teste]
verify_jwt = false
```

---

## PARTE 5 — INSTALAÇÃO LOCAL

### 5.1 Clone do Repositório

```bash
# Clone via HTTPS
git clone https://github.com/seu-usuario/ncangaza-debt-system.git

# Ou via SSH
git clone git@github.com:seu-usuario/ncangaza-debt-system.git

# Navegar para a pasta
cd ncangaza-debt-system
```

### 5.2 Instalação de Dependências

```bash
# Usando NPM (recomendado)
npm install

# Ou usando Yarn
yarn install

# Ou usando PNPM
pnpm install
```

**Tempo estimado:** 2-5 minutos (depende da conexão)

### 5.3 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env

# Supabase Configuration
VITE_SUPABASE_URL=https://vmgrnkuhprxowcvydnvm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend API (para envio de emails)
RESEND_API_KEY=re_...

# Environment
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Nunca versione o arquivo `.env` no Git!

### 5.4 Executar o Projeto Localmente

```bash
# Modo desenvolvimento
npm run dev

# Ou
yarn dev

# Ou
pnpm dev
```

**Output esperado:**

```
  VITE v6.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Acesso:** Abra o navegador em `http://localhost:5173`

### 5.5 Build de Produção

```bash
# Gerar build
npm run build

# Preview do build
npm run preview
```

**Output esperado:**

```
vite v6.x.x building for production...
✓ 1543 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-DiKu8PZh.css   45.23 kB │ gzip: 12.34 kB
dist/assets/index-BtR2X8kL.js   678.90 kB │ gzip: 198.76 kB
✓ built in 12.34s
```

### 5.6 Estrutura do .env.example

Crie um arquivo `.env.example` para documentação:

```bash
# .env.example

# ============================================
# SUPABASE CONFIGURATION
# ============================================
# URL do projeto Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Chave anônima (pública)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================
# RESEND API (EMAIL)
# ============================================
# Chave API do Resend (obter em https://resend.com)
RESEND_API_KEY=re_your_resend_api_key

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV=development
```

### 5.7 Testar Autenticação Local

1. **Acesse:** `http://localhost:5173/login`
2. **Credenciais padrão (se já configurado):**
   - Email: `admin@ncangaza.co.mz`
   - Senha: `Admin@123`

3. **Verificação de sucesso:**
   - Redirecionamento para o dashboard
   - Nome do utilizador aparece no header
   - Sidebar carregada corretamente

### 5.8 Testar Notificações de Email

1. **Registre uma dívida vencida**
2. **Execute a Edge Function check-debts:**

```bash
# Via Supabase Dashboard
https://supabase.com/dashboard/project/vmgrnkuhprxowcvydnvm/functions/check-debts

# Ou via curl
curl -X POST \
  https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/check-debts \
  -H "Authorization: Bearer SEU_ANON_KEY"
```

3. **Verificar logs:**
   - Supabase Dashboard > Functions > check-debts > Logs
   - Verificar se o email foi enviado com sucesso

---

## PARTE 6 — DEPLOY EM PRODUÇÃO

### 6.1 Deploy do Frontend na Vercel

#### Passo 1: Criar conta na Vercel
1. Acesse: https://vercel.com/signup
2. Conecte sua conta do GitHub

#### Passo 2: Importar Projeto
1. Dashboard Vercel > **New Project**
2. Selecione o repositório `ncangaza-debt-system`
3. Configure as settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Passo 3: Configurar Variáveis de Ambiente

No dashboard da Vercel, vá em **Settings** > **Environment Variables**:

```bash
# Production
VITE_SUPABASE_URL=https://vmgrnkuhprxowcvydnvm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

#### Passo 4: Deploy
1. Clique em **Deploy**
2. Aguarde o build (2-5 minutos)
3. Acesse a URL fornecida (ex: `https://ncangaza.vercel.app`)

### 6.2 Deploy das Edge Functions

As Edge Functions são deployadas automaticamente pelo Supabase.

**Verificação:**

1. Acesse: https://supabase.com/dashboard/project/vmgrnkuhprxowcvydnvm/functions
2. Verifique se todas as functions estão **Deployed**
3. Teste cada função através dos logs

### 6.3 Configuração de Permissões e Policies

#### Verificar RLS está habilitado em todas as tabelas:

```sql
-- Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Resultado esperado:** Todas as tabelas com `rowsecurity = true`

#### Verificar Policies:

```sql
-- Listar todas as policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public';
```

### 6.4 Configurar Resend Domain

1. Acesse: https://resend.com/domains
2. Adicione seu domínio personalizado
3. Configure os registros DNS:

```
Type: TXT
Host: @
Value: resend-verification=...

Type: MX
Host: @
Value: feedback-smtp.resend.com
Priority: 10
```

4. Aguarde a verificação (até 48 horas)

### 6.5 Testes Finais Após Deploy

#### Checklist de Testes:

- [ ] Login com credenciais existentes
- [ ] Criar novo cliente
- [ ] Registrar nova dívida
- [ ] Marcar dívida como paga
- [ ] Receber notificação in-app
- [ ] Verificar envio de email
- [ ] Gerar relatório PDF
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Verificar dashboard carrega corretamente
- [ ] Testar todas as rotas protegidas

---

## PARTE 7 — SEGURANÇA

### 7.1 Regras de Segurança Aplicadas

#### Row Level Security (RLS)
✅ **Habilitado em todas as tabelas**

- Nenhum acesso direto sem autenticação
- Policies específicas por ação (SELECT, INSERT, UPDATE, DELETE)
- Verificação de papéis (admin/user) nas operações críticas

#### Função Security Definer
✅ **Implementada para evitar recursão**

```sql
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  -- Executa com privilégios do owner
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

#### JWT Token Authentication
✅ **Supabase Auth com tokens JWT**

- Tokens assinados e verificados
- Expiração automática (1 hora)
- Refresh automático pelo client
- Armazenamento seguro no localStorage

#### Content Security Policy (CSP)
✅ **Headers de segurança configurados**

```javascript
// Edge Functions CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

#### Validação de Input
✅ **Validação com Zod**

```typescript
// Exemplo: Validação de cliente
const clientSchema = z.object({
  nome: z.string().min(3).max(100),
  email: z.string().email().optional(),
  telefone: z.string().regex(/^\+?[0-9]{9,15}$/).optional(),
  nuit: z.string().length(9).optional(),
});
```

### 7.2 Gestão de Permissões e Perfis

#### Enum de Papéis

```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');
```

#### Permissões por Papel

| Ação | Admin | User |
|------|-------|------|
| Ver clientes | ✅ | ✅ |
| Criar clientes | ✅ | ✅ |
| Editar clientes | ✅ | ✅ |
| Deletar clientes | ✅ | ❌ |
| Ver dívidas | ✅ | ✅ |
| Criar dívidas | ✅ | ✅ |
| Editar dívidas | ✅ | ✅ |
| Deletar dívidas | ✅ | ❌ |
| Ver relatórios | ✅ | ✅ |
| Gerar relatórios | ✅ | ✅ |
| Ver utilizadores | ✅ | ❌ |
| Criar utilizadores | ✅ | ❌ |
| Editar utilizadores | ✅ | ❌ |
| Deletar utilizadores | ✅ | ❌ |
| Ver configurações | ✅ | ❌ |

### 7.3 Proteção de Chaves

#### Variáveis de Ambiente
✅ **Nunca versionadas no Git**

```gitignore
# .gitignore
.env
.env.local
.env.production
```

#### Chaves no Frontend
✅ **Apenas chaves públicas (Anon Key)**

```typescript
// ✅ CORRETO - Cliente frontend
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY  // Chave pública
);
```

#### Chaves no Backend
✅ **Service Role Key apenas em Edge Functions**

```typescript
// ✅ CORRETO - Edge Function (servidor)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // Chave privada
);
```

#### Secrets Management
✅ **Secrets armazenados no Supabase**

```bash
# Secrets configurados via Supabase Dashboard
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- SUPABASE_DB_URL
```

### 7.4 Prevenção de Ataques

#### SQL Injection
✅ **Proteção nativa do Supabase**

- Queries parametrizadas
- ORM embutido
- Validação automática de tipos

#### XSS (Cross-Site Scripting)
✅ **React escapa HTML automaticamente**

```typescript
// ✅ Seguro - React escapa automaticamente
<div>{clientName}</div>

// ❌ NUNCA fazer
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### CSRF (Cross-Site Request Forgery)
✅ **Tokens JWT verificados em cada request**

#### Brute Force
✅ **Rate limiting no Supabase Auth**

- Limite de tentativas de login
- Bloqueio temporário após falhas

---

## PARTE 8 — ERROS COMUNS E SOLUÇÕES

### 8.1 Erros de Build

#### Erro: "Cannot find module '@/...' "

**Causa:** Configuração incorreta de path aliases.

**Solução:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### Erro: "Module not found: Can't resolve 'X'"

**Causa:** Dependência não instalada.

**Solução:**

```bash
npm install
# ou
npm install <nome-do-pacote>
```

#### Erro: "Build failed with error code 1"

**Causa:** Erro de TypeScript não resolvido.

**Solução:**

1. Verificar erros com: `npm run build`
2. Corrigir todos os erros de tipo
3. Se necessário, adicionar `// @ts-ignore` temporariamente

### 8.2 Erros de Autenticação

#### Erro: "Invalid login credentials"

**Causa:** Email ou senha incorretos.

**Solução:**

1. Verificar credenciais no Supabase Dashboard
2. Resetar senha se necessário
3. Verificar se o usuário está ativo

#### Erro: "User not found"

**Causa:** Utilizador não existe na tabela `auth.users`.

**Solução:**

```sql
-- Verificar se usuário existe
SELECT * FROM auth.users WHERE email = 'email@exemplo.com';

-- Criar novo utilizador (via Supabase Dashboard)
```

#### Erro: "Row violates row-level security policy"

**Causa:** Policies RLS bloqueando acesso.

**Solução:**

1. Verificar se usuário está autenticado
2. Verificar se possui o papel correto
3. Revisar policies:

```sql
-- Verificar policies da tabela
SELECT * FROM pg_policies WHERE tablename = 'nome_tabela';
```

#### Erro: "JWT expired"

**Causa:** Token de autenticação expirou.

**Solução:**

```typescript
// O refresh é automático, mas pode forçar:
const { data, error } = await supabase.auth.refreshSession();
```

### 8.3 Erros de Notificações

#### Erro: "Failed to send email"

**Causa:** API Key do Resend inválida ou domínio não verificado.

**Solução:**

1. Verificar API Key: https://resend.com/api-keys
2. Verificar domínio: https://resend.com/domains
3. Verificar logs da Edge Function `send-email`

#### Erro: "Notification not sent"

**Causa:** Edge Function `check-debts` não executada.

**Solução:**

1. Executar manualmente:

```bash
curl -X POST \
  https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/check-debts \
  -H "Authorization: Bearer ANON_KEY"
```

2. Verificar logs no Supabase Dashboard

#### Erro: "Email domain not verified"

**Causa:** Domínio não verificado no Resend.

**Solução:**

1. Acesse https://resend.com/domains
2. Configure registros DNS conforme instruções
3. Aguarde verificação (até 48h)

### 8.4 Erros de Base de Dados

#### Erro: "relation 'table_name' does not exist"

**Causa:** Tabela não foi criada.

**Solução:**

```bash
# Executar migrações
supabase db push

# Ou executar SQL manualmente no Dashboard
```

#### Erro: "foreign key constraint violation"

**Causa:** Tentando inserir/deletar registro com referências inválidas.

**Solução:**

1. Verificar se registro referenciado existe
2. Deletar registros dependentes primeiro

#### Erro: "infinite recursion detected in policy"

**Causa:** Policy RLS verificando a mesma tabela.

**Solução:**

Usar função `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  -- Resolve recursão
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

#### Erro: "Connection timeout"

**Causa:** Instância Supabase inativa ou rede lenta.

**Solução:**

1. Verificar status do projeto: https://status.supabase.com
2. Verificar conexão à internet
3. Aumentar timeout:

```typescript
const supabase = createClient(url, key, {
  db: {
    schema: 'public'
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        timeout: 10000  // 10 segundos
      });
    }
  }
});
```

### 8.5 Erros de Configuração

#### Erro: "env variable not defined"

**Causa:** Variável de ambiente não configurada.

**Solução:**

```bash
# Verificar .env
cat .env

# Adicionar variável faltante
echo "VITE_SUPABASE_URL=https://..." >> .env
```

#### Erro: "CORS error"

**Causa:** Origin não permitido.

**Solução:**

1. Adicionar URL na whitelist do Supabase
2. Configurar CORS nas Edge Functions:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## CONCLUSÃO

Este manual técnico documenta todos os aspectos de instalação, configuração e deployment do **Sistema Web de Gestão de Dívidas com Notificações Automáticas**.

### Recursos Adicionais

- **Documentação Supabase:** https://supabase.com/docs
- **Documentação React:** https://react.dev
- **Documentação Vite:** https://vitejs.dev
- **Documentação Tailwind:** https://tailwindcss.com
- **Resend API Docs:** https://resend.com/docs

### Suporte

Para questões técnicas, consulte:
- Logs do Supabase Dashboard
- Console do navegador (F12)
- Network tab para APIs
- Logs das Edge Functions

---

**Desenvolvido por Nilton Ramim Pita**  
**Universidade Católica de Moçambique (UCM)**  
**© 2025 Ncangaza Multiservices**
