import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import { generatePdfFromHtml } from '@/utils/htmlToPdfGenerator';
import relatorioContent from '../../../RELATORIO_TECNICO_SISTEMA.md?raw';
import './documentation-styles.css';
import logoImage from '@/assets/logo-ncangaza-full.png';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// Extrai os títulos mantendo a numeração original do markdown
const buildTOCHtml = (content: string) => {
  const lines = content.split('\n');
  const items: { level: number; title: string }[] = [];

  lines.forEach((line) => {
    const match = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const rawTitle = match[2].trim();
      items.push({ level, title: rawTitle });
    }
  });

  if (!items.length) {
    return '<p class="doc-p">Índice não disponível.</p>';
  }

  return items
    .map(
      (item) =>
        `<div class="toc-item toc-level-${item.level}">${item.title}</div>`
    )
    .join('');
};

export function RelatorioTecnico() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    renderMermaidDiagrams();
  }, []);

  const renderMermaidDiagrams = async () => {
    try {
      const mermaidElements = document.querySelectorAll('.mermaid-diagram');
      
      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i] as HTMLElement;
        const code = element.textContent || '';
        
        try {
          const { svg } = await mermaid.render(`mermaid-${i}`, code);
          element.innerHTML = `<div class="mermaid-rendered">${svg}</div>`;
        } catch (error) {
          console.error('Erro ao renderizar diagrama Mermaid:', error);
          element.innerHTML = `<div class="error-diagram">Erro ao renderizar diagrama</div>`;
        }
      }
      
      setIsRendered(true);
    } catch (error) {
      console.error('Erro geral ao renderizar diagramas:', error);
      setIsRendered(true);
    }
  };

  const generatePDF = async () => {
    if (!contentRef.current || !isRendered) {
      toast.error('Aguarde a renderização completa...');
      return;
    }

    setIsGeneratingPDF(true);
    toast.info('A gerar PDF profissional... Isso pode levar alguns minutos.');

    try {
      await generatePdfFromHtml(contentRef.current, {
        filename: 'Relatorio_Tecnico_Sistema_Gestao_Dividas_Nilton_Ramim_Pita',
        scale: 2,
        quality: 0.95,
        orientation: 'portrait',
      });
    } catch (error) {
      // Erro já tratado na função utilitária
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const processContent = (content: string) => {
    let processed = content;

    // Process Mermaid diagrams
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return `<div class="mermaid-diagram avoid-break">${code}</div>`;
    });

    // Process code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="code-block avoid-break"><pre><code class="language-${lang || 'text'}">${code}</code></pre></div>`;
    });

    // Process tables
    processed = processed.replace(/\n\|(.*?)\|\n\|([-:\s|]+)\|\n((?:\|.*?\|\n)+)/g, (match, header, separator, rows) => {
      const headers = header.split('|').filter(Boolean).map((h: string) => h.trim());
      const rowData = rows.trim().split('\n').map((row: string) => 
        row.split('|').filter(Boolean).map((cell: string) => cell.trim())
      );

      let table = '<table class="doc-table avoid-break"><thead><tr>';
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`;
      });
      table += '</tr></thead><tbody>';
      
      rowData.forEach((row: string[]) => {
        table += '<tr>';
        row.forEach((cell: string) => {
          table += `<td>${cell}</td>`;
        });
        table += '</tr>';
      });
      
      table += '</tbody></table>';
      return table;
    });

    // Process headings - mantém numeração original do markdown
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="doc-h1 page-break-before">$1</h1>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
    processed = processed.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');

    // Process lists
    processed = processed.replace(/^\d+\.\s+(.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/^[-*]\s+(.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/(<li class="doc-li">.*<\/li>)/s, '<ul class="doc-ul">$1</ul>');

    // Process bold and italic
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Process paragraphs
    processed = processed.replace(/\n\n(.+?)\n\n/g, '<p class="doc-p">$1</p>');

    return processed;
  };

  const processedContent = processContent(relatorioContent);
  const tocHtml = buildTOCHtml(relatorioContent);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatório Técnico do Sistema</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de Gestão de Dívidas - Ncangaza Multiservices
            </p>
          </div>
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF || !isRendered}
            size="lg"
            className="gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                A gerar PDF...
              </>
            ) : (
              <>
                <FileDown className="h-5 w-5" />
                Gerar PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content with top padding to avoid header overlap */}
      <div className="pt-24 px-4 pb-8">
        <div ref={contentRef} className="documentation-content">
          <section className="cover-page page-break-after">
            <img
              src={logoImage}
              alt="Logotipo Ncangaza Multiservices"
              className="cover-logo"
            />
            <h1 className="cover-title">Relatório Técnico do Sistema de Gestão de Dívidas</h1>
            <p className="cover-subtitle">Ncangaza Multiservices</p>
            <div className="cover-info">
              <p>
                Autor: <strong>Nilton Ramim Pita</strong>
              </p>
              <p>Instituição: Universidade Católica de Moçambique (UCM)</p>
              <p>Ano: {new Date().getFullYear()}</p>
            </div>
          </section>

          <section className="toc-page page-break-after">
            <h2 className="toc-title">Índice</h2>
            <div
              className="toc-content"
              dangerouslySetInnerHTML={{ __html: tocHtml }}
            />
          </section>

          <section
            className="report-content"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </div>
    </div>
  );
}
