# DOCUMENTAÇÃO TÉCNICA COMPLETA
## Sistema de Gestão de Dívidas - Ncangaza Multiservices

---

# PARTE 1 — MANUAL DE INSTALAÇÃO

## 1.1 Requisitos do Sistema

### Hardware Mínimo
- **CPU**: Dual-core 2.0 GHz ou superior
- **RAM**: 4 GB mínimo (8 GB recomendado)
- **Disco**: 500 MB de espaço livre
- **Conexão**: Internet com velocidade mínima de 2 Mbps

### Software
- **Sistema Operativo**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Node.js**: Versão 18.0.0 ou superior
- **npm**: Versão 9.0.0 ou superior (incluído com Node.js)
- **Navegadores Suportados**:
  - Google Chrome 90+ (Recomendado)
  - Mozilla Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+

### Ferramentas de Desenvolvimento
- **Git**: Para clonar o repositório
- **Editor de Código**: VSCode (recomendado), WebStorm, Sublime Text

## 1.2 Tecnologias Utilizadas (Versões Exactas)

### Frontend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.3.1 | Biblioteca principal de UI |
| TypeScript | 5.8.3 | Linguagem de programação |
| Vite | 5.4.19 | Build tool e dev server |
| TailwindCSS | 3.4.17 | Framework CSS |
| shadcn/ui | - | Componentes UI |
| React Router DOM | 6.30.1 | Navegação |
| React Query | 5.83.0 | Gestão de estado assíncrono |
| Recharts | 3.1.2 | Gráficos e visualizações |
| Lucide React | 0.462.0 | Ícones |
| date-fns | 3.6.0 | Manipulação de datas |
| React Hook Form | 7.61.1 | Gestão de formulários |
| Zod | 3.25.76 | Validação de schemas |
| Sonner | 1.7.4 | Notificações toast |
| jsPDF | 3.0.3 | Geração de PDFs |
| jspdf-autotable | 5.0.2 | Tabelas em PDF |

### Backend (Supabase)
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| @supabase/supabase-js | 2.57.4 | Cliente Supabase |
| PostgreSQL | 15.x | Base de dados |
| Supabase Auth | - | Autenticação |
| Supabase Storage | - | Armazenamento de ficheiros |
| Edge Functions (Deno) | - | Lógica serverless |

### Serviços Externos
- **Resend**: Envio de emails (API v1)
- **Vercel**: Hospedagem do frontend
- **Supabase Cloud**: Hospedagem do backend

## 1.3 Instalação Local

### Passo 1: Clonar o Repositório
```bash
# Via HTTPS
git clone https://github.com/seu-usuario/ncangaza-debt-management.git

# Via SSH
git clone git@github.com:seu-usuario/ncangaza-debt-management.git

# Entrar no diretório
cd ncangaza-debt-management
```

### Passo 2: Instalar Dependências
```bash
# Usando npm
npm install

# OU usando pnpm (mais rápido)
pnpm install

# OU usando yarn
yarn install
```

### Passo 3: Configurar Variáveis de Ambiente
Criar ficheiro `.env` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="vmgrnkuhprxowcvydnvm"
VITE_SUPABASE_URL="https://vmgrnkuhprxowcvydnvm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZ3Jua3VocHJ4b3djdnlkbnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTc5NDcsImV4cCI6MjA3MjI5Mzk0N30.q2wxy651XYiuQzJny06bL1Xlp337KCD5rBIp-YGQxxQ"

# Resend API (para emails)
RESEND_API_KEY="seu_resend_api_key_aqui"
```

**⚠️ IMPORTANTE**: Nunca commitar o ficheiro `.env` para o repositório!

### Passo 4: Executar em Modo de Desenvolvimento
```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:8080`

### Passo 5: Build de Produção
```bash
# Gerar build de produção
npm run build

# Pré-visualizar build de produção
npm run preview
```

## 1.4 Estrutura de Pastas `/src`

```
src/
├── assets/                  # Imagens, logos, ficheiros estáticos
│   ├── logo-ncangaza.png
│   ├── logo-ncangaza-full.png
│   └── logo-ncangaza-hq.png
├── components/              # Componentes React
│   ├── admin/              # Componentes de administração
│   │   └── UserManagement.tsx
│   ├── analytics/          # Análises e métricas
│   │   ├── Analytics.tsx
│   │   └── AnalyticsReal.tsx
│   ├── clients/            # Gestão de clientes
│   │   └── ClientsTable.tsx
│   ├── dashboard/          # Dashboard principal
│   │   ├── Dashboard.tsx
│   │   ├── DebtChart.tsx
│   │   ├── RecentDebts.tsx
│   │   └── StatsCards.tsx
│   ├── debts/              # Gestão de dívidas
│   │   ├── DebtActions.tsx
│   │   └── DebtsTable.tsx
│   ├── forms/              # Formulários
│   │   ├── ClientForm.tsx
│   │   └── DebtForm.tsx
│   ├── layout/             # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── notifications/      # Sistema de notificações
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── NotificationList.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── NotificationTemplates.tsx
│   │   ├── Notifications.tsx
│   │   └── NotificationsReal.tsx
│   ├── profile/            # Perfil do utilizador
│   │   ├── ActivityLog.tsx
│   │   ├── NotificationPreferences.tsx
│   │   ├── PasswordChange.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileHeader.tsx
│   │   └── SecuritySettings.tsx
│   ├── reports/            # Relatórios
│   │   ├── Reports.tsx
│   │   └── ReportsReal.tsx
│   ├── settings/           # Configurações
│   │   └── Settings.tsx
│   ├── ui/                 # Componentes UI base (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (40+ componentes)
│   └── ProtectedRoute.tsx  # Rota protegida por autenticação
├── contexts/               # Contextos React
│   ├── AuthContext.tsx    # Contexto de autenticação
│   └── ThemeContext.tsx   # Tema dark/light
├── hooks/                  # Custom React Hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   ├── useClients.ts
│   ├── useDebts.ts
│   ├── useLogo.ts
│   ├── useNotifications.ts
│   ├── usePopularDadosAutomatico.ts
│   ├── useSettings.ts
│   └── useStats.ts
├── integrations/           # Integrações externas
│   └── supabase/
│       ├── client.ts      # Cliente Supabase
│       └── types.ts       # Tipos TypeScript auto-gerados
├── lib/                    # Bibliotecas utilitárias
│   ├── utils.ts           # Funções auxiliares
│   └── validations.ts     # Validações de formulários
├── pages/                  # Páginas principais
│   ├── Index.tsx          # Página principal
│   ├── Login.tsx          # Página de login
│   └── NotFound.tsx       # Página 404
├── utils/                  # Utilitários
│   ├── currency.ts        # Formatação de moeda
│   ├── notifications.ts   # Lógica de notificações
│   └── pdfGenerator.ts    # Geração de PDFs
├── App.tsx                 # Componente raiz
├── App.css                 # Estilos globais
├── index.css              # Estilos Tailwind + Design System
├── main.tsx               # Entry point
└── vite-env.d.ts          # Tipos Vite
```

## 1.5 Configuração do Supabase

### 1.5.1 Configurar Autenticação
1. Aceder ao painel Supabase: https://supabase.com/dashboard/project/vmgrnkuhprxowcvydnvm
2. Ir a **Authentication** → **Providers**
3. Activar **Email** como provider
4. **Email Templates**: Personalizar templates de confirmação (opcional)

### 1.5.2 Configurar URLs de Redirecionamento
1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://seu-dominio.vercel.app` ou `http://localhost:8080`
3. **Redirect URLs**: Adicionar URLs permitidas
   - `http://localhost:8080/**`
   - `https://seu-dominio.vercel.app/**`

