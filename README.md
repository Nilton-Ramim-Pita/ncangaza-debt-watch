# 🏢 Sistema de Gestão de Dívidas - Ncangaza Multiservices Lda

Sistema web completo para gestão de dívidas com **notificações automáticas por email e in-app**, desenvolvido para a **Ncangaza Multiservices Lda** (Tete, Moçambique).

---

## 📋 Sobre o Projeto

O **Sistema de Gestão de Dívidas** é uma plataforma moderna e profissional desenvolvida para otimizar o controlo financeiro de empresas, oferecendo:

- **Dashboard Executivo**: visão geral com KPIs e métricas em tempo real  
- **Gestão de Clientes**: CRUD completo com histórico de pagamentos  
- **Controle de Dívidas**: acompanhamento detalhado por status e vencimento  
- **Notificações Automáticas**: lembretes via **email** e **in-app**  
- **Gestão de Usuários**: painel administrativo para criação e atribuição de permissões  
- **Relatórios Avançados**: análises exportáveis em PDF e CSV  
- **Analytics**: métricas de desempenho e insights estratégicos  

---

## 🎨 Design System

### Paleta de Cores
Inspirada nas cores da bandeira de Moçambique, adaptada para uso empresarial:

- **Vermelho Principal** (`--primary`): representa crescimento e prosperidade  
- **Preto** (`--accent`): destaque para elementos importantes  

**Status Colors:**  
🟢 Dívidas pagas | 🟡 Pendentes | 🔴 Vencidas  

### Tipografia e Layout
- Design responsivo e moderno  
- Interface intuitiva com navegação clara  
- Componentes reutilizáveis baseados em **shadcn/ui**  
- Suporte completo para **modo claro e escuro**

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript**  
- **Vite** – Build tool otimizado  
- **TailwindCSS** – Styling system  
- **shadcn/ui** – Componentes modernos  
- **Recharts** – Visualização de dados  
- **React Query** – Gerenciamento de estado  
- **React Router** – Navegação  

### Backend (Supabase)
- **PostgreSQL** – Banco de dados  
- **Authentication** – Sistema de usuários  
- **Real-time** – Atualizações em tempo real  
- **Edge Functions** – Lógica de negócio  

---

## 📊 Funcionalidades Principais

### 🏠 Dashboard
- Cards com métricas principais (total, vencidas, pendentes, pagas)  
- Gráficos de evolução mensal e distribuição por status  
- Lista de dívidas recentes com alertas visuais  

### 👥 Gestão de Clientes
- Cadastro completo com NUIT e dados de contato  
- Histórico de dívidas por cliente  
- Status ativo/inativo  
- Busca avançada por nome, NUIT ou email  

### 💰 Controle de Dívidas
- CRUD completo de dívidas  
- Filtros por status, cliente e data  
- Alertas visuais para vencimentos próximos  
- Categorização por tipo de serviço  

### 🔔 Sistema de Notificações
- Notificações automáticas por **email** e **in-app**  
- Configuração de horários de envio (08h00 - Maputo)  
- Templates personalizáveis  
- Histórico de envios com status  

### 🧑‍💼 Gestão de Usuários (Admin)
- Painel exclusivo para o administrador  
- Criação, edição e remoção de usuários  
- Definição de permissões e níveis de acesso  
- Logs de atividades administrativas  

### 📈 Relatórios e Analytics
- Relatórios mensais automatizados  
- Análises de performance por período  
- Taxa de cobrança, inadimplência e fluxo de caixa  
- Insights e recomendações estratégicas  

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
- **Node.js 18+**  
- **npm** ou **yarn**  
- **Conta no Supabase** (opcional para backend)  

### Instalação Local

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd sistema-gestao-dividas

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# 4. Execute o projeto
npm run dev
