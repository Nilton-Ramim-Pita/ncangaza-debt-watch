import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";

// Simulação de conteúdo de documentação (substitua pelo seu conteúdo real)
const documentacaoContent = `# Documentação Técnica Completa
Sistema de Gestão de Dívidas

## 1. Introdução

Este documento apresenta a documentação técnica completa do Sistema de Gestão de Dívidas desenvolvido para Ncangaza Multiservices.

### 1.1 Objetivo do Sistema

O sistema tem como objetivo principal automatizar e otimizar o processo de gestão de dívidas, proporcionando:
- Controle eficiente de clientes e suas dívidas
- Rastreamento de pagamentos e histórico financeiro
- Geração de relatórios e análises
- Notificações automáticas

## 2. Arquitetura do Sistema

### 2.1 Visão Geral

O sistema utiliza uma arquitetura moderna baseada em:
- **Frontend**: React com TypeScript
- **Backend**: Node.js/Express
- **Banco de Dados**: PostgreSQL/MySQL
- **Autenticação**: JWT (JSON Web Tokens)

### 2.2 Componentes Principais

#### 2.2.1 Módulo de Clientes
- Cadastro de clientes
- Gerenciamento de informações
- Histórico de transações

#### 2.2.2 Módulo de Dívidas
- Registro de dívidas
- Controle de vencimentos
- Cálculo de juros e multas

#### 2.2.3 Módulo de Pagamentos
- Processamento de pagamentos
- Registro de recebimentos
- Conciliação bancária

## 3. Tecnologias Utilizadas

### 3.1 Frontend
- React 18+
- TypeScript
- TailwindCSS
- Shadcn/ui
- React Router

### 3.2 Backend
- Node.js
- Express
- Prisma ORM
- JWT Authentication

### 3.3 Banco de Dados
- PostgreSQL
- Redis (cache)

## 4. Funcionalidades

### 4.1 Gestão de Clientes
\`\`\`typescript
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  dataCadastro: Date;
}
\`\`\`

### 4.2 Gestão de Dívidas
\`\`\`typescript
interface Divida {
  id: string;
  clienteId: string;
  valor: number;
  dataVencimento: Date;
  status: 'pendente' | 'paga' | 'vencida';
  juros: number;
  multa: number;
}
\`\`\`

### 4.3 Processamento de Pagamentos
\`\`\`typescript
interface Pagamento {
  id: string;
  dividaId: string;
  valor: number;
  dataPagamento: Date;
  metodoPagamento: string;
  comprovante?: string;
}
\`\`\`

## 5. APIs e Endpoints

### 5.1 Clientes
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/clientes | Lista todos os clientes |
| GET | /api/clientes/:id | Busca cliente por ID |
| POST | /api/clientes | Cria novo cliente |
| PUT | /api/clientes/:id | Atualiza cliente |
| DELETE | /api/clientes/:id | Remove cliente |

### 5.2 Dívidas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/dividas | Lista todas as dívidas |
| GET | /api/dividas/:id | Busca dívida por ID |
| POST | /api/dividas | Cria nova dívida |
| PUT | /api/dividas/:id | Atualiza dívida |
| DELETE | /api/dividas/:id | Remove dívida |

## 6. Segurança

### 6.1 Autenticação
- Sistema de login com JWT
- Tokens com expiração configurável
- Refresh tokens para sessões longas

### 6.2 Autorização
- Controle de acesso baseado em roles
- Permissões granulares por módulo
- Auditoria de ações

### 6.3 Proteção de Dados
- Criptografia de senhas (bcrypt)
- HTTPS obrigatório
- Validação de inputs
- Proteção contra SQL Injection
- Sanitização de dados

## 7. Testes

### 7.1 Testes Unitários
- Jest para testes de componentes
- Cobertura mínima de 80%

### 7.2 Testes de Integração
- Testes de API com Supertest
- Validação de fluxos completos

### 7.3 Testes E2E
- Playwright para testes end-to-end
- Cenários críticos cobertos

## 8. Deployment

### 8.1 Ambiente de Produção
- Deploy automatizado via CI/CD
- Docker containers
- Kubernetes para orquestração

### 8.2 Monitoramento
- Logs centralizados
- Métricas de performance
- Alertas automáticos

## 9. Manutenção

### 9.1 Backup
- Backup automático diário
- Retenção de 30 dias
- Testes de restauração mensais

### 9.2 Atualizações
- Versionamento semântico
- Changelog detalhado
- Processo de rollback

## 10. Conclusão

Este sistema foi desenvolvido seguindo as melhores práticas de engenharia de software, garantindo escalabilidade, segurança e manutenibilidade.

---

**Autor**: Nilton Ramim Pita
**Instituição**: Universidade Católica de Moçambique (UCM)
**Data**: ${new Date().getFullYear()}
`;

export const DocumentacaoTecnica = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string, type: "success" | "error" | "info") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const generatePDF = () => {
    if (!contentRef.current) {
      showMessage("Erro: conteúdo não encontrado", "error");
      return;
    }

    setIsGenerating(true);
    showMessage("Preparando documento para impressão...", "info");

    // Simular processo de geração
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
      showMessage("Use Ctrl+P ou Cmd+P para salvar como PDF", "success");
    }, 500);
  };

  const processContent = () => {
    let processed = documentacaoContent;

    // Processar código
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<pre class="code-block"><code class="language-${lang || "text"}">${escaped}</code></pre>`;
    });

    // Processar tabelas
    processed = processed.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)*)/g, (match) => {
      const lines = match.trim().split("\n");
      const headers = lines[0]
        .split("|")
        .filter((h) => h.trim())
        .map((h) => h.trim());
      const rows = lines.slice(2).map((line) =>
        line
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim()),
      );

      let html = '<table class="doc-table"><thead><tr>';
      headers.forEach((h) => (html += `<th>${h}</th>`));
      html += "</tr></thead><tbody>";
      rows.forEach((row) => {
        html += "<tr>";
        row.forEach((cell) => (html += `<td>${cell}</td>`));
        html += "</tr>";
      });
      html += "</tbody></table>";
      return html;
    });

    // Processar títulos
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="doc-h1">$1</h1>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
    processed = processed.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');

    // Processar listas
    processed = processed.replace(/^- (.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/(<li class="doc-li">.*<\/li>\n?)+/g, '<ul class="doc-ul">$&</ul>');

    // Processar negrito e itálico
    processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Processar parágrafos
    processed = processed.replace(/^(?!<[^>]+>)(.+)$/gm, '<p class="doc-p">$1</p>');

    return processed;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .documentation-content {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
          }
        }

        .documentation-content {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: 'Times New Roman', serif;
          color: #000;
        }

        .doc-h1 {
          font-size: 28px;
          font-weight: bold;
          margin-top: 30px;
          margin-bottom: 20px;
          color: #1a1a1a;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }

        .doc-h2 {
          font-size: 24px;
          font-weight: bold;
          margin-top: 25px;
          margin-bottom: 15px;
          color: #2a2a2a;
        }

        .doc-h3 {
          font-size: 20px;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 12px;
          color: #3a3a3a;
        }

        .doc-h4 {
          font-size: 18px;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 10px;
          color: #4a4a4a;
        }

        .doc-p {
          font-size: 12pt;
          line-height: