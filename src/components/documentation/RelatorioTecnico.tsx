import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import { generatePdfFromHtml } from '@/utils/htmlToPdfGenerator';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import relatorioContent from '../../../RELATORIO_TECNICO_SISTEMA.md?raw';
import './documentation-styles.css';
import logoImage from '@/assets/logo-ncangaza-full.png';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

const buildTOCHtml = (content: string) => {
  const lines = content.split('\n');
  const items: { level: number; title: string; number: string }[] = [];
  
  let h1Counter = 0;
  let h2Counter = 0;
  let h3Counter = 0;

  lines.forEach((line) => {
    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      
      let sectionNumber = '';
      if (level === 1) {
        h1Counter++;
        h2Counter = 0;
        h3Counter = 0;
        sectionNumber = `${h1Counter}`;
      } else if (level === 2) {
        h2Counter++;
        h3Counter = 0;
        sectionNumber = `${h1Counter}.${h2Counter}`;
      } else if (level === 3) {
        h3Counter++;
        sectionNumber = `${h1Counter}.${h2Counter}.${h3Counter}`;
      }
      
      items.push({ level, title, number: sectionNumber });
    }
  });

  if (!items.length) {
    return '<p class="doc-p">Índice não disponível.</p>';
  }

  return items
    .map(
      (item) =>
        `<div class="toc-item toc-level-${item.level}"><strong>${item.number}.</strong> ${item.title}</div>`
    )
    .join('');
};

const buildPdfHtml = (mainContentHtml: string, tocHtml: string) => `
  <section class="cover-page page-break-after">
    <img src="${logoImage}" alt="Logotipo Ncangaza Multiservices" class="cover-logo" />
    <h1 class="cover-title">Relatório Técnico do Sistema de Gestão de Dívidas</h1>
    <p class="cover-subtitle">Ncangaza Multiservices</p>
    <div class="cover-info">
      <p>Autor: <strong>Nilton Ramim Pita</strong></p>
      <p>Instituição: Universidade Católica de Moçambique (UCM)</p>
      <p>Ano: ${new Date().getFullYear()}</p>
    </div>
  </section>

  <section class="toc-page page-break-after">
    <h2 class="toc-title">Índice</h2>
    <div class="toc-content">
      ${tocHtml}
    </div>
  </section>

  <section class="report-content">
    ${mainContentHtml}
  </section>
`;

