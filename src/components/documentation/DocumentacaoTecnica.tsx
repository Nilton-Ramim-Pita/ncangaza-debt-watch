import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mermaid from "mermaid";
import { generatePdfFromHtml } from "@/utils/htmlToPdfGenerator";
import documentacaoContent from "../../../DOCUMENTACAO_TECNICA_COMPLETA.md?raw";

// Inicializar Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "Times New Roman, serif",
});

export const DocumentacaoTecnica = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    renderMermaidDiagrams();
  }, []);

  const renderMermaidDiagrams = async () => {
    if (!contentRef.current) return;

    const mermaidBlocks = contentRef.current.querySelectorAll(".mermaid-diagram");

    for (let i = 0; i < mermaidBlocks.length; i++) {
      const block = mermaidBlocks[i] as HTMLElement;
      const code = block.textContent || "";

      try {
        const id = `mermaid-${i}-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        block.innerHTML = svg;
        block.classList.add("mermaid-rendered");
      } catch (error) {
        console.error("Erro ao renderizar diagrama Mermaid:", error);
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
    toast.info("Gerando PDF profissional... Isso pode levar alguns minutos.");

    try {
      await generatePdfFromHtml(contentRef.current, {
        filename: "Documentacao_Tecnica_Sistema_Gestao_Dividas_Nilton_Ramim_Pita",
        scale: 2,
        quality: 0.98,
        orientation: "portrait",
      });
    } catch (error) {
      // Erro já tratado na função utilitária
    } finally {
      setIsGenerating(false);
    }
  };

  const processContent = () => {
    // Processar o conteúdo Markdown
    let processed = documentacaoContent;

    // Extrair e marcar blocos Mermaid
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return `<div class="mermaid-diagram avoid-break">${code.trim()}</div>`;
    });

    // Processar código normal
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="code-block avoid-break"><code class="language-${lang || "text"}">${code}</code></pre>`;
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

    // Processar títulos
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="doc-h1 page-break-before">$1</h1>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="doc-h2 page-break-before">$1</h2>');
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
    <div className="min-h-screen bg-background">
      {/* Cabeçalho de controle */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b z-50 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Documentação Técnica</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão de Dívidas</p>
            </div>
          </div>
          <Button onClick={generatePDF} disabled={isGenerating || !isRendered} size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Gerar PDF Profissional
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Conteúdo da documentação */}
      <div className="pt-24 print:pt-0">
        <div
          ref={contentRef}
          className="documentation-content"
          dangerouslySetInnerHTML={{ __html: processContent() }}
        />
      </div>
    </div>
  );
};