### 1.5.3 Row Level Security (RLS)
O sistema utiliza políticas RLS para segurança. As políticas já estão aplicadas nas seguintes tabelas:
- `clientes`: Requer autenticação, admin pode apagar
- `dividas`: Requer autenticação, admin pode apagar
- `notificacoes`: Requer autenticação, admin pode apagar
- `profiles`: Visível para autenticados, admin pode modificar
- `user_roles`: Apenas admin pode gerir
- `user_activities`: Utilizadores veem apenas suas atividades
- `notification_templates`: Apenas admin pode gerir
- `login_history`: Utilizadores veem apenas seu histórico

### 1.5.4 Secrets do Supabase (Edge Functions)
Configurar no Supabase Dashboard → **Settings** → **Edge Functions**:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
SUPABASE_URL=https://vmgrnkuhprxowcvydnvm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@...
```

## 1.6 Deploy em Produção

### 1.6.1 Deploy Frontend (Vercel)

**Passo 1**: Conectar repositório no Vercel
1. Aceder a https://vercel.com
2. **Import Project** → Selecionar repositório GitHub
3. **Framework Preset**: Vite
4. **Root Directory**: `./`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

**Passo 2**: Configurar variáveis de ambiente
Adicionar no Vercel → **Settings** → **Environment Variables**:
```
VITE_SUPABASE_URL=https://vmgrnkuhprxowcvydnvm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Passo 3**: Deploy
- Vercel faz deploy automático em cada push no branch `main`
- URL de produção: `https://seu-projeto.vercel.app`

### 1.6.2 Deploy Edge Functions (Supabase)

As Edge Functions são deployadas automaticamente pelo Supabase quando detecta alterações na pasta `supabase/functions/`.

**Manual Deploy (se necessário)**:
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref vmgrnkuhprxowcvydnvm

# Deploy de todas as funções
supabase functions deploy

# Deploy de uma função específica
supabase functions deploy send-email
```

### 1.6.3 Configurar API Resend
1. Criar conta em https://resend.com
2. Obter API Key no dashboard
3. Adicionar domínio verificado (opcional mas recomendado)
4. Configurar a API Key nas secrets do Supabase

## 1.7 Permissões e Segurança Iniciais

### Criar Primeiro Utilizador Admin

**Opção 1: Via Supabase Dashboard**
1. **Authentication** → **Users** → **Add user**
2. Email: `admin@nms.com`
3. Password: (definir senha segura)
4. Confirmar email automaticamente

**Opção 2: Via Edge Function**
```bash
curl -X POST https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nms.com",
    "password": "SenhaSegura123!",
    "full_name": "Administrador Sistema"
  }'
```

Após criar, ir à tabela `user_roles` e adicionar:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('uuid_do_utilizador', 'admin');
```

### Desactivar Confirmação de Email (Desenvolvimento)
Para facilitar testes:
1. **Authentication** → **Settings**
2. Desactivar **Enable email confirmations**

⚠️ **IMPORTANTE**: Reactivar em produção!

---

# PARTE 2 — MANUAL DO UTILIZADOR

## 2.1 Perfis do Sistema

### 2.1.1 Perfil: Administrador (Admin)

**Permissões Completas**:
- ✅ Gerir utilizadores (criar, editar, desactivar, apagar)
- ✅ Gerir clientes (criar, editar, desactivar, apagar)
- ✅ Gerir dívidas (criar, editar, apagar, marcar como paga)
- ✅ Visualizar dashboard completo com todas as estatísticas
- ✅ Gerar relatórios (todos os tipos)
- ✅ Visualizar notificações de sistema
- ✅ Configurar templates de notificação
- ✅ Aceder a análises avançadas
- ✅ Visualizar histórico de actividades
- ✅ Configurar definições do sistema
- ✅ Enviar notificações manuais (email, WhatsApp, chamadas)
- ✅ Visualizar histórico de login de utilizadores

### 2.1.2 Perfil: Utilizador (User)

**Permissões Limitadas**:
- ✅ Gerir clientes (criar, editar, visualizar)
- ✅ Gerir dívidas (criar, editar, visualizar, marcar como paga)
- ✅ Visualizar dashboard com estatísticas gerais
- ✅ Gerar relatórios básicos
- ✅ Visualizar notificações
- ✅ Editar perfil pessoal
- ✅ Visualizar histórico de actividades próprias
- ❌ **NÃO PODE** gerir utilizadores
- ❌ **NÃO PODE** apagar clientes ou dívidas
- ❌ **NÃO PODE** configurar templates de notificação
- ❌ **NÃO PODE** aceder a análises avançadas de administrador

## 2.2 Guia de Utilização Passo-a-Passo

### 2.2.1 Login no Sistema

**Passo 1**: Aceder ao URL do sistema
- Desenvolvimento: `http://localhost:8080`
- Produção: `https://seu-dominio.vercel.app`

**Passo 2**: Inserir credenciais
- **Email**: Endereço de email registado
- **Senha**: Senha definida no registo

**Passo 3**: Opções adicionais
- ☑️ Marcar "Lembrar-me" para manter sessão
- Clicar em **"Entrar no Sistema"**

**Mensagens de Erro Comuns**:
| Erro | Causa | Solução |
|------|-------|---------|
| "Email ou senha incorretos" | Credenciais inválidas | Verificar dados inseridos |
| "Por favor, confirme seu email" | Email não confirmado | Verificar caixa de entrada |
| "Utilizador não encontrado" | Conta não existe | Contactar administrador |

**Após Login Bem-Sucedido**:
- Redirecionamento automático para o Dashboard
- Notificação: "Login realizado com sucesso!"
- Sessão mantida por 30 dias (se "Lembrar-me" activado)

### 2.2.2 Gestão de Clientes

#### Visualizar Lista de Clientes

**Passo 1**: No menu lateral, clicar em **"Clientes"**

**Ecrã Apresentado**:
- Tabela com todos os clientes
- Colunas: Nome, NUIT, Telefone, Email, Endereço, Status, Acções

