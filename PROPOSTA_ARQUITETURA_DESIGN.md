# 3. Proposta de Arquitetura e Desenho do Sistema

## 3.1 Proposta de Arquitetura do Sistema

A arquitectura do Sistema de Gestão de Dívidas da Ncangaza Multiservices foi concebida seguindo o paradigma **cliente-servidor moderno**, com separação clara de responsabilidades entre as diferentes camadas do sistema. Esta abordagem garante escalabilidade, manutenibilidade e segurança no tratamento dos dados financeiros sensíveis da empresa.

### 3.1.1 Estrutura Geral do Sistema

O sistema adopta uma arquitectura de três camadas (Three-Tier Architecture), composta por:

- **Camada de Apresentação (Frontend):** Interface web responsiva desenvolvida em React com TypeScript, responsável pela interacção directa com o utilizador.
- **Camada de Lógica de Negócio (Backend):** Implementada através de Edge Functions serverless (Deno/TypeScript) e políticas de segurança ao nível da base de dados (Row-Level Security), processando as regras de negócio do sistema.
- **Camada de Dados (Base de Dados):** PostgreSQL gerido pelo Supabase, armazenando todos os dados do sistema com integridade referencial e políticas de acesso granulares.

### 3.1.2 Diagrama de Arquitectura do Sistema

```mermaid
graph TB
    subgraph "Camada de Apresentação"
        UI[Interface Web - React/TypeScript]
        TW[TailwindCSS + Shadcn/UI]
        RQ[React Query - Cache e Estado]
    end

    subgraph "Camada de Lógica de Negócio"
        AUTH[Supabase Auth - Autenticação JWT]
        EF[Edge Functions - Deno Runtime]
        RLS[Row-Level Security - Políticas de Acesso]
        RT[Supabase Realtime - WebSockets]
    end

    subgraph "Camada de Dados"
        PG[PostgreSQL - Base de Dados Relacional]
        ST[Supabase Storage - Ficheiros]
    end

    subgraph "Serviços Externos"
        RS[Resend API - Envio de E-mails]
        VR[Vercel - Hospedagem Frontend]
    end

    UI --> AUTH
    UI --> RQ
    RQ --> PG
    UI --> RT
    AUTH --> PG
    EF --> PG
    EF --> RS
    RLS --> PG
    UI --> VR
    TW --> UI
```

### 3.1.3 Interacção entre Componentes

A comunicação entre os componentes do sistema segue o seguinte fluxo:

1. **Utilizador → Interface Web:** O utilizador interage com a aplicação web através do navegador, utilizando componentes React responsivos.
2. **Interface Web → Supabase Auth:** As solicitações de autenticação são processadas pelo Supabase Auth, que gera tokens JWT para sessões seguras.
3. **Interface Web → PostgreSQL:** As consultas de dados são realizadas directamente via API REST do Supabase, protegidas por políticas RLS.
4. **Edge Functions → PostgreSQL:** Operações complexas como criação de utilizadores, envio de notificações e verificação automática de dívidas são processadas por funções serverless.
5. **Edge Functions → Resend API:** O envio de notificações por e-mail é realizado através da integração com o serviço Resend.
6. **Supabase Realtime → Interface Web:** Actualizações em tempo real são transmitidas via WebSockets para manter a interface sincronizada.

### 3.1.4 Tecnologias Utilizadas

| Componente | Tecnologia | Versão | Justificação |
|---|---|---|---|
| Frontend | React | 18.3.1 | Biblioteca líder para interfaces reactivas |
| Linguagem | TypeScript | 5.x | Tipagem estática para maior robustez |
| Estilização | TailwindCSS | 3.x | Framework CSS utilitário para desenvolvimento ágil |
| Componentes UI | Shadcn/UI | Latest | Componentes acessíveis e personalizáveis |
| Estado/Cache | React Query | 5.x | Gestão eficiente de estado servidor |
| Roteamento | React Router | 6.x | Navegação SPA declarativa |
| Base de Dados | PostgreSQL | 15.x | SGBD relacional robusto e maduro |
| Backend | Supabase | 2.x | Plataforma BaaS com Auth, Storage e Realtime |
| Serverless | Deno Edge Functions | Latest | Funções serverless com TypeScript nativo |
| E-mail | Resend API | Latest | Serviço de envio de e-mails transaccionais |
| Hospedagem | Vercel | Latest | Deploy automático com CDN global |
| Gráficos | Recharts | 3.x | Biblioteca de gráficos para React |
| PDF | jsPDF + html2canvas | Latest | Geração de relatórios em PDF |

