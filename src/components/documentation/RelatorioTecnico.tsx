import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import relatorioContent from "../../../RELATORIO_TECNICO_SISTEMA.md?raw";
import "./documentation-styles.css";
import logoImage from "@/assets/logo-ncangaza-full.png";

/* -------------------------
   Helpers
   ------------------------*/

/** Extrai headings do markdown (TOC) */
const buildTOCHtml = (content: string) => {
  const lines = content.split("\n");
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

  return items.map((item) => `<div class="toc-item toc-level-${item.level}">${item.title}</div>`).join("");
};

/* -------------------------
   Component
   ------------------------*/

export function RelatorioTecnico() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  /* Preprocess markdown to HTML (basic) - SEM MERMAID */
  const processContent = (content: string) => {
    let processed = content;

    // Mermaid blocks -> mostrar como código (sem tentar renderizar)
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="code-block avoid-break"><pre><code class="language-mermaid">${escaped}</code></pre></div>`;
    });

    // Code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="code-block avoid-break"><pre><code class="language-${lang || "text"}">${escaped}</code></pre></div>`;
    });

    // Tables (simple markdown pipes)
    processed = processed.replace(
      /\n\|(.*?)\|\n\|([-:\s|]+)\|\n((?:\|.*?\|\n)+)/g,
      (match, header, separator, rows) => {
        const headers = header
          .split("|")
          .map((h: string) => h.trim())
          .filter(Boolean);
        const rowData = rows
          .trim()
          .split("\n")
          .map((r: string) =>
            r
              .split("|")
              .map((c) => c.trim())
              .filter(Boolean),
          );
        let table = '<table class="doc-table avoid-break"><thead><tr>';
        headers.forEach((h) => (table += `<th>${h}</th>`));
        table += "</tr></thead><tbody>";
        rowData.forEach((row) => {
          table += "<tr>";
          row.forEach((cell) => (table += `<td>${cell}</td>`));
          table += "</tr>";
        });
        table += "</tbody></table>";
        return table;
      },
    );

    // Headings
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="doc-h1 page-break-before">$1</h1>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
    processed = processed.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');

    // Lists
    processed = processed.replace(/^\d+\.\s+(.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/^[-*]\s+(.+)$/gm, '<li class="doc-li">$1</li>');
    processed = processed.replace(/(<li class="doc-li">[\s\S]*?<\/li>)/g, '<ul class="doc-ul">$1</ul>');

    // Bold / italic
    processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Paragraphs (simple)
    processed = processed.replace(/\n\n+/g, '</p><p class="doc-p">');
    processed = `<p class="doc-p">${processed}</p>`;
    processed = processed.replace(/<\/p><p class="doc-p"><\/p>/g, "");

    return processed;
  };

  const processedContent = processContent(relatorioContent);
  const tocHtml = buildTOCHtml(relatorioContent);

  /* Full PDF generation using html2canvas + jsPDF */
  const generatePDF = async () => {
    if (!contentRef.current) {
      toast.error("Conteúdo não disponível");
      return;
    }

    setIsGeneratingPDF(true);
    toast.info("A gerar PDF... Isso pode levar alguns segundos.");

    try {
      const original = contentRef.current;
      
      // Clone the node
      const clone = original.cloneNode(true) as HTMLElement;

      // Remove elements we don't want in PDF
      const removeEls = clone.querySelectorAll(".fixed, [data-no-print], .no-print");
      removeEls.forEach((el) => el.remove());

      // Set fixed width for A4
      clone.style.width = "794px";
      clone.style.maxWidth = "794px";
      clone.style.background = "#ffffff";
      clone.style.padding = "20px";

      // Create offscreen container
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;top:-99999px;left:0;width:794px;background:#fff;";
      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait for layout
      await new Promise((r) => setTimeout(r, 300));

      const scrollH = clone.scrollHeight || 1000;

      // Capture with html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: scrollH,
      });

      // Cleanup
      document.body.removeChild(container);

      if (!canvas || canvas.width === 0) {
        throw new Error("Falha na captura do canvas");
      }

      // Create PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      // Add pages
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, contentHeight);

      let heightLeft = contentHeight - (pageHeight - margin * 2);
      let offset = 0;

      while (heightLeft > 0) {
        offset += pageHeight - margin * 2;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, margin - offset, contentWidth, contentHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const timestamp = new Date().toISOString().split("T")[0];
      pdf.save(`Relatorio_Tecnico_${timestamp}.pdf`);

      toast.success("PDF gerado com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast.error("Erro ao gerar PDF. Verifique o console.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatório Técnico do Sistema</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão de Dívidas - Ncangaza Multiservices</p>
          </div>
          <Button onClick={generatePDF} disabled={isGeneratingPDF} size="lg" className="gap-2">
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />A gerar PDF...
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

      {/* Content */}
      <div className="pt-24 px-4 pb-8">
        <div ref={contentRef} className="documentation-content">
          <section className="cover-page page-break-after">
            <img src={logoImage} alt="Logotipo Ncangaza Multiservices" className="cover-logo" />
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
            <div className="toc-content" dangerouslySetInnerHTML={{ __html: tocHtml }} />
          </section>

          <section className="report-content" dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
      </div>
    </div>
  );
}

export default RelatorioTecnico;
