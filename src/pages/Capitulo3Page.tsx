import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mermaid from "mermaid";
import { generatePdfFromHtml } from "@/utils/htmlToPdfGenerator";
import capitulo3Content from "../../../CAPITULO_III_METODOLOGIA.md?raw";
import "../documentation/documentation-styles.css";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "Times New Roman, serif",
});

const buildTOCHtml = (content: string): string => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  let html = '';
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*(.+?)\*\*/g, '$1');
    html += `<div class="toc-item toc-level-${level}">${text}</div>`;
  }
  return html;
};

export default function Capitulo3Page() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    renderMermaidDiagrams();
  }, []);

  const renderMermaidDiagrams = async () => {
    if (!contentRef.current) return;
    const blocks = contentRef.current.querySelectorAll(".mermaid-diagram");
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const code = block.textContent || "";
      try {
        const id = `mermaid-c3-${i}-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        block.innerHTML = svg;
        block.classList.add("mermaid-rendered");
      } catch (error) {
        console.error("Erro ao renderizar diagrama:", error);
        block.innerHTML = `<pre class="error-diagram">${code}</pre>`;
      }
    }
    setIsRendered(true);
  };

  const generatePDF = async () => {
    if (!contentRef.current || !isRendered) {
      toast.error("Aguarde a renderização dos diagramas...");
      return;
    }
    setIsGenerating(true);
    toast.info("Gerando PDF do Capítulo III...");
    try {
      await generatePdfFromHtml(contentRef.current, {
        filename: "Capitulo_III_Metodologia_Desenvolvimento_Nilton_Ramim_Pita",
        scale: 2,
        quality: 0.98,
        orientation: "portrait",
      });
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const processContent = () => {
    let processed = capitulo3Content;
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return `<div class="mermaid-diagram avoid-break">${code.trim()}</div>`;
    });
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="code-block avoid-break"><code class="language-${lang || "text"}">${code}</code></pre>`;
    });
    processed = processed.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)*)/g, (match) => {
      const lines = match.trim().split("\n");
      const headers = lines[0].split("|").filter((h) => h.trim()).map((h) => h.trim());
      const rows = lines.slice(2).map((line) => line.split("|").filter((c) => c.trim()).map((c) => c.trim()));
      let html = '<table class="doc-table avoid-break"><thead><tr>';
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
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="doc-h1 page-break-before">$1</h1>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="doc-h2 page-break-before">$1</h2>');
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
    processed = processed.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');
    processed = processed.replace(/^##### (.+)$/gm, '<h5 class="doc-h4" style="font-size:12pt;">$1</h5>');
    processed = processed.replace(/^- (.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/(<li class="doc-li">.*<\/li>\n?)+/g, '<ul class="doc-ul">$&</ul>');
    processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");
    processed = processed.replace(/`([^`]+)`/g, "<code>$1</code>");
    processed = processed.replace(/^(?!<[^>]+>)(.+)$/gm, '<p class="doc-p">$1</p>');
    processed = processed.replace(/^---$/gm, '<hr style="margin:20px 0;border-top:1px solid #ccc;" />');
    return processed;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 bg-background border-b z-50 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Capítulo III – Metodologia</h1>
              <p className="text-sm text-muted-foreground">Monografia – Nilton Ramim Pita</p>
            </div>
          </div>
          <Button onClick={generatePDF} disabled={isGenerating || !isRendered} size="lg">
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando PDF...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" />Gerar PDF</>
            )}
          </Button>
        </div>
      </div>

      <div className="pt-24 print:pt-0">
        {/* Cover */}
        <div className="cover-page">
          <div className="cover-title">CAPÍTULO III</div>
          <div className="cover-subtitle">Metodologia de Desenvolvimento</div>
          <div className="cover-info">
            <p><strong>Sistema de Gestão de Dívidas</strong></p>
            <p>Ncangaza Multiservices Lda.</p>
            <br />
            <p><strong>Autor:</strong> Nilton Ramim Pita</p>
            <p><strong>Instituição:</strong> Universidade Católica de Moçambique (UCM)</p>
            <p><strong>Ano:</strong> 2025</p>
          </div>
        </div>

        {/* TOC */}
        <div className="toc-page page-break-before">
          <div className="toc-title">Índice do Capítulo III</div>
          <div className="toc-content" dangerouslySetInnerHTML={{ __html: buildTOCHtml(capitulo3Content) }} />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="documentation-content"
          dangerouslySetInnerHTML={{ __html: processContent() }}
        />
      </div>
    </div>
  );
}
