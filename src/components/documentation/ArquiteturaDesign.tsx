import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import mermaid from 'mermaid';
import { generatePdfFromHtml } from '@/utils/htmlToPdfGenerator';
import content from '../../../PROPOSTA_ARQUITETURA_DESIGN.md?raw';
import './documentation-styles.css';
import logoImage from '@/assets/logo-ncangaza-full.png';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: { curve: 'basis', padding: 30, nodeSpacing: 50, rankSpacing: 60, htmlLabels: true },
  sequence: { actorMargin: 80, messageMargin: 50, boxMargin: 15, width: 200, height: 50, noteMargin: 20, mirrorActors: true, useMaxWidth: false },
  er: { entityPadding: 20, fontSize: 16, useMaxWidth: false },
  class: { useMaxWidth: false },
  themeVariables: {
    fontSize: '16px',
    fontFamily: 'Times New Roman, serif',
  },
});

const buildTOCHtml = (md: string) => {
  const items: { level: number; title: string }[] = [];
  md.split('\n').forEach((line) => {
    const m = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (m) items.push({ level: m[1].length, title: m[2].trim() });
  });
  if (!items.length) return '<p class="doc-p">Índice não disponível.</p>';
  return items
    .map((i) => `<div class="toc-item toc-level-${i.level}">${i.title}</div>`)
    .join('');
};

const processContent = (raw: string) => {
  let p = raw;
  p = p.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) =>
    `<div class="mermaid-diagram avoid-break">${code}</div>`
  );
  p = p.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
    `<div class="code-block avoid-break"><pre><code class="language-${lang || 'text'}">${code}</code></pre></div>`
  );
  p = p.replace(/\n\|(.*?)\|\n\|([-:\s|]+)\|\n((?:\|.*?\|\n)+)/g, (match, header, _sep, rows) => {
    const hs = header.split('|').filter(Boolean).map((h: string) => h.trim());
    const rs = rows.trim().split('\n').map((r: string) =>
      r.split('|').filter(Boolean).map((c: string) => c.trim())
    );
    let t = '<table class="doc-table avoid-break"><thead><tr>';
    hs.forEach((h: string) => (t += `<th>${h}</th>`));
    t += '</tr></thead><tbody>';
    rs.forEach((row: string[]) => {
      t += '<tr>';
      row.forEach((c: string) => (t += `<td>${c}</td>`));
      t += '</tr>';
    });
    return t + '</tbody></table>';
  });
  p = p.replace(/^# (.+)$/gm, '<h1 class="doc-h1 page-break-before">$1</h1>');
  p = p.replace(/^## (.+)$/gm, '<h2 class="doc-h2">$1</h2>');
  p = p.replace(/^### (.+)$/gm, '<h3 class="doc-h3">$1</h3>');
  p = p.replace(/^#### (.+)$/gm, '<h4 class="doc-h4">$1</h4>');
  p = p.replace(/^\d+\.\s+(.+)$/gm, '<li class="doc-li">$1</li>');
  p = p.replace(/^[-*]\s+(.+)$/gm, '<li class="doc-li">$1</li>');
  p = p.replace(/(<li class="doc-li">.*<\/li>)/s, '<ul class="doc-ul">$1</ul>');
  p = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  p = p.replace(/\*(.+?)\*/g, '<em>$1</em>');
  p = p.replace(/\n\n(.+?)\n\n/g, '<p class="doc-p">$1</p>');
  return p;
};

/** Convert SVG element to PNG data URL using base64 (avoids tainted canvas) */
const svgToPngDataUrl = (svgEl: SVGElement, scale = 4): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const base64 = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    const img = new Image();
    const bbox = svgEl.getBoundingClientRect();
    const w = bbox.width * scale;
    const h = bbox.height * scale;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export function ArquiteturaDesign() {
  const ref = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const els = document.querySelectorAll('.mermaid-diagram');
      for (let i = 0; i < els.length; i++) {
        const el = els[i] as HTMLElement;
        try {
          const { svg } = await mermaid.render(`mermaid-arq-${i}`, el.textContent || '');
          el.innerHTML = `<div class="mermaid-rendered">${svg}</div>`;
        } catch {
          el.innerHTML = `<div class="error-diagram">Erro ao renderizar diagrama</div>`;
        }
      }
      setReady(true);
    })();
  }, []);

  const convertSvgsToPng = async () => {
    if (!ref.current) return;
    const svgs = ref.current.querySelectorAll('.mermaid-rendered svg');
    for (const svgEl of svgs) {
      try {
        const pngUrl = await svgToPngDataUrl(svgEl as SVGElement, 3);
        const parent = svgEl.parentElement;
        if (parent) {
          const img = document.createElement('img');
          img.src = pngUrl;
          img.style.width = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '0 auto';
          img.setAttribute('data-was-svg', 'true');
          parent.replaceChild(img, svgEl);
        }
      } catch (e) {
        console.warn('SVG to PNG conversion failed:', e);
      }
    }
  };

  const restorePngsToSvg = () => {
    // Re-render mermaid after PDF to restore interactive SVGs
    if (!ref.current) return;
    const imgs = ref.current.querySelectorAll('img[data-was-svg]');
    if (imgs.length > 0) {
      // Simple reload approach - re-trigger mermaid
      window.location.reload();
    }
  };

  const exportPDF = async () => {
    if (!ref.current || !ready) return;
    setGenerating(true);
    toast.info('A gerar PDF... Pode demorar alguns segundos.');
    try {
      // Convert SVGs to PNG for clean PDF capture
      await convertSvgsToPng();
      // Small delay to let images render
      await new Promise(r => setTimeout(r, 500));

      await generatePdfFromHtml(ref.current, {
        filename: 'Proposta_Arquitetura_Design_Sistema_Gestao_Dividas',
        scale: 2,
        quality: 0.98,
        orientation: 'portrait',
      });
    } catch {
      /* handled by utility */
    } finally {
      setGenerating(false);
      // Restore SVGs
      restorePngsToSvg();
    }
  };

  const processed = processContent(content);
  const toc = buildTOCHtml(content);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Proposta de Arquitectura e Design</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Gestão de Dívidas - Ncangaza Multiservices</p>
          </div>
          <Button onClick={exportPDF} disabled={generating || !ready} size="lg" className="gap-2">
            {generating ? (
              <><Loader2 className="h-5 w-5 animate-spin" />A gerar PDF...</>
            ) : (
              <><FileDown className="h-5 w-5" />Gerar PDF</>
            )}
          </Button>
        </div>
      </div>

      <div className="pt-24 px-4 pb-8">
        <div ref={ref} className="documentation-content">
          <section className="cover-page page-break-after">
            <img src={logoImage} alt="Logotipo Ncangaza Multiservices" className="cover-logo" />
            <h1 className="cover-title">Proposta de Arquitectura e Desenho do Sistema de Gestão de Dívidas</h1>
            <p className="cover-subtitle">Ncangaza Multiservices</p>
            <div className="cover-info">
              <p>Autor: <strong>Nilton Ramim Pita</strong></p>
              <p>Instituição: Universidade Católica de Moçambique (UCM)</p>
              <p>Ano: {new Date().getFullYear()}</p>
            </div>
          </section>

          <section className="toc-page page-break-after">
            <h2 className="toc-title">Índice</h2>
            <div className="toc-content" dangerouslySetInnerHTML={{ __html: toc }} />
          </section>

          <section className="report-content" dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      </div>
    </div>
  );
}
