import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mermaid from "mermaid";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import relatorioContent from "../../../RELATORIO_TECNICO_SISTEMA.md?raw";
import "./documentation-styles.css";
import logoImage from "@/assets/logo-ncangaza-full.png";

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

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

/** Converte SVG string para PNG data URL */
async function svgToPngDataUrl(svgString: string, scale = 3): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
      const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.ceil(img.width * scale));
          canvas.height = Math.max(1, Math.ceil(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("2D context not available"));
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          resolve(dataUrl);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (err) => reject(err);
      img.crossOrigin = "anonymous";
      img.src = svgDataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/** Aguarda que todas as imagens e fontes estejam carregadas */
function waitForImagesAndFonts(root: HTMLElement, timeout = 10000): Promise<void> {
  return new Promise((resolve) => {
    let finished = false;
    const t = setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve();
      }
    }, timeout);

    const imgs = Array.from(root.querySelectorAll("img"));
    const imgPromises = imgs.map((img) => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise<void>((res) => {
        img.addEventListener("load", () => res());
        img.addEventListener("error", () => res());
      });
    });

    const fontPromise = (document as any).fonts ? (document as any).fonts.ready : Promise.resolve();

    Promise.all([...imgPromises, fontPromise]).then(() => {
      if (!finished) {
        finished = true;
        clearTimeout(t);
        resolve();
      }
    });
  });
}

/* -------------------------
   Component
   ------------------------*/

export function RelatorioTecnico() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  /* Preprocess markdown to HTML */
  const processContent = (content: string) => {
    let processed = content;

    // Mermaid blocks
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
      return `<div class="mermaid-diagram avoid-break">${code.replace(/</g, "&lt;")}</div>`;
    });

    // Code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<div class="code-block avoid-break"><pre><code class="language-${lang || "text"}">${escaped}</code></pre></div>`;
    });

    // Tables
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

    // Paragraphs
    processed = processed.replace(/\n\n+/g, '</p><p class="doc-p">');
    processed = `<p class="doc-p">${processed}</p>`;
    processed = processed.replace(/<\/p><p class="doc-p"><\/p>/g, "");

    return processed;
  };

  const processedContent = processContent(relatorioContent);
  const tocHtml = buildTOCHtml(relatorioContent);

  /* Render Mermaid diagrams */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await new Promise((r) => setTimeout(r, 200));
        const root = contentRef.current;
        if (!root) return;

        const mermaidEls = Array.from(root.querySelectorAll(".mermaid-diagram")) as HTMLElement[];

        for (let i = 0; i < mermaidEls.length; i++) {
          const el = mermaidEls[i];
          const rawCode = (el.textContent || "").trim();
          if (!rawCode) continue;
          try {
            const uid = `mermaid-${i}-${Date.now()}`;
            const { svg } = await mermaid.render(uid, rawCode);

            try {
              const png = await svgToPngDataUrl(svg, 3);
              const img = document.createElement("img");
              img.src = png;
              img.alt = `Diagrama ${i + 1}`;
              img.className = "mermaid-png";
              img.style.maxWidth = "100%";
              img.style.display = "block";
              img.style.margin = "16px auto";
              el.innerHTML = "";
              el.appendChild(img);
            } catch (err) {
              el.innerHTML = `<div class="mermaid-rendered">${svg}</div>`;
              console.warn("svg->png falhou, usando svg inline", err);
            }
          } catch (err) {
            el.innerHTML = `<div class="error-diagram" style="color:#b91c1c;padding:8px;border:1px solid #fca5a5;border-radius:6px">Erro ao renderizar diagrama</div>`;
            console.error("mermaid render error", err);
          }
        }

        if (mounted && root) {
          await waitForImagesAndFonts(root, 6000);
        }

        if (mounted) setIsRendered(true);
      } catch (err) {
        console.error("Erro ao renderizar diagrams:", err);
        if (mounted) setIsRendered(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* PDF generation - MÉTODO CORRIGIDO */
  const generatePDF = async () => {
    if (!contentRef.current || !isRendered) {
      toast.error("Aguarde a renderização completa...");
      return;
    }

    setIsGeneratingPDF(true);
    toast.info("A gerar PDF... Isso pode levar alguns segundos.");

    try {
      const original = contentRef.current;

      // Criar container visível temporário
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 210mm;
        background: white;
        z-index: 999999;
        padding: 20mm;
        box-sizing: border-box;
      `;

      // Clonar conteúdo
      const clone = original.cloneNode(true) as HTMLElement;

      // Remover elementos que não devem aparecer no PDF
      const removeSelectors = [".fixed", "[data-no-print]", "header", ".no-print", "button"];
      removeSelectors.forEach((selector) => {
        clone.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Aplicar estilos para PDF
      clone.style.cssText = `
        width: 100%;
        background: white;
        color: black;
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.6;
      `;

      container.appendChild(clone);
      document.body.appendChild(container);

      // Aguardar renderização
      await new Promise((r) => setTimeout(r, 1000));
      await waitForImagesAndFonts(clone, 8000);

      // Capturar com html2canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector("div > div") as HTMLElement;
          if (clonedElement) {
            clonedElement.style.display = "block";
            clonedElement.style.visibility = "visible";
          }
        },
      });

      // Remover container temporário
      document.body.removeChild(container);

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas inválido - captura falhou");
      }

      console.log("Canvas capturado:", canvas.width, "x", canvas.height);

      // Criar PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

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

      // Adicionar primeira página
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, contentHeight);

      // Adicionar páginas adicionais se necessário
      let heightLeft = contentHeight - (pageHeight - margin * 2);
      let yOffset = 0;

      while (heightLeft > 0) {
        yOffset += pageHeight - margin * 2;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, margin - yOffset, contentWidth, contentHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const timestamp = new Date().toISOString().split("T")[0];
      pdf.save(`Relatorio_Tecnico_Sistema_Gestao_Dividas_${timestamp}.pdf`);

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
          <Button onClick={generatePDF} disabled={isGeneratingPDF || !isRendered} size="lg" className="gap-2">
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
