import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

/** Converte SVG string para PNG data URL de forma segura (sem tainted canvas) */
async function svgToPngDataUrl(svgString: string, scale = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Criar SVG data URL diretamente (evita blob URL que causa tainted canvas)
      const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
      const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;
      
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(img.width * scale);
          canvas.height = Math.ceil(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Não foi possível obter contexto 2D'));
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(scale, 0, 0, scale, 0, 0);
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png', 0.95);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = svgDataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/** Aguarda que todas as imagens e fontes estejam carregadas */
function waitForImagesAndFonts(root: HTMLElement, timeout = 8000): Promise<void> {
  return new Promise((resolve) => {
    let finished = false;
    const t = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve();
      }
    }, timeout);

    const imgs = Array.from(root.querySelectorAll('img'));
    const imgPromises = imgs.map((img) => {
      if ((img as HTMLImageElement).complete) return Promise.resolve();
      return new Promise<void>((res) => {
        img.addEventListener('load', () => res());
        img.addEventListener('error', () => res());
      });
    });

    const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([...imgPromises, fontPromise]).then(() => {
      if (!finished) {
        finished = true;
        clearTimeout(t);
        resolve();
      }
    });
  });
}

export function RelatorioTecnico() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    renderMermaidDiagrams();
  }, []);

  const renderMermaidDiagrams = async () => {
    try {
      // Aguarda um pouco para o DOM estar pronto
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mermaidElements = document.querySelectorAll('.mermaid-diagram');
      console.log(`Encontrados ${mermaidElements.length} diagramas Mermaid`);
      
      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i] as HTMLElement;
        const code = element.textContent || '';
        
        if (!code.trim()) continue;
        
        try {
          const uniqueId = `mermaid-${i}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, code);
          
          // Converte SVG para PNG usando data URL (evita tainted canvas)
          try {
            const pngDataUrl = await svgToPngDataUrl(svg, 2);
            element.innerHTML = `<img src="${pngDataUrl}" alt="Diagrama ${i + 1}" class="mermaid-png" style="max-width:100%;height:auto;display:block;margin:16px auto;" />`;
            console.log(`Diagrama ${i + 1} convertido para PNG com sucesso`);
          } catch (pngError) {
            // Se falhar PNG, usa o SVG diretamente (melhor que nada)
            console.warn(`Falha ao converter para PNG, usando SVG:`, pngError);
            element.innerHTML = `<div class="mermaid-rendered">${svg}</div>`;
          }
        } catch (error) {
          console.error('Erro ao renderizar diagrama Mermaid:', error);
          element.innerHTML = `<div class="error-diagram" style="color:#b91c1c;padding:8px;border:1px solid #fca5a5;border-radius:6px;">Erro ao renderizar diagrama</div>`;
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
    toast.info('A gerar PDF... Isso pode levar alguns segundos.');

    try {
      // Clonar o elemento para não afetar a visualização
      const element = contentRef.current;
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Criar container temporário com estilos fixos
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 794px;
        background: white;
        z-index: -9999;
        visibility: hidden;
      `;
      container.appendChild(clone);
      document.body.appendChild(container);

      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Iniciando captura html2canvas...');
      console.log('Dimensões:', clone.scrollWidth, 'x', clone.scrollHeight);

      // Capturar com html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true,
        width: 794,
        height: clone.scrollHeight,
        windowWidth: 794,
      });

      // Remover container temporário
      document.body.removeChild(container);

      console.log('Canvas capturado:', canvas.width, 'x', canvas.height);

      // Verificar se o canvas tem conteúdo
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas vazio - falha na captura');
      }

      // Converter para JPEG
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Criar PDF A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      let position = margin;
      let pageNum = 0;

      // Primeira página
      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pageHeight - margin * 2);
      pageNum++;

      // Páginas adicionais
      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pageHeight - margin * 2);
        pageNum++;
      }

      // Salvar
      const timestamp = new Date().toISOString().split('T')[0];
      pdf.save(`Relatorio_Tecnico_Sistema_Gestao_Dividas_${timestamp}.pdf`);

      toast.success(`PDF gerado com sucesso! (${pageNum} páginas)`);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Verifique o console.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const processContent = (content: string) => {
    let processed = content;

    // Process Mermaid diagrams - marca para conversão posterior
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return `<div class="mermaid-diagram avoid-break">${code}</div>`;
    });

    // Process code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<div class="code-block avoid-break"><pre><code class="language-${lang || 'text'}">${escaped}</code></pre></div>`;
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

    // Process headings
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