**Funcionalidades Disponíveis**:
- 🔍 **Pesquisa**: Barra de pesquisa no topo
- 🔢 **Paginação**: Navegação por páginas
- 📊 **Ordenação**: Clicar em cabeçalhos de colunas

#### Criar Novo Cliente

**Passo 1**: Clicar no botão **"+ Novo Cliente"** (canto superior direito)

**Passo 2**: Preencher formulário
| Campo | Obrigatório | Formato | Exemplo |
|-------|-------------|---------|---------|
| Nome | ✅ Sim | Texto livre | "João Silva" |
| NUIT | ❌ Não | 9 dígitos | "123456789" |
| Telefone | ❌ Não | Formato internacional | "+258841234567" |
| Email | ❌ Não | Email válido | "joao@email.com" |
| Endereço | ❌ Não | Texto livre | "Av. Julius Nyerere, 123" |

**Passo 3**: Clicar em **"Registar Cliente"**

**Resultado**:
- ✅ Cliente adicionado à base de dados
- 🔔 Notificação: "Cliente registado com sucesso!"
- 🔄 Tabela actualizada automaticamente

**Validações Aplicadas**:
- Nome não pode estar vazio
- Email deve ter formato válido (se preenchido)
- NUIT deve ter 9 dígitos (se preenchido)
- Telefone deve ter formato válido (se preenchido)

#### Editar Cliente Existente

**Passo 1**: Na lista de clientes, clicar no ícone ✏️ **Editar**

**Passo 2**: Actualizar informações no formulário

**Passo 3**: Clicar em **"Actualizar Cliente"**

**Resultado**:
- ✅ Dados actualizados na base de dados
- 🔔 Notificação: "Cliente actualizado com sucesso!"

#### Desactivar Cliente

**Passo 1**: Na lista de clientes, clicar no botão **"Desactivar"**

**Passo 2**: Confirmar acção no diálogo

**Resultado**:
- Cliente marcado como inactivo
- Não aparece em relatórios de clientes activos
- Pode ser reactivado posteriormente

**⚠️ NOTA**: Apenas administradores podem **apagar permanentemente** clientes.

### 2.2.3 Gestão de Dívidas

#### Visualizar Dívidas

**Passo 1**: No menu lateral, clicar em **"Dívidas"**

**Ecrã Apresentado**:
- Tabela com todas as dívidas
- Colunas: Cliente, Descrição, Valor, Data Vencimento, Status, Acções

**Filtros Disponíveis**:
- 📅 **Por Status**: Pendente, Vencida, Paga
- 📆 **Por Período**: Última semana, Mês actual, Ano actual
- 🔍 **Por Cliente**: Pesquisa por nome

**Indicadores Visuais**:
- 🟢 **Verde**: Dívida paga
- 🟡 **Amarelo**: Dívida pendente (dentro do prazo)
- 🔴 **Vermelho**: Dívida vencida (em atraso)

#### Registar Nova Dívida

**Passo 1**: Clicar em **"+ Nova Dívida"**

**Passo 2**: Preencher formulário
| Campo | Obrigatório | Formato | Exemplo |
|-------|-------------|---------|---------|
| Cliente | ✅ Sim | Seleccionar da lista | "João Silva" |
| Descrição | ✅ Sim | Texto livre | "Venda de smartphone Redmi A03" |
| Valor | ✅ Sim | Número positivo | "9000.00" |
| Data Vencimento | ✅ Sim | Data futura | "31/12/2025" |

**Passo 3**: Clicar em **"Registar Dívida"**

**Resultado**:
- ✅ Dívida criada com status "Pendente"
- 🔔 Notificação: "Dívida registada com sucesso!"
- 📧 Sistema agenda notificações automáticas

**Validações Aplicadas**:
- Cliente deve estar seleccionado
- Valor deve ser maior que 0
- Data de vencimento deve ser futura
- Descrição não pode estar vazia

#### Editar Dívida

**Passo 1**: Na tabela de dívidas, clicar em ✏️ **Editar**

**Passo 2**: Actualizar campos necessários

**Passo 3**: Clicar em **"Actualizar Dívida"**

**Campos Editáveis**:
- Descrição
- Valor
- Data de vencimento
- Status (apenas admin pode alterar directamente)

#### Marcar Dívida como Paga

**Método 1: Via Acções Rápidas**
1. Na tabela, clicar no botão **"✓ Pagar"**
2. Confirmar acção
3. Sistema regista data/hora do pagamento automaticamente

**Método 2: Via Edição**
1. Abrir formulário de edição
2. Alterar status para "Paga"
3. Sistema preenche data de pagamento automaticamente

**Resultado Após Pagamento**:
- Status muda para "Paga" (🟢)
- Data de pagamento registada
- 🔔 **Notificação In-App** enviada aos admins
- 📧 **Email automático** enviado aos admins
- 📊 Estatísticas do dashboard actualizadas

#### Enviar Notificações Manuais

**WhatsApp**:
1. Clicar no ícone 📱 **WhatsApp**
2. Sistema abre WhatsApp com mensagem pré-preenchida:
   ```
   Caro(a) [Nome Cliente],
   A sua dívida de [Valor] MTn venceu em [Data].
   Por favor, entre em contacto connosco para regularizar a situação.
   
   Descrição: [Descrição Dívida]
   
   Ncangaza Multiservices
   ```
3. Ajustar mensagem se necessário
4. Enviar pelo WhatsApp

**Email**:
1. Clicar no ícone ✉️ **Email**
2. Sistema envia email automático via Resend
3. Modelo de email profissional com detalhes da dívida

**Chamada Telefónica**:
1. Clicar no ícone 📞 **Ligar**
2. Sistema abre aplicação de chamadas com número
3. Efectuar chamada directamente

**⚠️ Todas as acções são registadas como notificações in-app**

### 2.2.4 Dashboard

#### Visão Geral

Ao fazer login, o utilizador é apresentado ao Dashboard com:

**Estatísticas Principais** (Cards no topo):
1. 👥 **Total de Clientes**
   - Número total de clientes activos
   - Indicador de crescimento/decréscimo

2. 📋 **Total de Dívidas**
   - Quantidade de dívidas registadas
   - Separação por status (pendente/vencida/paga)

3. 💰 **Valor Total**
   - Soma de todas as dívidas (todas as status)
   - Formatado em Meticais (MTn)

4. ⏳ **Dívidas Pendentes**
   - Total de dívidas não pagas dentro do prazo
   - Valor em MTn

5. ⚠️ **Dívidas Vencidas**
   - Total de dívidas em atraso
   - Valor em MTn
   - Indicador crítico

6. ✅ **Dívidas Pagas**
   - Total de pagamentos recebidos
   - Valor em MTn

**Gráficos**:
- 📊 **Evolução de Dívidas** (linha temporal)
  - Últimos 6 meses
  - Tendência de crescimento/decréscimo

- 🥧 **Distribuição por Status** (gráfico circular)
  - Percentagem de dívidas pagas/pendentes/vencidas