---

## 3.2 Desenho do Projecto (Design do Sistema)

A fase de desenho do projecto consiste na definição da estrutura arquitectónica do sistema, incluindo os programas de software, a base de dados e os diferentes componentes que permitem o funcionamento do sistema. Nesta fase são apresentados os modelos e diagramas que descrevem o funcionamento do sistema, permitindo compreender de forma clara a sua organização e funcionamento.

### 3.2.1 Desenho da Base de Dados

O desenho da base de dados do sistema seguiu um processo metodológico rigoroso, composto pelas seguintes etapas:

**Etapa 1 – Identificação das Entidades Principais**

A partir da análise de requisitos, foram identificadas as seguintes entidades fundamentais:

- **Clientes** – Representa os clientes da empresa que possuem dívidas.
- **Dívidas** – Regista as obrigações financeiras dos clientes.
- **Notificações** – Armazena as notificações enviadas aos clientes.
- **Perfis de Utilizador** – Contém os dados dos utilizadores do sistema.
- **Papéis de Utilizador** – Define os níveis de acesso (administrador, utilizador).
- **Modelos de Notificação** – Templates para envio de notificações padronizadas.
- **Histórico de Login** – Regista os acessos ao sistema para auditoria.
- **Actividades do Utilizador** – Log de acções realizadas no sistema.

**Etapa 2 – Definição dos Atributos de Cada Entidade**

Cada entidade foi detalhada com os seus respectivos atributos, tipos de dados e restrições, conforme apresentado no Dicionário da Base de Dados abaixo.

**Etapa 3 – Definição dos Relacionamentos**

Os relacionamentos entre as tabelas foram definidos da seguinte forma:

- Um **cliente** pode ter várias **dívidas** (1:N).
- Um **cliente** pode ter várias **notificações** (1:N).
- Uma **dívida** pode ter várias **notificações** (1:N).
- Um **utilizador** (auth.users) tem um **perfil** (1:1).
- Um **utilizador** pode ter vários **papéis** (1:N).
- Um **utilizador** pode ter várias **actividades** (1:N).
- Um **utilizador** pode ter vários registos no **histórico de login** (1:N).

**Etapa 4 – Normalização**

A base de dados foi normalizada até à Terceira Forma Normal (3FN), garantindo:

- **1FN:** Todos os atributos contêm valores atómicos (indivisíveis).
- **2FN:** Todos os atributos não-chave dependem totalmente da chave primária.
- **3FN:** Não existem dependências transitivas entre atributos não-chave.

#### Dicionário da Base de Dados

**Tabela: clientes**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único do cliente | PK |
| nome | TEXT | Variável | Não | - | Nome completo do cliente | - |
| email | TEXT | Variável | Sim | NULL | Endereço de e-mail | - |
| telefone | TEXT | Variável | Sim | NULL | Número de telefone | - |
| nuit | TEXT | Variável | Sim | NULL | Número Único de Identificação Tributária | - |
| endereco | TEXT | Variável | Sim | NULL | Endereço físico do cliente | - |
| ativo | BOOLEAN | 1 | Não | true | Estado do cliente (activo/inactivo) | - |
| data_registro | TIMESTAMPTZ | 8 | Não | now() | Data de registo do cliente | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data de criação do registo | - |
| updated_at | TIMESTAMPTZ | 8 | Não | now() | Data da última actualização | - |

**Tabela: dividas**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único da dívida | PK |
| cliente_id | UUID | 36 | Não | - | Referência ao cliente devedor | FK → clientes.id |
| descricao | TEXT | Variável | Não | - | Descrição da dívida | - |
| valor | NUMERIC | Variável | Não | - | Valor monetário da dívida (MTn) | - |
| status | TEXT | Variável | Não | 'pendente' | Estado: pendente, paga, vencida | - |
| data_criacao | TIMESTAMPTZ | 8 | Não | now() | Data de criação da dívida | - |
| data_vencimento | DATE | 4 | Não | - | Data limite de pagamento | - |
| data_pagamento | TIMESTAMPTZ | 8 | Sim | NULL | Data em que foi efectuado o pagamento | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data de criação do registo | - |
| updated_at | TIMESTAMPTZ | 8 | Não | now() | Data da última actualização | - |

