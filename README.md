# 🏢 Sistema de Gestão de Dívidas - Ncangaza Multiservices Lda

Sistema web completo para gestão de dívidas com notificações automáticas, desenvolvido para a **Ncangaza Multiservices Lda** (Tete, Moçambique).

## 📋 Sobre o Projeto

O Sistema de Gestão de Dívidas é uma plataforma moderna e profissional desenvolvida para otimizar o controle financeiro de empresas, oferecendo:

- **Dashboard Executivo**: Visão geral com KPIs e métricas em tempo real
- **Gestão de Clientes**: CRUD completo com histórico de pagamentos
- **Controle de Dívidas**: Acompanhamento detalhado por status e vencimento
- **Notificações Automáticas**: Lembretes via email, SMS e WhatsApp
- **Relatórios Avançados**: Análises exportáveis em PDF e CSV
- **Analytics**: Métricas de desempenho e insights estratégicos

## 🎨 Design System

### Paleta de Cores
Inspirada nas cores da bandeira de Moçambique, adaptada para uso empresarial:

- **Vermelho Principal** (`--primary`): Representa crescimento e prosperidade
- **preto** (`--accent`): Destaque para elementos importantes
- **Status Colors**: 
  - Verde para dívidas pagas
  - Amarelo para pendentes
  - Vermelho para vencidas

### Tipografia e Layout
- Design responsivo e moderno
- Interface intuitiva com navegação clara
- Componentes reutilizáveis baseados em shadcn/ui
- Suporte completo para modo claro e escuro

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool otimizado
- **TailwindCSS** - Styling system
- **shadcn/ui** - Componentes modernos
- **Recharts** - Visualização de dados
- **React Query** - Gerenciamento de estado
- **React Router** - Navegação

### Backend (Supabase)
- **PostgreSQL** - Banco de dados
- **Authentication** - Sistema de usuários
- **Real-time** - Atualizações em tempo real
- **Edge Functions** - Lógica de negócio

## 📊 Funcionalidades Principais

### 🏠 Dashboard
- Cards com métricas principais (total, vencidas, pendentes, pagas)
- Gráficos de evolução mensal
- Distribuição por status (pie chart)
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
- Configuração de horários de envio (8h00 - Maputo)
- Templates personalizáveis
- Múltiplos canais (Email, SMS, WhatsApp)
- Histórico de envios com status

### 📈 Relatórios e Analytics
- Relatórios mensais automatizados
- Análises de performance por período
- Taxa de cobrança e inadimplência
- Métricas de fluxo de caixa
- Insights e recomendações

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional para backend)

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
```

### Variáveis de Ambiente

```env
# Supabase (opcional)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica

# Configurações de Email (para produção)
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha

# APIs de SMS/WhatsApp (para produção)
TWILIO_ACCOUNT_SID=seu_sid
TWILIO_AUTH_TOKEN=seu_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 📱 Responsividade

O sistema foi desenvolvido com **mobile-first approach**, garantindo:

- ✅ Navegação otimizada para dispositivos móveis
- ✅ Tabelas com scroll horizontal em telas pequenas
- ✅ Cards e métricas adaptáveis
- ✅ Menu lateral colapsável
- ✅ Formulários responsivos

## 🔐 Segurança

### Implementações de Segurança
- **Autenticação JWT** com refresh tokens
- **Validação de entrada** com Zod/Joi
- **Sanitização de dados** 
- **Rate limiting** para APIs
- **Proteção CSRF**
- **Headers de segurança**

### Logs de Auditoria
Todas as operações CRUD são registradas com:
- Usuário responsável
- Timestamp da ação
- Tipo de operação
- Entidade modificada
- Dados antes/depois

## 📊 Métricas e Monitoramento

### KPIs Principais
- **Taxa de Cobrança**: % de dívidas quitadas no prazo
- **Inadimplência**: % de dívidas vencidas
- **Tempo Médio de Cobrança**: Dias até pagamento
- **Volume Médio**: Valor médio das dívidas

### Alertas Automáticos
- Dívidas próximas ao vencimento (D-3, D-1)
- Dívidas vencidas (D+1, D+7, D+30)
- Metas não atingidas
- Falhas em notificações

## 🚀 Deploy

### Opções Recomendadas

#### Vercel (Frontend)
```bash
# 1. Instale o Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

#### Supabase (Backend)
```bash
# 1. Instale o Supabase CLI
npm i -g supabase

# 2. Login e link do projeto
supabase login
supabase link --project-ref seu-projeto-id

# 3. Deploy das migrations
supabase db push
```

## 📖 Manual do Usuário

### Acesso ao Sistema
1. Acesse a URL do sistema
2. Faça login com suas credenciais
3. O dashboard principal será exibido

### Cadastro de Clientes
1. Vá para "Clientes" no menu lateral
2. Clique em "Novo Cliente"
3. Preencha os dados obrigatórios:
   - Nome completo
   - NUIT (único)
   - Telefone
   - Email
4. Salve o cadastro

### Registro de Dívidas
1. Acesse "Dívidas" no menu
2. Clique em "Nova Dívida"
3. Selecione o cliente
4. Preencha:
   - Valor da dívida
   - Descrição do serviço
   - Data de vencimento
   - Categoria
5. Confirme o registro

### Acompanhamento
- **Dashboard**: Monitore KPIs em tempo real
- **Relatórios**: Gere análises mensais
- **Notificações**: Configure lembretes automáticos
- **Analytics**: Acompanhe tendências e performance

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: suporte@ncangaza.co.mz
- **Telefone**: +258 87 645 0559
- **Endereço**: Tete, Moçambique

---

**Desenvolvido para Ncangaza Multiservices Lda**  
*Sistema de Gestão de Dívidas - Versão 1.0*

🇲🇿 **Proudly Made in Mozambique**