**Dívidas Recentes**:
- Lista das 5 últimas dívidas registadas
- Acesso rápido a acções (editar, pagar)

### 2.2.5 Notificações

#### Centro de Notificações

**Aceder**: Clicar no ícone 🔔 no cabeçalho

**Tipos de Notificações**:
1. **Sistema** (🔵 azul)
   - Login de novos utilizadores
   - Alterações de configuração
   - Backups realizados

2. **Pagamentos** (🟢 verde)
   - Dívida paga confirmada
   - Valor e cliente identificados

3. **Alertas** (🔴 vermelho)
   - Dívida vencida
   - Dívida a vencer em breve (1 dia antes)

4. **Clientes** (🟡 amarelo)
   - Novo cliente registado
   - Cliente actualizado

**Funcionalidades**:
- Marcar como lida (individualmente)
- Marcar todas como lidas
- Filtrar por tipo
- Pesquisar notificações

#### Notificações Automáticas

O sistema envia automaticamente:

**Lembrete 1 Dia Antes do Vencimento**:
- 📧 Email para cliente (se email cadastrado)
- 🔔 Notificação in-app para admins

**Alerta de Dívida Vencida**:
- 📧 Email para administradores
- 🔔 Notificação in-app crítica
- Actualização diária automática

**Confirmação de Pagamento**:
- 📧 Email para administradores
- 🔔 Notificação in-app para todos

### 2.2.6 Relatórios

#### Tipos de Relatórios Disponíveis

**1. Relatório Mensal**
- Resumo do mês actual
- Total de dívidas criadas
- Pagamentos recebidos
- Taxa de recuperação

**2. Análise de Clientes**
- Clientes com maior volume de dívida
- Clientes com mais dívidas em atraso
- Histórico de pagamentos por cliente

**3. Relatório por Status**
- Filtrar: Pendente, Vencida, Paga, Todas
- Estatísticas detalhadas
- Valores agregados

**4. Relatório Executivo**
- Visão geral completa
- KPIs principais
- Gráficos e tendências

#### Gerar Relatório

**Passo 1**: Ir ao menu **"Relatórios"**

**Passo 2**: Seleccionar parâmetros
- 📅 **Período**: Última semana, Mês actual, Trimestre, Ano, Personalizado
- 📊 **Tipo**: Dívidas, Clientes, Executivo
- 🎯 **Status**: Todas, Pendentes, Vencidas, Pagas
- 📄 **Formato**: PDF, CSV, TXT

**Passo 3**: Clicar em **"Gerar Relatório"**

**Pré-visualização**: Clicar em **"Pré-visualizar"** para ver antes de gerar

**Formatos de Exportação**:

**PDF**:
- Layout profissional com logo
- Tabelas formatadas
- Gráficos incorporados
- Cabeçalho e rodapé

**CSV**:
- Formato para Excel/Google Sheets
- Todas as colunas de dados
- Separador: vírgula

**TXT**:
- Formato texto simples
- Legível em qualquer editor
- Estatísticas resumidas

### 2.2.7 Perfil do Utilizador

#### Editar Informações Pessoais

**Passo 1**: Clicar no avatar no cabeçalho → **"Perfil"**

**Passo 2**: Editar campos
- Nome completo
- Telefone
- Cargo
- Departamento
- Bio/Descrição

**Passo 3**: Clicar em **"Actualizar Perfil"**

#### Alterar Senha

**Passo 1**: Ir a **Perfil** → Aba **"Segurança"**

**Passo 2**: Preencher
- Senha actual
- Nova senha
- Confirmar nova senha

**Passo 3**: Clicar em **"Alterar Senha"**

**Requisitos de Senha**:
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial

#### Preferências de Notificação

**Passo 1**: Ir a **Perfil** → Aba **"Notificações"**

**Opções Disponíveis**:
- ✉️ Notificações por Email (ON/OFF)
- 📱 Notificações por WhatsApp (ON/OFF)
- 📲 Notificações por SMS (ON/OFF)

**Passo 2**: Activar/Desactivar conforme preferência

**Passo 3**: Guardar alterações

#### Histórico de Actividades

**Aceder**: **Perfil** → Aba **"Actividade"**

**Informações Apresentadas**:
- Data e hora da acção
- Tipo de acção (login, criação, edição, eliminação)
- Descrição detalhada
- IP de origem (se disponível)

**Acções Registadas**:
- Login/Logout
- Criação de clientes
- Edição de clientes
- Criação de dívidas
- Pagamento de dívidas
- Geração de relatórios

### 2.2.8 Gestão de Utilizadores (Admin Apenas)

#### Visualizar Utilizadores

**Passo 1**: Menu lateral → **"Utilizadores"** (ícone 👥)

**Informações na Tabela**:
- Nome completo
- Email
- Role (Admin/User)
- Status (Activo/Inactivo)
- Data de criação
- Último login

#### Criar Novo Utilizador

**Passo 1**: Clicar em **"+ Novo Utilizador"**

**Passo 2**: Preencher formulário
- Email (único, obrigatório)
- Nome completo (obrigatório)
- Senha temporária (obrigatório)
- Role: Admin ou User

**Passo 3**: Clicar em **"Criar Utilizador"**

**Resultado**:
- Email de confirmação enviado
- Utilizador pode fazer login
- Aparece na lista de utilizadores

#### Editar Utilizador

**Passo 1**: Clicar em ✏️ **Editar**

**Campos Editáveis**:
- Nome completo
- Role (Admin ↔ User)
- Status (Activo ↔ Inactivo)

**⚠️ IMPORTANTE**: Não é possível alterar o email de um utilizador existente.

#### Desactivar Utilizador

**Passo 1**: Clicar no switch de status

**Resultado**:
- Utilizador não pode fazer login
- Sessões activas são invalidadas
- Dados preservados no sistema

#### Apagar Utilizador

**Passo 1**: Clicar no ícone 🗑️ **Apagar**

**Passo 2**: Confirmar acção no diálogo

**⚠️ AVISO**: Acção irreversível! Todos os dados do utilizador serão eliminados.

### 2.2.9 Configurações do Sistema (Admin Apenas)

**Aceder**: Menu lateral → **"Configurações"** (ícone ⚙️)

#### Templates de Notificação

**Editar Templates de Email**:
1. Seleccionar tipo de template
2. Editar subject e corpo do email
3. Usar variáveis dinâmicas:
   - `{nome_cliente}` - Nome do cliente
   - `{valor}` - Valor da dívida
   - `{data_vencimento}` - Data de vencimento
   - `{descricao}` - Descrição da dívida
   - `{dias_atraso}` - Dias em atraso

4. Clicar em **"Guardar Template"**

**Templates Disponíveis**:
- Lembrete de vencimento (1 dia antes)
- Alerta de dívida vencida
- Confirmação de pagamento

#### Configurações Gerais