**Tabela: notificacoes**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único da notificação | PK |
| cliente_id | UUID | 36 | Sim | NULL | Referência ao cliente notificado | FK → clientes.id |
| divida_id | UUID | 36 | Sim | NULL | Referência à dívida associada | FK → dividas.id |
| tipo | TEXT | Variável | Não | - | Tipo: email, sms, whatsapp, sistema | - |
| mensagem | TEXT | Variável | Sim | NULL | Conteúdo da notificação | - |
| status | TEXT | Variável | Não | 'pendente' | Estado: pendente, enviada, erro | - |
| lida | BOOLEAN | 1 | Sim | false | Se a notificação foi lida | - |
| data_agendamento | TIMESTAMPTZ | 8 | Não | - | Data agendada para envio | - |
| data_envio | TIMESTAMPTZ | 8 | Sim | NULL | Data efectiva de envio | - |
| erro | TEXT | Variável | Sim | NULL | Mensagem de erro (se houver) | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data de criação do registo | - |

**Tabela: profiles**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único do perfil | PK |
| user_id | UUID | 36 | Não | - | Referência ao utilizador (auth.users) | FK → auth.users.id |
| full_name | TEXT | Variável | Não | - | Nome completo do utilizador | - |
| avatar_url | TEXT | Variável | Sim | NULL | URL da foto de perfil | - |
| telefone | TEXT | Variável | Sim | NULL | Número de telefone | - |
| cargo | TEXT | Variável | Sim | NULL | Cargo na empresa | - |
| departamento | TEXT | Variável | Sim | NULL | Departamento | - |
| bio | TEXT | Variável | Sim | NULL | Biografia do utilizador | - |
| email_notifications | BOOLEAN | 1 | Sim | true | Receber notificações por e-mail | - |
| sms_notifications | BOOLEAN | 1 | Sim | false | Receber notificações por SMS | - |
| whatsapp_notifications | BOOLEAN | 1 | Sim | true | Receber notificações por WhatsApp | - |
| active | BOOLEAN | 1 | Não | true | Estado do utilizador | - |
| created_by | UUID | 36 | Sim | NULL | Quem criou o perfil | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data de criação | - |
| updated_at | TIMESTAMPTZ | 8 | Não | now() | Data da última actualização | - |

**Tabela: user_roles**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único | PK |
| user_id | UUID | 36 | Não | - | Referência ao utilizador | FK → auth.users.id |
| role | app_role (ENUM) | Variável | Não | - | Papel: admin ou user | - |
| created_at | TIMESTAMPTZ | 8 | Sim | now() | Data de criação | - |

**Tabela: notification_templates**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único | PK |
| name | TEXT | Variável | Não | - | Nome do template | - |
| type | TEXT | Variável | Não | - | Tipo de notificação | - |
| subject | TEXT | Variável | Não | - | Assunto da notificação | - |
| body | TEXT | Variável | Não | - | Corpo da mensagem | - |
| is_default | BOOLEAN | 1 | Sim | false | Se é o template padrão | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data de criação | - |
| updated_at | TIMESTAMPTZ | 8 | Não | now() | Data da última actualização | - |

**Tabela: login_history**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único | PK |
| user_id | UUID | 36 | Não | - | Referência ao utilizador | FK → auth.users.id |
| login_at | TIMESTAMPTZ | 8 | Não | now() | Data e hora do login | - |
| ip_address | TEXT | Variável | Sim | NULL | Endereço IP | - |
| user_agent | TEXT | Variável | Sim | NULL | Navegador utilizado | - |
| device_info | TEXT | Variável | Sim | NULL | Informação do dispositivo | - |
| location | TEXT | Variável | Sim | NULL | Localização estimada | - |

**Tabela: user_activities**

