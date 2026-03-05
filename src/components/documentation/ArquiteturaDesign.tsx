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

  const exportPDF = async () => {
    if (!ref.current || !ready) return;
    setGenerating(true);
    toast.info('A gerar PDF... Pode demorar alguns minutos.');
    try {
      await generatePdfFromHtml(ref.current, {
        filename: 'Proposta_Arquitetura_Design_Sistema_Gestao_Dividas',
        scale: 2,
        quality: 0.95,
        orientation: 'portrait',
      });
    } catch { /* handled */ } finally {
      setGenerating(false);
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