- Nome da empresa
- Logo da empresa (upload)
- Email de contacto
- Telefone de contacto
- Endereço

## 2.3 Erros Comuns e Soluções

| Mensagem de Erro | Causa Provável | Solução |
|------------------|----------------|---------|
| "Email ou senha incorretos" | Credenciais inválidas | Verificar dados ou solicitar reset de senha |
| "Acesso negado" | Utilizador não é admin | Contactar administrador para upgrade de permissões |
| "Cliente não encontrado" | Cliente foi eliminado | Actualizar página ou verificar se cliente existe |
| "Erro ao carregar dados" | Problema de conexão | Verificar internet e recarregar página |
| "Sessão expirada" | Token de autenticação expirou | Fazer login novamente |
| "Não é possível apagar este item" | Item tem dependências | Verificar se há dívidas associadas ao cliente |
| "Formato de email inválido" | Email mal formatado | Usar formato correcto: usuario@dominio.com |
| "Valor deve ser maior que zero" | Valor de dívida inválido | Inserir valor positivo |
| "Data de vencimento deve ser futura" | Data no passado | Seleccionar data futura |

## 2.4 Fluxo Completo do Utilizador

```
Login → Dashboard → Visualizar Estatísticas
  ↓
Criar Cliente → Preencher Dados → Guardar
  ↓
Registar Dívida → Seleccionar Cliente → Definir Valor e Vencimento → Guardar
  ↓
Sistema Agenda Notificação Automática
  ↓
1 Dia Antes: Email enviado ao cliente + Notificação in-app para admin
  ↓
Se Paga: Marcar como Paga → Email para admin + Notificação in-app
  ↓
Se Vencida: Sistema actualiza status → Email para admin + Notificação in-app
  ↓
Gerar Relatório → Seleccionar Parâmetros → Exportar PDF/CSV
  ↓
Visualizar Análises → Ver Gráficos e Tendências
  ↓
Logout
```

---

# PARTE 3 — DIAGRAMAS DO SISTEMA

## 3.1 Diagrama de Arquitetura Completa

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        A[React + Vite + TypeScript]
        B[TailwindCSS + shadcn/ui]
        C[React Query]
        D[React Router]
        A --> B
        A --> C
        A --> D
    end
    
    subgraph "Backend - Supabase Cloud"
        E[PostgreSQL Database]
        F[Supabase Auth]
        G[Edge Functions - Deno]
        H[Storage Buckets]
        I[Realtime Subscriptions]
        E -.RLS Policies.-> F
        G --> E
        I --> E
    end
    
    subgraph "Serviços Externos"
        J[Resend Email API]
        K[WhatsApp Business API]
    end
    
    A -->|API REST| E
    A -->|Auth Token| F
    A -->|Invoke| G
    G -->|Send Email| J
    A -->|WebSocket| I
    A -->|Open Link| K
    
    G -.Scheduled CRON.-> G
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style E fill:#3ecf8e,stroke:#333,stroke-width:2px
    style J fill:#ff6b6b,stroke:#333,stroke-width:2px
```

## 3.2 Diagrama de Fluxo - Login

```mermaid
flowchart TD
    Start([Utilizador Acede ao Sistema]) --> Input[Inserir Email e Senha]
    Input --> Validate{Validar Formato}
    Validate -->|Inválido| Error1[Mostrar Erro: Formato Inválido]
    Error1 --> Input
    Validate -->|Válido| Auth[Supabase Auth: signInWithPassword]
    Auth --> CheckAuth{Autenticação Bem-Sucedida?}
    CheckAuth -->|Não| Error2[Mostrar Erro: Credenciais Incorretas]
    Error2 --> Input
    CheckAuth -->|Sim| GetProfile[Buscar Perfil na Tabela 'profiles']
    GetProfile --> GetRole[Buscar Role na Tabela 'user_roles']
    GetRole --> LogActivity[Registar Login na Tabela 'login_history']
    LogActivity --> SetState[Definir Estado: user, profile, session, role]
    SetState --> Redirect{É Admin?}
    Redirect -->|Sim| DashboardAdmin[Redirecionar para Dashboard Admin]
    Redirect -->|Não| DashboardUser[Redirecionar para Dashboard User]
    DashboardAdmin --> End([Sistema Carregado])
    DashboardUser --> End
```

## 3.3 Diagrama de Fluxo - Registo de Dívida

```mermaid
flowchart TD
    Start([Utilizador Clica 'Nova Dívida']) --> Form[Apresentar Formulário]
    Form --> Fill[Preencher: Cliente, Descrição, Valor, Data Vencimento]
    Fill --> ValidateForm{Validar Dados}
    ValidateForm -->|Inválido| ShowError[Mostrar Erros de Validação]
    ShowError --> Fill
    ValidateForm -->|Válido| Submit[Submit Formulário]
    Submit --> InsertDB[INSERT na Tabela 'dividas']
    InsertDB --> CheckInsert{Inserção Bem-Sucedida?}
    CheckInsert -->|Não| ErrorDB[Mostrar Erro de Base de Dados]
    ErrorDB --> Fill
    CheckInsert -->|Sim| CreateNotif[Criar Registo na Tabela 'notificacoes']
    CreateNotif --> TriggerRealtime[Trigger Realtime: 'nova_divida']
    TriggerRealtime --> UpdateUI[Actualizar UI: Tabela de Dívidas]
    UpdateUI --> Toast[Mostrar Toast: 'Dívida registada com sucesso!']
    Toast --> End([Fim])
```

## 3.4 Diagrama de Fluxo - Notificação Automática

```mermaid
flowchart TD
    Start([CRON Diário: 00:00 UTC]) --> Trigger[Edge Function: check-debts]
    Trigger --> Query[Query: Dívidas a vencer em 1 dia]
    Query --> Loop{Para Cada Dívida}
    Loop -->|Próxima| GetClient[Obter Dados do Cliente]
    GetClient --> CheckEmail{Cliente Tem Email?}
    CheckEmail -->|Não| Skip[Pular Esta Dívida]
    Skip --> Loop
    CheckEmail -->|Sim| BuildMessage[Construir Mensagem de Lembrete]
    BuildMessage --> SendEmail[Invocar Edge Function: send-email]
    SendEmail --> CheckSend{Email Enviado?}
    CheckSend -->|Não| LogError[Registar Erro na Tabela 'notificacoes']
    LogError --> Loop
    CheckSend -->|Sim| LogSuccess[Registar Sucesso na Tabela 'notificacoes']
    LogSuccess --> NotifyAdmin[Criar Notificação In-App para Admins]
    NotifyAdmin --> Loop
    Loop -->|Fim| UpdateStatus[Actualizar Status de Dívidas Vencidas]
    UpdateStatus --> End([Fim do CRON])