| Campo | Tipo de Dado | Tamanho | Nulo | Padrão | Descrição | Chave |
|---|---|---|---|---|---|---|
| id | UUID | 36 | Não | gen_random_uuid() | Identificador único | PK |
| user_id | UUID | 36 | Não | - | Referência ao utilizador | FK → auth.users.id |
| action_type | TEXT | Variável | Não | - | Tipo de acção realizada | - |
| description | TEXT | Variável | Não | - | Descrição da actividade | - |
| metadata | JSONB | Variável | Sim | NULL | Dados adicionais em JSON | - |
| created_at | TIMESTAMPTZ | 8 | Não | now() | Data da actividade | - |

---

### 3.2.2 Diagrama de Casos de Uso

O Diagrama de Casos de Uso é uma ferramenta de modelação da Linguagem de Modelação Unificada (UML) que descreve as funcionalidades de um sistema do ponto de vista do utilizador. Este diagrama identifica os **actores** (entidades externas que interagem com o sistema) e os **casos de uso** (funcionalidades que o sistema oferece a esses actores).

O objectivo principal do Diagrama de Casos de Uso é apresentar de forma visual e simplificada as interacções entre os utilizadores e o sistema, permitindo identificar claramente quais funcionalidades estão disponíveis para cada tipo de utilizador.

No contexto do Sistema de Gestão de Dívidas da Ncangaza Multiservices, o diagrama identifica dois actores principais:

**Actor 1 – Administrador:**
O administrador possui acesso total ao sistema e pode realizar as seguintes acções:
- Autenticar-se no sistema (Login/Logout).
- Gerir utilizadores (criar, editar, activar/desactivar contas).
- Gerir clientes (adicionar, editar, visualizar, eliminar clientes).
- Gerir dívidas (registar, editar, actualizar estado, eliminar dívidas).
- Configurar e enviar notificações automáticas (e-mail, SMS, WhatsApp).
- Gerar e exportar relatórios financeiros (PDF, CSV, TXT).
- Visualizar o painel de controlo (Dashboard) com indicadores-chave.
- Configurar definições do sistema (temas, preferências, segurança).
- Consultar registos de auditoria e actividades do sistema.

**Actor 2 – Utilizador:**
O utilizador possui acesso limitado e pode realizar as seguintes acções:
- Autenticar-se no sistema (Login/Logout).
- Visualizar clientes e respectivas dívidas.
- Registar e actualizar dívidas.
- Visualizar o painel de controlo com estatísticas.
- Gerar relatórios básicos.
- Gerir o seu perfil pessoal.

```mermaid
graph LR
    ADM(("Administrador"))
    USR(("Utilizador"))

    subgraph "Sistema de Gestao de Dividas"
        direction TB
        UC1["Autenticar no Sistema"]
        UC2["Gerir Clientes"]
        UC3["Gerir Dividas"]
        UC4["Visualizar Dashboard"]
        UC5["Gerar Relatorios"]
        UC6["Gerir Notificacoes"]
        UC7["Gerir Utilizadores"]
        UC8["Configurar Sistema"]
        UC9["Consultar Auditoria"]
        UC10["Gerir Perfil"]
        UC11["Exportar Dados"]
        UC12["Visualizar Estatisticas"]
        UC13["Registar Pagamento"]
        UC14["Enviar Notificacao"]
        UC15["Consultar Historico"]
        UC16["Gerir Templates"]
        UC17["Activar e Desactivar Contas"]
        UC18["Alterar Senha"]
        UC19["Filtrar Dividas por Estado"]
        UC20["Visualizar Logs de Acesso"]
    end

    ADM --- UC1
    ADM --- UC2
    ADM --- UC3
    ADM --- UC4
    ADM --- UC5
    ADM --- UC6
    ADM --- UC7
    ADM --- UC8
    ADM --- UC9
    ADM --- UC10
    ADM --- UC11
    ADM --- UC12
    ADM --- UC13
    ADM --- UC14
    ADM --- UC15
    ADM --- UC16
    ADM --- UC17
    ADM --- UC18
    ADM --- UC19
    ADM --- UC20

    USR --- UC1
    USR --- UC2
    USR --- UC3
    USR --- UC4
    USR --- UC5
    USR --- UC10
    USR --- UC12
    USR --- UC13
    USR --- UC15
    USR --- UC18
    USR --- UC19
```

---