export function RelatorioTecnico() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingWord, setIsGeneratingWord] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'pdf' | 'word'>('pdf');

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

  const generateWord = async () => {
    if (!isRendered) {
      toast.error('Aguarde a renderização completa...');
      return;
    }

    setIsGeneratingWord(true);
    toast.info('A gerar documento Word... Por favor aguarde.');

    try {
      const lines = relatorioContent.split('\n');
      const children: any[] = [];

      // Capa
      children.push(
        new Paragraph({
          text: 'RELATÓRIO TÉCNICO DO SISTEMA DE GESTÃO DE DÍVIDAS',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { before: 3000, after: 400 },
        }),
        new Paragraph({
          text: 'Ncangaza Multiservices',
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: '',
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Autor: ', bold: false }),
            new TextRun({ text: 'Nilton Ramim Pita', bold: true }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: 'Instituição: Universidade Católica de Moçambique (UCM)',
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: `Ano: ${new Date().getFullYear()}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        })
      );

      // Índice
      children.push(
        new Paragraph({
          text: 'ÍNDICE',
          heading: HeadingLevel.HEADING_1,
          pageBreakBefore: true,
          spacing: { after: 400 },
        })
      );

      let h1Counter = 0;
      let h2Counter = 0;
      let h3Counter = 0;

      // Gerar índice
      lines.forEach((line) => {
        const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
        if (match) {
          const level = match[1].length;
          const title = match[2].trim();
          
          let sectionNumber = '';
          if (level === 1) {
            h1Counter++;
            h2Counter = 0;
            h3Counter = 0;
            sectionNumber = `${h1Counter}`;
          } else if (level === 2) {
            h2Counter++;
            h3Counter = 0;
            sectionNumber = `${h1Counter}.${h2Counter}`;
          } else if (level === 3) {
            h3Counter++;
            sectionNumber = `${h1Counter}.${h2Counter}.${h3Counter}`;
          }

          children.push(
            new Paragraph({
              text: `${sectionNumber}. ${title}`,
              spacing: { after: 100 },
              indent: { left: (level - 1) * 400 },
            })
          );
        }
      });

      // Reset counters para conteúdo
      h1Counter = 0;
      h2Counter = 0;
      h3Counter = 0;

      // Processar conteúdo
      children.push(
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        })
      );

      let inCodeBlock = false;
      let codeContent = '';
      let inList = false;

      for (const line of lines) {
        // Code blocks
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            children.push(
              new Paragraph({
                text: codeContent,
                shading: { fill: 'F1F5F9' },
                spacing: { before: 200, after: 200 },
              })
            );
            codeContent = '';
          }
          inCodeBlock = !inCodeBlock;
          continue;
        }

        if (inCodeBlock) {
          codeContent += line + '\n';
          continue;
        }

        // Headings
        const h1Match = /^# (.+)$/.exec(line);
        if (h1Match) {
          h1Counter++;
          h2Counter = 0;
          h3Counter = 0;
          inList = false;
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${h1Counter}. `, bold: true, color: '1E3A8A' }),
                new TextRun({ text: h1Match[1], bold: true }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
              pageBreakBefore: true,
            })
          );
          continue;
        }

        const h2Match = /^## (.+)$/.exec(line);
        if (h2Match) {
          h2Counter++;
          h3Counter = 0;
          inList = false;
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${h1Counter}.${h2Counter}. `, bold: true, color: '1E40AF' }),
                new TextRun({ text: h2Match[1], bold: true }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
            })
          );
          continue;
        }

        const h3Match = /^### (.+)$/.exec(line);
        if (h3Match) {
          h3Counter++;
          inList = false;
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${h1Counter}.${h2Counter}.${h3Counter}. `, bold: true, color: '1E40AF' }),
                new TextRun({ text: h3Match[1], bold: true }),
              ],
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 250, after: 100 },
            })
          );
          continue;
        }

        // Lists
        const listMatch = /^[-*]\s+(.+)$/.exec(line);
        if (listMatch) {
          inList = true;
          children.push(
            new Paragraph({
              text: listMatch[1],
              bullet: { level: 0 },
              spacing: { after: 100 },
            })
          );
          continue;
        }

        // Regular paragraphs
        if (line.trim() && !inList) {
          children.push(
            new Paragraph({
              text: line.trim(),
              spacing: { after: 150 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        } else if (!line.trim()) {
          inList = false;
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440, // 1 inch = 1440 twips
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Relatorio_Tecnico_Sistema_Gestao_Dividas_Nilton_Ramim_Pita.docx');

      toast.success('Documento Word gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar Word:', error);
      toast.error('Erro ao gerar documento Word. Tente novamente.');
    } finally {
      setIsGeneratingWord(false);
    }
  };

  const processContent = (content: string) => {
    let processed = content;
    
    let h1Counter = 0;
    let h2Counter = 0;
    let h3Counter = 0;

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

    // Process headings with automatic numbering
    processed = processed.replace(/^# (.+)$/gm, (match, title) => {
      h1Counter++;
      h2Counter = 0;
      h3Counter = 0;
      return `<h1 class="doc-h1 page-break-before"><span class="section-number">${h1Counter}.</span> ${title}</h1>`;
    });
    
    processed = processed.replace(/^## (.+)$/gm, (match, title) => {
      h2Counter++;
      h3Counter = 0;
      return `<h2 class="doc-h2 page-break-before"><span class="section-number">${h1Counter}.${h2Counter}.</span> ${title}</h2>`;
    });
    
    processed = processed.replace(/^### (.+)$/gm, (match, title) => {
      h3Counter++;
      return `<h3 class="doc-h3"><span class="section-number">${h1Counter}.${h2Counter}.${h3Counter}.</span> ${title}</h3>`;
    });
    
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
            <h1 className="text-2xl font-bold text-foreground">Documentação Técnica do Sistema</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de Gestão de Dívidas - Ncangaza Multiservices
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!isRendered}
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Pré-visualizar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Pré-visualização do Relatório Técnico</DialogTitle>
                  <DialogDescription>
                    Visualize como o documento ficará antes de exportar
                  </DialogDescription>
                </DialogHeader>

                <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as 'pdf' | 'word')} className="flex-1 flex flex-col">
                  <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
                    <TabsTrigger value="pdf" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      Visualização PDF
                    </TabsTrigger>
                    <TabsTrigger value="word" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Visualização Word
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pdf" className="flex-1 overflow-auto border rounded-lg mt-4 bg-white">
                    <div className="documentation-content p-8">
                      <section className="cover-page">
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

                      <div className="border-t-2 border-dashed my-8" />

                      <section className="toc-page">
                        <h2 className="toc-title">Índice</h2>
                        <div
                          className="toc-content"
                          dangerouslySetInnerHTML={{ __html: buildTOCHtml(relatorioContent) }}
                        />
                      </section>

                      <div className="border-t-2 border-dashed my-8" />

                      <section
                        className="report-content"
                        dangerouslySetInnerHTML={{ __html: processedContent }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="word" className="flex-1 overflow-auto border rounded-lg mt-4 bg-white">
                    <div className="p-8 space-y-6 max-w-4xl mx-auto">
                      <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold uppercase text-blue-900">
                          Relatório Técnico do Sistema de Gestão de Dívidas
                        </h1>
                        <p className="text-xl text-gray-700">Ncangaza Multiservices</p>
                        <div className="text-base space-y-2 pt-6">
                          <p>
                            Autor: <strong>Nilton Ramim Pita</strong>
                          </p>
                          <p>Instituição: Universidade Católica de Moçambique (UCM)</p>
                          <p>Ano: {new Date().getFullYear()}</p>
                        </div>
                      </div>

                      <div className="border-t-2 border-dashed my-8" />

                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-800">ÍNDICE</h2>
                        <div
                          className="space-y-2 text-sm"
                          dangerouslySetInnerHTML={{ __html: buildTOCHtml(relatorioContent) }}
                        />
                      </div>

                      <div className="border-t-2 border-dashed my-8" />

                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: processedContent }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setIsPreviewOpen(false);
                      if (previewTab === 'pdf') {
                        generatePDF();
                      } else {
                        generateWord();
                      }
                    }}
                    disabled={isGeneratingPDF || isGeneratingWord}
                    className="gap-2"
                  >
                    {previewTab === 'pdf' ? (
                      <>
                        <FileDown className="h-4 w-4" />
                        Exportar como PDF
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Exportar como Word
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF || isGeneratingWord || !isRendered}
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
            <Button
              onClick={generateWord}
              disabled={isGeneratingPDF || isGeneratingWord || !isRendered}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              {isGeneratingWord ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  A gerar Word...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Gerar Word
                </>
              )}
            </Button>
          </div>
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