```

## 3.5 Diagrama de Fluxo - Pagamento de Dívida

```mermaid
flowchart TD
    Start([Utilizador Clica 'Pagar Dívida']) --> Confirm[Modal de Confirmação]
    Confirm --> UserConfirm{Confirmar Pagamento?}
    UserConfirm -->|Não| Cancel([Cancelar])
    UserConfirm -->|Sim| Update[UPDATE dividas SET status='paga', data_pagamento=NOW()]
    Update --> CheckUpdate{UPDATE Bem-Sucedido?}
    CheckUpdate -->|Não| Error[Mostrar Erro]
    Error --> Start
    CheckUpdate -->|Sim| TriggerDB[Trigger DB: notify_payment_completed]
    TriggerDB --> CreateInAppNotif[INSERT notificacoes: tipo='in_app']
    CreateInAppNotif --> GetAdmins[SELECT emails de admins activos]
    GetAdmins --> LoopAdmins{Para Cada Admin}
    LoopAdmins -->|Próximo| BuildEmail[Construir Email de Confirmação]
    BuildEmail --> SendEmail[Invocar: send-email]
    SendEmail --> LogEmail[INSERT notificacoes: tipo='email']
    LogEmail --> LoopAdmins
    LoopAdmins -->|Fim| RealtimeUpdate[Realtime: 'pagamento_confirmado']
    RealtimeUpdate --> UpdateDashboard[Actualizar Dashboard]
    UpdateDashboard --> Toast[Toast: 'Pagamento confirmado!']
    Toast --> End([Fim])
```

## 3.6 Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    CLIENTES ||--o{ DIVIDAS : "possui"
    CLIENTES ||--o{ NOTIFICACOES : "recebe"
    DIVIDAS ||--o{ NOTIFICACOES : "gera"
    PROFILES ||--|| USER_ROLES : "tem"
    PROFILES ||--o{ USER_ACTIVITIES : "realiza"
    
    CLIENTES {
        uuid id PK
        text nome
        text nuit
        text telefone
        text email
        text endereco
        boolean ativo
        timestamp data_registro
        timestamp created_at
        timestamp updated_at
    }
    
    DIVIDAS {
        uuid id PK
        uuid cliente_id FK
        numeric valor
        text descricao
        text status
        date data_vencimento
        timestamp data_criacao
        timestamp data_pagamento
        timestamp created_at
        timestamp updated_at
    }
    
    NOTIFICACOES {
        uuid id PK
        uuid divida_id FK
        uuid cliente_id FK
        text tipo
        text status
        text mensagem
        text erro
        boolean lida
        timestamp data_agendamento
        timestamp data_envio
        timestamp created_at
    }
    
    PROFILES {
        uuid id PK
        uuid user_id FK
        text full_name
        text avatar_url
        text telefone
        text cargo
        text departamento
        text bio
        boolean active
        boolean email_notifications
        boolean sms_notifications
        boolean whatsapp_notifications
        uuid created_by
        timestamp created_at
        timestamp updated_at
    }
    
    USER_ROLES {
        uuid id PK
        uuid user_id FK
        enum role
        timestamp created_at
    }
    
    USER_ACTIVITIES {
        uuid id PK
        uuid user_id FK
        text action_type
        text description
        jsonb metadata
        timestamp created_at
    }
    
    NOTIFICATION_TEMPLATES {
        uuid id PK
        text name
        text type
        text subject
        text body
        boolean is_default
        timestamp created_at
        timestamp updated_at
    }
    
    LOGIN_HISTORY {
        uuid id PK
        uuid user_id FK
        text ip_address
        text user_agent
        text device_info
        text location
        timestamp login_at
    }
```

## 3.7 Diagrama de Caso de Uso

```mermaid
graph TB
    subgraph Sistema
        UC1[Login/Logout]
        UC2[Ver Dashboard]
        UC3[Gerir Clientes]
        UC4[Gerir Dívidas]
        UC5[Marcar Dívida como Paga]
        UC6[Enviar Notificações Manuais]
        UC7[Gerar Relatórios]
        UC8[Ver Notificações]
        UC9[Editar Perfil]
        UC10[Ver Histórico de Actividades]
        UC11[Gerir Utilizadores]
        UC12[Configurar Templates de Notificação]
        UC13[Ver Análises Avançadas]
    end
    
    Admin[👤 Administrador]
    User[👤 Utilizador]
    System[⚙️ Sistema Automático]
    
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
    
    System -.notifica.-> UC8
    System -.actualiza.-> UC2
    
    style Admin fill:#ff6b6b,stroke:#333,stroke-width:2px
    style User fill:#4ecdc4,stroke:#333,stroke-width:2px
    style System fill:#95e1d3,stroke:#333,stroke-width:2px
```

## 3.8 Diagrama de Processo de Notificação Completo

```mermaid
sequenceDiagram
    participant CRON as CRON Job (Diário)
    participant EF as Edge Function<br/>check-debts
    participant DB as PostgreSQL<br/>Database
    participant Trigger as DB Trigger<br/>notify_debt_overdue
    participant Email as Edge Function<br/>send-email
    participant Resend as Resend API
    participant RT as Realtime<br/>Websocket
    participant UI as Frontend UI
    
    Note over CRON,UI: Verificação Automática de Dívidas (00:00 UTC)
    
    CRON->>EF: Invocar check-debts
    activate EF
    
    EF->>DB: SELECT dívidas vencendo em 1 dia
    DB-->>EF: Lista de dívidas
    
    loop Para cada dívida
        EF->>DB: SELECT cliente.email
        DB-->>EF: Email do cliente
        
        alt Cliente tem email
            EF->>Email: Invocar send-email
            activate Email
            Email->>Resend: POST /emails
            Resend-->>Email: Email enviado
            Email-->>EF: Sucesso
            deactivate Email
            
            EF->>DB: INSERT notificacoes (status='enviada')
            DB-->>EF: OK
        else Cliente sem email
            EF->>DB: INSERT notificacoes (status='falha', erro='sem email')
        end
    end
    
    EF->>DB: UPDATE dividas SET status='vencida' WHERE data_vencimento < TODAY
    activate DB
    DB->>Trigger: Trigger: notify_debt_overdue
    activate Trigger
    
    Trigger->>DB: INSERT notificacoes in_app para admins
    Trigger->>DB: SELECT admins com email_notifications=true
    DB-->>Trigger: Lista de admins
    
    loop Para cada admin
        Trigger->>Email: Invocar send-email (alerta vencimento)
        Email->>Resend: POST /emails
        Resend-->>Email: Email enviado
        Email-->>Trigger: Sucesso
        Trigger->>DB: INSERT notificacoes (tipo='email')
    end
    
    Trigger->>RT: pg_notify('divida_vencida')
    deactivate Trigger
    deactivate DB
    
    RT->>UI: WebSocket push: Nova notificação
    activate UI
    UI->>UI: Actualizar badge de notificações
    UI->>UI: Mostrar toast: "Alerta de dívida vencida"
    UI->>UI: Actualizar dashboard
    deactivate UI
    
    deactivate EF
```