### 3.2.3 DER – Diagrama Entidade-Relacionamento

O Diagrama Entidade-Relacionamento (DER) é uma representação gráfica que descreve a estrutura lógica de uma base de dados. Este diagrama identifica as **entidades** (tabelas), os seus **atributos** (campos) e os **relacionamentos** entre elas, incluindo a cardinalidade (1:1, 1:N, N:M).

A importância do DER na modelação da base de dados reside na sua capacidade de fornecer uma visão clara e organizada da estrutura dos dados, facilitando a comunicação entre os membros da equipa de desenvolvimento e garantindo que a base de dados é implementada de forma consistente e normalizada.

No contexto do Sistema de Gestão de Dívidas, o DER apresenta as entidades fundamentais do sistema e os seus relacionamentos, respeitando as regras de normalização até à Terceira Forma Normal (3FN).

```mermaid
erDiagram
    CLIENTES {
        uuid id PK
        text nome
        text email
        text telefone
        text nuit
        text endereco
        boolean ativo
        timestamptz data_registro
        timestamptz created_at
        timestamptz updated_at
    }

    DIVIDAS {
        uuid id PK
        uuid cliente_id FK
        text descricao
        numeric valor
        text status
        timestamptz data_criacao
        date data_vencimento
        timestamptz data_pagamento
        timestamptz created_at
        timestamptz updated_at
    }

    NOTIFICACOES {
        uuid id PK
        uuid cliente_id FK
        uuid divida_id FK
        text tipo
        text mensagem
        text status
        boolean lida
        timestamptz data_agendamento
        timestamptz data_envio
        text erro
        timestamptz created_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        text full_name
        text avatar_url
        text telefone
        text cargo
        text departamento
        boolean active
        timestamptz created_at
        timestamptz updated_at
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK
        app_role role
        timestamptz created_at
    }

    NOTIFICATION_TEMPLATES {
        uuid id PK
        text name
        text type
        text subject
        text body
        boolean is_default
        timestamptz created_at
        timestamptz updated_at
    }

    LOGIN_HISTORY {
        uuid id PK
        uuid user_id FK
        timestamptz login_at
        text ip_address
        text user_agent
        text device_info
        text location
    }

    USER_ACTIVITIES {
        uuid id PK
        uuid user_id FK
        text action_type
        text description
        jsonb metadata
        timestamptz created_at
    }

    CLIENTES ||--o{ DIVIDAS : "possui"
    CLIENTES ||--o{ NOTIFICACOES : "recebe"
    DIVIDAS ||--o{ NOTIFICACOES : "gera"
    PROFILES ||--o{ USER_ROLES : "tem"
    PROFILES ||--o{ LOGIN_HISTORY : "regista"
    PROFILES ||--o{ USER_ACTIVITIES : "executa"
```

---

### 3.2.4 Diagrama de Classes

O Diagrama de Classes é uma representação estática da estrutura de um sistema orientado a objectos, descrevendo as **classes** do sistema, os seus **atributos** (propriedades), **métodos** (operações) e os **relacionamentos** entre elas (associação, composição, herança).

A importância do Diagrama de Classes no desenvolvimento de sistemas reside na sua capacidade de fornecer uma visão completa da estrutura do código, facilitando a implementação, a manutenção e a reutilização de componentes.

No contexto do Sistema de Gestão de Dívidas, o diagrama de classes representa as principais entidades do domínio e os serviços que operam sobre elas, reflectindo a arquitectura baseada em componentes React com hooks personalizados.

```mermaid
classDiagram
    class Cliente {
        +String id
        +String nome
        +String email
        +String telefone
        +String nuit
        +String endereco
        +Boolean ativo
        +Date dataRegistro
        +criar()
        +editar()
        +desactivar()
        +listar()
    }

    class Divida {
        +String id
        +String clienteId
        +String descricao
        +Number valor
        +String status
        +Date dataCriacao
        +Date dataVencimento
        +Date dataPagamento
        +registar()
        +actualizarStatus()
        +marcarComoPaga()
        +eliminar()
    }

    class Notificacao {
        +String id
        +String clienteId
        +String dividaId
        +String tipo
        +String mensagem
        +String status
        +Boolean lida
        +Date dataAgendamento
        +Date dataEnvio
        +enviar()
        +agendar()
        +marcarComoLida()
    }

    class Utilizador {
        +String id
        +String userId
        +String fullName
        +String email
        +String cargo
        +String departamento
        +Boolean active
        +autenticar()
        +alterarSenha()
        +actualizarPerfil()
    }

    class PapelUtilizador {
        +String id
        +String userId
        +String role
        +atribuirPapel()
        +verificarPermissao()
    }

    class NotificacaoTemplate {
        +String id
        +String name
        +String type
        +String subject
        +String body
        +Boolean isDefault
        +criar()
        +editar()
        +aplicar()
    }

    class Dashboard {
        +Number totalClientes
        +Number totalDividas
        +Number valorTotal
        +Number taxaRecuperacao
        +calcularEstatisticas()
        +gerarGraficos()
    }

    class Relatorio {
        +String tipo
        +String periodo
        +String formato
        +gerar()
        +exportarPDF()
        +exportarCSV()
        +preVisualizar()
    }

    class AuthService {
        +login()
        +logout()
        +verificarSessao()
        +registarLogin()
    }

    Cliente "1" --> "*" Divida : possui
    Cliente "1" --> "*" Notificacao : recebe
    Divida "1" --> "*" Notificacao : gera
    Utilizador "1" --> "*" PapelUtilizador : tem
    Utilizador "1" --> "1" AuthService : utiliza
    NotificacaoTemplate "1" --> "*" Notificacao : aplica
    Dashboard --> Cliente : consulta
    Dashboard --> Divida : consulta
    Relatorio --> Cliente : inclui
    Relatorio --> Divida : inclui
```

---

### 3.2.5 Diagramas de Actividade

O Diagrama de Actividade é um diagrama UML que representa o fluxo de execução das actividades dentro de um processo ou funcionalidade do sistema. Este diagrama utiliza nós de acção, decisão e controlo para descrever a sequência de passos que o sistema executa em resposta a uma acção do utilizador.

Os diagramas de actividade são particularmente úteis para modelar processos de negócio e fluxos de trabalho, permitindo identificar pontos de decisão, processos paralelos e condições de término.

#### 3.2.5.1 Diagrama de Actividade do Login do Sistema

Este diagrama representa o processo completo de autenticação do utilizador no sistema, desde a introdução das credenciais até ao acesso ao painel de controlo.

```mermaid
graph TD
    A([Início]) --> B[Abrir Página de Login]
    B --> C[Introduzir E-mail e Senha]
    C --> D{Campos Preenchidos?}
    D -->|Não| E[Exibir Erro de Validação]
    E --> C
    D -->|Sim| F[Enviar Credenciais ao Supabase Auth]
    F --> G{Credenciais Válidas?}
    G -->|Não| H[Exibir Mensagem de Erro]
    H --> I{Tentativas Excedidas?}
    I -->|Sim| J[Bloquear Temporariamente]
    J --> K([Fim])
    I -->|Não| C
    G -->|Sim| L[Gerar Token JWT]
    L --> M[Registar Login no Histórico]
    M --> N{Utilizador Activo?}
    N -->|Não| O[Exibir Conta Desactivada]
    O --> K
    N -->|Sim| P[Carregar Perfil e Papel]
    P --> Q[Redirecionar ao Dashboard]
    Q --> K
```

#### 3.2.5.2 Diagrama de Actividade do Administrador

Este diagrama ilustra as principais actividades que o administrador pode realizar dentro do sistema.

```mermaid
graph TD
    A([Início]) --> B[Autenticar como Administrador]
    B --> C{Autenticação OK?}
    C -->|Não| D([Fim])
    C -->|Sim| E[Aceder ao Dashboard]
    E --> F{Seleccionar Acção}
    F --> G[Gerir Clientes]
    F --> H[Gerir Dívidas]
    F --> I[Gerir Utilizadores]
    F --> J[Gerar Relatórios]
    F --> K[Configurar Notificações]
    F --> L[Definições do Sistema]

    G --> G1[Adicionar Cliente]
    G --> G2[Editar Cliente]
    G --> G3[Desactivar Cliente]
    G --> G4[Visualizar Lista]

    H --> H1[Registar Dívida]
    H --> H2[Actualizar Estado]
    H --> H3[Marcar como Paga]
    H --> H4[Eliminar Dívida]

    I --> I1[Criar Utilizador]
    I --> I2[Atribuir Papel]
    I --> I3[Desactivar Conta]

    J --> J1[Relatório Mensal]
    J --> J2[Análise de Clientes]
    J --> J3[Exportar PDF/CSV]

    K --> K1[Configurar Templates]
    K --> K2[Enviar Notificações]
    K --> K3[Ver Histórico]

    G1 & G2 & G3 & G4 --> M[Operação Concluída]
    H1 & H2 & H3 & H4 --> M
    I1 & I2 & I3 --> M
    J1 & J2 & J3 --> M
    K1 & K2 & K3 --> M
    L --> M
    M --> F
```