## 3.9 Diagrama de Autenticação e Autorização

```mermaid
graph TB
    Start([Utilizador Insere Credenciais]) --> A[Supabase Auth: signInWithPassword]
    
    A --> B{Auth Válida?}
    B -->|Não| Error[Retornar Erro: Invalid Credentials]
    Error --> End1([Fim - Login Falhou])
    
    B -->|Sim| C[Gerar JWT Token]
    C --> D[Armazenar Token no localStorage]
    D --> E[Incluir Token em Auth Header]
    
    E --> F[Request para Supabase API]
    F --> G[Middleware: Verificar JWT]
    
    G --> H{Token Válido?}
    H -->|Não| Unauth[401 Unauthorized]
    Unauth --> End2([Fim - Acesso Negado])
    
    H -->|Sim| I[Extrair user_id do JWT]
    I --> J[RLS Policy: Verificar Permissões]
    
    J --> K{Tem Permissão?}
    K -->|Não| Forbidden[403 Forbidden]
    Forbidden --> End3([Fim - Sem Permissão])
    
    K -->|Sim| L[Verificar Role na Tabela user_roles]
    L --> M{Operação Requer Admin?}
    
    M -->|Sim| N{user.role == 'admin'?}
    N -->|Não| Forbidden
    N -->|Sim| Success[200 OK - Executar Operação]
    
    M -->|Não| Success
    Success --> End4([Fim - Sucesso])
    
    subgraph "Row Level Security (RLS)"
        J
        K
        L
        M
        N
    end
    
    style A fill:#3ecf8e,stroke:#333,stroke-width:2px
    style J fill:#ffd93d,stroke:#333,stroke-width:2px
    style Success fill:#6bcf7f,stroke:#333,stroke-width:2px
    style Error fill:#ff6b6b,stroke:#333,stroke-width:2px
    style Unauth fill:#ff6b6b,stroke:#333,stroke-width:2px
    style Forbidden fill:#ff6b6b,stroke:#333,stroke-width:2px
```

## 3.10 Diagrama de Arquitectura de Dados (Tabelas e Relações)

```mermaid
graph LR
    subgraph "Autenticação Supabase (Schema: auth)"
        U[auth.users]
    end
    
    subgraph "Schema Público (public)"
        P[profiles]
        UR[user_roles]
        UA[user_activities]
        LH[login_history]
        C[clientes]
        D[dividas]
        N[notificacoes]
        NT[notification_templates]
    end
    
    U -.user_id.-> P
    U -.user_id.-> UR
    U -.user_id.-> UA
    U -.user_id.-> LH
    
    C -->|1:N| D
    C -->|1:N| N
    D -->|1:N| N
    
    P -->|1:1| UR
    P -->|1:N| UA
    
    style U fill:#ffd93d,stroke:#333,stroke-width:2px
    style P fill:#61dafb,stroke:#333,stroke-width:2px
    style UR fill:#ff6b6b,stroke:#333,stroke-width:2px
    style D fill:#4ecdc4,stroke:#333,stroke-width:2px
```

---

# REGRAS DE NEGÓCIO E FLUXOS INTERNOS

## 4.1 Regras de Validação

### Clientes
- Nome é **obrigatório** (não pode ser vazio)
- NUIT deve ter **9 dígitos** (se preenchido)
- Email deve ter **formato válido** (se preenchido)
- Telefone deve ter **formato internacional** +258XXXXXXXXX (se preenchido)
- Cliente só pode ser **apagado** se não tiver dívidas associadas

### Dívidas
- Cliente é **obrigatório**
- Valor deve ser **maior que 0**
- Data de vencimento deve ser **data futura**
- Descrição é **obrigatória** (não pode ser vazia)
- Status pode ser: `pendente`, `vencida`, `paga`
- Data de pagamento é **auto-preenchida** quando status muda para "paga"

### Utilizadores
- Email é **único** (não pode haver duplicados)
- Email deve ter **formato válido**
- Senha deve ter **mínimo 8 caracteres**
- Role pode ser: `admin` ou `user`
- Utilizador inactivo **não pode fazer login**

### Notificações
- Tipo pode ser: `email`, `whatsapp`, `sms`, `in_app`
- Status pode ser: `pendente`, `enviada`, `falha`
- Data de agendamento é **obrigatória**
- Se status é "falha", campo `erro` deve ser preenchido

## 4.2 Regras de Autorização (RLS Policies)

### Tabela: clientes
- **SELECT**: Qualquer utilizador autenticado
- **INSERT**: Qualquer utilizador autenticado
- **UPDATE**: Qualquer utilizador autenticado
- **DELETE**: Apenas administradores

### Tabela: dividas
- **SELECT**: Qualquer utilizador autenticado
- **INSERT**: Qualquer utilizador autenticado
- **UPDATE**: Qualquer utilizador autenticado
- **DELETE**: Apenas administradores

### Tabela: profiles
- **SELECT**: Qualquer utilizador autenticado
- **INSERT**: Apenas administradores
- **UPDATE**: Apenas administradores
- **DELETE**: Apenas administradores

### Tabela: user_roles
- **SELECT**: Próprio utilizador OU administrador
- **INSERT**: Apenas administradores
- **UPDATE**: Apenas administradores
- **DELETE**: Apenas administradores

### Tabela: user_activities
- **SELECT**: Apenas próprias actividades
- **INSERT**: Qualquer utilizador autenticado (automático)
- **UPDATE**: Ninguém
- **DELETE**: Ninguém

### Tabela: notificacoes
- **SELECT**: Qualquer utilizador autenticado
- **INSERT**: Sistema (automático)
- **UPDATE**: Sistema (automático)
- **DELETE**: Apenas administradores

### Tabela: notification_templates
- **SELECT**: Apenas administradores
- **INSERT**: Apenas administradores
- **UPDATE**: Apenas administradores
- **DELETE**: Apenas administradores

## 4.3 Lógica de Negócio Automatizada

### Actualização Automática de Status de Dívidas
**Trigger**: CRON Diário (00:00 UTC)
**Acção**: 
```sql
UPDATE dividas 
SET status = 'vencida' 
WHERE data_vencimento < CURRENT_DATE 
  AND status = 'pendente';
```

### Notificação de Lembrete (1 Dia Antes)
**Trigger**: CRON Diário (00:00 UTC)
**Condição**: `data_vencimento = CURRENT_DATE + INTERVAL '1 day'`
**Acção**:
1. Buscar dívidas que vencem amanhã
2. Para cada dívida:
   - Verificar se cliente tem email
   - Enviar email de lembrete via Resend
   - Criar notificação in-app para admins
   - Registar envio na tabela `notificacoes`