#### 3.2.5.3 Diagrama de Actividade do Sistema de Relatórios

Este diagrama apresenta o processo de geração e visualização de relatórios financeiros no sistema.

```mermaid
graph TD
    A([Início]) --> B[Aceder à Secção de Relatórios]
    B --> C[Seleccionar Tipo de Relatório]
    C --> D[Definir Período]
    D --> E[Seleccionar Filtro de Estado]
    E --> F[Escolher Formato de Saída]
    F --> G{Formato Seleccionado}
    G -->|PDF| H[Preparar Dados para PDF]
    G -->|CSV| I[Preparar Dados para CSV]
    G -->|TXT| J[Preparar Dados para TXT]
    H --> K[Gerar Cabeçalho com Logo]
    K --> L[Criar Tabela de Dados]
    L --> M[Adicionar Resumo Executivo]
    M --> N[Gerar Ficheiro PDF]
    I --> O[Formatar Colunas CSV]
    O --> P[Gerar Ficheiro CSV]
    J --> Q[Formatar Texto]
    Q --> R[Gerar Ficheiro TXT]
    N --> S[Descarregar Ficheiro]
    P --> S
    R --> S
    S --> T{Pré-visualizar?}
    T -->|Sim| U[Abrir Pré-visualização]
    U --> V([Fim])
    T -->|Não| V
```

#### 3.2.5.4 Diagrama de Actividade do Utilizador

Este diagrama mostra as acções que um utilizador comum pode realizar dentro do sistema.

```mermaid
graph TD
    A([Início]) --> B[Autenticar no Sistema]
    B --> C{Login Válido?}
    C -->|Não| D[Exibir Erro]
    D --> B
    C -->|Sim| E[Aceder ao Dashboard]
    E --> F{Seleccionar Acção}
    F --> G[Visualizar Clientes]
    F --> H[Visualizar Dívidas]
    F --> I[Gerar Relatórios]
    F --> J[Gerir Perfil]
    F --> K[Ver Estatísticas]

    G --> G1[Consultar Lista de Clientes]
    G --> G2[Registar Novo Cliente]
    G --> G3[Editar Dados do Cliente]

    H --> H1[Consultar Dívidas]
    H --> H2[Registar Nova Dívida]
    H --> H3[Actualizar Estado da Dívida]

    I --> I1[Seleccionar Parâmetros]
    I1 --> I2[Gerar e Descarregar]

    J --> J1[Editar Informações Pessoais]
    J --> J2[Alterar Senha]
    J --> J3[Preferências de Notificação]

    G1 & G2 & G3 --> L[Operação Concluída]
    H1 & H2 & H3 --> L
    I2 --> L
    J1 & J2 & J3 --> L
    K --> L
    L --> F
```

---

### 3.2.6 Diagramas de Sequência

O Diagrama de Sequência é um diagrama UML que representa a interacção entre os diferentes componentes (objectos) do sistema ao longo do tempo. Este diagrama mostra a ordem cronológica das mensagens trocadas entre os participantes, incluindo solicitações, respostas e eventos assíncronos.

A importância do Diagrama de Sequência reside na sua capacidade de detalhar o comportamento dinâmico do sistema, mostrando exactamente como os componentes colaboram para executar uma funcionalidade específica.

#### 3.2.6.1 Diagrama de Sequência do Login

Este diagrama mostra a sequência de interacções entre o utilizador, a interface web, o serviço de autenticação (Supabase Auth) e a base de dados durante o processo de autenticação.

```mermaid
sequenceDiagram
    actor U as Utilizador
    participant FE as Interface Web (React)
    participant SA as Supabase Auth
    participant BD as PostgreSQL
    participant LH as Login History

    U->>FE: Introduzir e-mail e senha
    FE->>FE: Validar campos obrigatórios
    FE->>SA: signInWithPassword(email, password)
    SA->>SA: Verificar credenciais
    alt Credenciais inválidas
        SA-->>FE: Erro de autenticação
        FE-->>U: Exibir mensagem de erro
    else Credenciais válidas
        SA->>SA: Gerar token JWT
        SA-->>FE: Sessão autenticada + token
        FE->>BD: Consultar perfil (profiles)
        BD-->>FE: Dados do perfil
        FE->>BD: Consultar papel (user_roles)
        BD-->>FE: Papel do utilizador
        FE->>LH: Registar login (Edge Function)
        LH->>BD: Inserir registo de login
        FE->>FE: Armazenar sessão
        FE-->>U: Redirecionar ao Dashboard
    end
```

#### 3.2.6.2 Diagrama de Sequência do Sistema

Este diagrama mostra a interacção geral entre os componentes do sistema durante o funcionamento das principais funcionalidades, incluindo a gestão de dívidas, envio de notificações e geração de relatórios.

```mermaid
sequenceDiagram
    actor ADM as Administrador
    participant FE as Frontend (React)
    participant RQ as React Query (Cache)
    participant API as Supabase REST API
    participant RLS as Row-Level Security
    participant BD as PostgreSQL
    participant EF as Edge Functions
    participant EM as Resend (E-mail)

    Note over ADM, EM: Fluxo de Registo de Dívida com Notificação

    ADM->>FE: Registar nova dívida
    FE->>FE: Validar formulário (Zod)
    FE->>API: INSERT divida
    API->>RLS: Verificar política de acesso
    RLS->>BD: Executar INSERT
    BD-->>API: Dívida criada (id)
    API-->>RQ: Invalidar cache de dívidas
    RQ-->>FE: Actualizar interface

    FE->>EF: Enviar notificação ao cliente
    EF->>BD: Consultar dados do cliente
    BD-->>EF: E-mail e nome do cliente
    EF->>EM: Enviar e-mail de notificação
    EM-->>EF: Confirmação de envio
    EF->>BD: Registar notificação enviada
    EF-->>FE: Notificação enviada com sucesso
    FE-->>ADM: Exibir confirmação

    Note over ADM, EM: Fluxo de Geração de Relatório

    ADM->>FE: Solicitar relatório PDF
    FE->>API: SELECT dívidas com filtros
    API->>RLS: Verificar permissões
    RLS->>BD: Executar consulta
    BD-->>API: Dados filtrados
    API-->>FE: Lista de dívidas
    FE->>FE: Gerar PDF (jsPDF)
    FE-->>ADM: Descarregar PDF
```

---

## 3.3 Considerações sobre Segurança da Arquitectura

O sistema implementa múltiplas camadas de segurança:

- **Autenticação JWT:** Todos os pedidos são autenticados com tokens JSON Web Token gerados pelo Supabase Auth.
- **Row-Level Security (RLS):** Políticas de segurança ao nível das linhas da base de dados garantem que cada utilizador acede apenas aos dados autorizados.
- **Controlo de Acesso Baseado em Papéis (RBAC):** Funções como `has_role()` verificam as permissões do utilizador antes de permitir operações sensíveis.
- **Validação de Dados:** A biblioteca Zod é utilizada no frontend para validação rigorosa de todos os dados de entrada.
- **Auditoria:** Todas as acções relevantes são registadas nas tabelas `user_activities` e `login_history` para rastreabilidade.

## 3.4 Considerações sobre Desempenho

- **React Query:** Implementa cache inteligente com invalidação automática, reduzindo consultas desnecessárias à base de dados.
- **Lazy Loading:** Componentes pesados são carregados sob demanda, melhorando o tempo de carregamento inicial.
- **Índices de Base de Dados:** Campos frequentemente consultados possuem índices para optimizar o desempenho das consultas.
- **Edge Functions:** Funções serverless executam operações pesadas no servidor, reduzindo a carga no cliente.