### Notificação de Pagamento Confirmado
**Trigger**: Quando `dividas.status` muda para "paga"
**Acção** (Trigger DB: `notify_payment_completed`):
1. Criar notificação in-app para todos os utilizadores
2. Buscar emails de administradores activos
3. Enviar email de confirmação para cada admin
4. Registar envios na tabela `notificacoes`

### Notificação de Dívida Vencida
**Trigger**: Quando `dividas.status` muda para "vencida"
**Acção** (Trigger DB: `notify_debt_overdue`):
1. Calcular dias de atraso
2. Criar notificação in-app para admins
3. Buscar emails de administradores activos
4. Enviar email de alerta para cada admin
5. Registar envios na tabela `notificacoes`

### Realtime Updates
**Eventos Monitorizados**:
- `novo_cliente`: Quando cliente é inserido
- `cliente_atualizado`: Quando cliente é actualizado
- `nova_divida`: Quando dívida é inserida
- `divida_atualizada`: Quando dívida é actualizada
- `pagamento_confirmado`: Quando dívida é paga
- `divida_vencida`: Quando dívida vence

**Acção no Frontend**:
- Actualizar lista de clientes
- Actualizar lista de dívidas
- Actualizar dashboard
- Mostrar toast de notificação
- Actualizar badge de notificações

## 4.4 Configurações Edge Functions

### Edge Function: send-email
**Rota**: `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/send-email`
**Método**: POST
**Auth**: JWT não necessário (`verify_jwt = false`)
**Body**:
```json
{
  "to": "email@exemplo.com",
  "subject": "Assunto do Email",
  "message": "Corpo do email em texto"
}
```
**Response**:
```json
{
  "success": true,
  "id": "email_id_resend"
}
```

### Edge Function: check-debts
**Rota**: `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/check-debts`
**Método**: POST (invocado por CRON)
**Auth**: Service Role Key
**Body**: Não necessário
**Acção**:
1. Verificar dívidas a vencer em 1 dia
2. Enviar emails de lembrete
3. Actualizar status de dívidas vencidas
4. Registar notificações

### Edge Function: log-login
**Rota**: `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/log-login`
**Método**: POST
**Auth**: JWT não necessário (`verify_jwt = false`)
**Body**:
```json
{
  "userId": "uuid",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```
**Acção**: Insere registo na tabela `login_history`

### Edge Function: create-user
**Rota**: `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/create-user`
**Método**: POST
**Auth**: JWT necessário (apenas admin)
**Body**:
```json
{
  "email": "novo@email.com",
  "password": "senha",
  "full_name": "Nome Completo",
  "role": "user"
}
```
**Acção**:
1. Criar utilizador no Supabase Auth
2. Criar perfil na tabela `profiles`
3. Atribuir role na tabela `user_roles`

### Edge Function: create-admin
**Rota**: `https://vmgrnkuhprxowcvydnvm.supabase.co/functions/v1/create-admin`
**Método**: POST
**Auth**: JWT não necessário (`verify_jwt = false`)
**Nota**: Apenas para setup inicial, desactivar em produção

---

# ANEXOS

## A. Lista Completa de Componentes UI (shadcn)

O sistema utiliza 50+ componentes do shadcn/ui:
- accordion
- alert-dialog
- alert
- aspect-ratio
- avatar
- badge
- breadcrumb
- button
- calendar
- card
- carousel
- checkbox
- collapsible
- command
- context-menu
- dialog
- drawer
- dropdown-menu
- form
- hover-card
- input-otp
- input
- label
- menubar
- navigation-menu
- pagination
- popover
- progress
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- sidebar
- skeleton
- slider
- sonner (toast)
- switch
- table
- tabs
- textarea
- toast
- toaster
- toggle-group
- toggle
- tooltip

## B. Variáveis de Ambiente Completas

```env
# Frontend (.env na raiz)
VITE_SUPABASE_PROJECT_ID="vmgrnkuhprxowcvydnvm"
VITE_SUPABASE_URL="https://vmgrnkuhprxowcvydnvm.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZ3Jua3VocHJ4b3djdnlkbnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTc5NDcsImV4cCI6MjA3MjI5Mzk0N30.q2wxy651XYiuQzJny06bL1Xlp337KCD5rBIp-YGQxxQ"

# Backend (Secrets Supabase)
SUPABASE_URL="https://vmgrnkuhprxowcvydnvm.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.vmgrnkuhprxowcvydnvm.supabase.co:5432/postgres"
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

## C. Scripts NPM Disponíveis

```json
{
  "scripts": {
    "dev": "vite",                     // Iniciar servidor de desenvolvimento
    "build": "vite build",             // Build de produção
    "build:dev": "vite build --mode development", // Build de desenvolvimento
    "lint": "eslint .",                // Verificar erros de linting
    "preview": "vite preview"          // Pré-visualizar build de produção
  }
}
```

## D. Estrutura de Ficheiros de Configuração

```
projeto/
├── .env                      # Variáveis de ambiente (não versionar)
├── .gitignore                # Ficheiros ignorados pelo Git
├── package.json              # Dependências e scripts
├── package-lock.json         # Lock de dependências
├── tsconfig.json             # Configuração TypeScript
├── tsconfig.app.json         # Config TS para app
├── tsconfig.node.json        # Config TS para Node
├── vite.config.ts            # Configuração Vite
├── tailwind.config.ts        # Configuração TailwindCSS
├── postcss.config.js         # Configuração PostCSS
├── components.json           # Configuração shadcn/ui
├── eslint.config.js          # Configuração ESLint
├── index.html                # HTML raiz
├── supabase/
│   ├── config.toml           # Configuração Supabase
│   ├── functions/            # Edge Functions
│   │   ├── send-email/
│   │   │   └── index.ts
│   │   ├── check-debts/
│   │   │   └── index.ts
│   │   ├── log-login/
│   │   │   └── index.ts
│   │   └── create-user/
│   │       └── index.ts
│   └── migrations/           # Migrações SQL
└── README.md                 # Documentação do projeto
```

---

# CONCLUSÃO DA DOCUMENTAÇÃO TÉCNICA

Este documento fornece uma visão completa e detalhada do **Sistema de Gestão de Dívidas da Ncangaza Multiservices**, incluindo:

✅ Manual de instalação passo-a-passo com todos os requisitos e comandos necessários
✅ Manual do utilizador com guias completos para cada funcionalidade
✅ Diagramas técnicos de arquitetura, fluxos, autenticação e base de dados
✅ Regras de negócio e lógica de automatização
✅ Detalhes de implementação e configuração
✅ Estrutura completa de ficheiros e pastas

Esta documentação serve como base para:
- **Instalação e configuração** do sistema em novos ambientes
- **Treinamento de utilizadores** finais (admin e user)
- **Desenvolvimento futuro** e manutenção
- **Apresentação académica** em monografia

**Autor**: [Teu Nome]
**Data**: 21 de Novembro de 2025
**Versão do Sistema**: 1.0.0
**Empresa**: Ncangaza Multiservices Lda.
