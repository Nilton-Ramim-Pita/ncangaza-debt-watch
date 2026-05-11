import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '@/assets/logo-ncangaza.jpg';

interface PDFConfig {
  title: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  showLogo?: boolean;
  filename?: string;
}

interface SummaryData {
  label: string;
  value: string;
}

// Paleta corporativa moderna
const COLORS = {
  red: [229, 57, 53] as [number, number, number],          // #E53935 — destaque
  redSoft: [254, 242, 242] as [number, number, number],    // fundo suave
  ink: [31, 41, 55] as [number, number, number],           // #1F2937 — texto principal
  muted: [107, 114, 128] as [number, number, number],      // #6B7280 — texto secundário
  border: [229, 231, 235] as [number, number, number],     // #E5E7EB
  surface: [249, 250, 251] as [number, number, number],    // #F9FAFB
  surfaceAlt: [245, 245, 245] as [number, number, number], // #F5F5F5
  white: [255, 255, 255] as [number, number, number],
  success: [22, 163, 74] as [number, number, number],
  warning: [202, 138, 4] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],
};

const setFill = (doc: jsPDF, c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
const setText = (doc: jsPDF, c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
const setDraw = (doc: jsPDF, c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

const addHeader = (doc: jsPDF, config: PDFConfig) => {
  const { title, subtitle, showLogo = true } = config;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;

  // Faixa branca (header limpo, sem bloco vermelho pesado)
  setFill(doc, COLORS.white);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Logo discreto
  if (showLogo) {
    try {
      doc.addImage(logoImage, 'JPEG', margin, 10, 18, 18);
    } catch {
      // ignora falha de logo
    }
  }

  const textX = showLogo ? margin + 24 : margin;

  // Nome da empresa
  setText(doc, COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('NCANGAZA', textX, 17);

  // Tagline
  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('MULTISERVICES', textX, 22);

  // Título do documento
  setText(doc, COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(title, textX, 30);

  // Subtítulo
  if (subtitle) {
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(subtitle, textX, 36);
  }

  // Bloco direito: meta info
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('GERADO EM', pageWidth - margin, 14, { align: 'right' });
  setText(doc, COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`${dateStr} · ${timeStr}`, pageWidth - margin, 19, { align: 'right' });

  // Separador elegante (linha fina cinza + acento vermelho curto)
  setDraw(doc, COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, 44, pageWidth - margin, 44);

  setDraw(doc, COLORS.red);
  doc.setLineWidth(1.2);
  doc.line(margin, 44, margin + 28, 44);

  setText(doc, COLORS.ink);
};

const addSummaryCards = (doc: jsPDF, summaryData: SummaryData[], startY: number): number => {
  if (!summaryData.length) return startY;

  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const gap = 4;
  const available = pageWidth - margin * 2;
  const count = Math.min(summaryData.length, 4);
  const cardWidth = (available - gap * (count - 1)) / count;
  const cardHeight = 22;

  summaryData.slice(0, count).forEach((item, i) => {
    const x = margin + i * (cardWidth + gap);
    const y = startY;

    // Card: fundo branco, borda suave
    setFill(doc, COLORS.white);
    setDraw(doc, COLORS.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');

    // Acento lateral vermelho discreto
    setFill(doc, COLORS.red);
    doc.rect(x, y, 1.2, cardHeight, 'F');

    // Label
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(item.label.toUpperCase(), x + 5, y + 7);

    // Valor (destaque)
    setText(doc, COLORS.ink);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    const valueText = String(item.value);
    const maxWidth = cardWidth - 8;
    const lines = doc.splitTextToSize(valueText, maxWidth);
    doc.text(lines[0], x + 5, y + 16);
  });

  // Linhas extras (quando >4) numa segunda fila
  let yEnd = startY + cardHeight;
  if (summaryData.length > 4) {
    const extras = summaryData.slice(4, 8);
    const extraCount = extras.length;
    const ew = (available - gap * (extraCount - 1)) / extraCount;
    extras.forEach((item, i) => {
      const x = margin + i * (ew + gap);
      const y = yEnd + gap;
      setFill(doc, COLORS.white);
      setDraw(doc, COLORS.border);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, ew, cardHeight, 2, 2, 'FD');
      setFill(doc, COLORS.red);
      doc.rect(x, y, 1.2, cardHeight, 'F');
      setText(doc, COLORS.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(item.label.toUpperCase(), x + 5, y + 7);
      setText(doc, COLORS.ink);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      const lines = doc.splitTextToSize(String(item.value), ew - 8);
      doc.text(lines[0], x + 5, y + 16);
    });
    yEnd += cardHeight + gap;
  }

  return yEnd + 6;
};

const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;

  // Linha divisória discreta
  setDraw(doc, COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  // Esquerda: empresa
  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NCANGAZA Multiservices · Sistema de Gestão de Dívidas', margin, pageHeight - 8);

  // Centro: paginação
  doc.setFont('helvetica', 'bold');
  setText(doc, COLORS.ink);
  doc.text(`${pageNumber} / ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Direita: copyright
  doc.setFont('helvetica', 'normal');
  setText(doc, COLORS.muted);
  doc.text(`© ${new Date().getFullYear()} · Moçambique`, pageWidth - margin, pageHeight - 8, { align: 'right' });
};

const addCompactHeader = (doc: jsPDF, config: PDFConfig) => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  setFill(doc, COLORS.white);
  doc.rect(0, 0, pageWidth, 16, 'F');
  setText(doc, COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('NCANGAZA Multiservices', margin, 10);
  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(config.title, pageWidth - margin, 10, { align: 'right' });
  setDraw(doc, COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, 14, pageWidth - margin, 14);
};

export const generatePDF = (
  config: PDFConfig,
  headers: string[],
  data: any[][],
  summaryData?: SummaryData[]
) => {
  const { orientation = 'portrait' } = config;

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  addHeader(doc, config);

  let currentY = 52;

  if (summaryData && summaryData.length > 0) {
    currentY = addSummaryCards(doc, summaryData, currentY);
  }

  // Título da secção tabela
  setText(doc, COLORS.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Detalhe de Registos', 14, currentY);
  setDraw(doc, COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(14, currentY + 1.5, doc.internal.pageSize.width - 14, currentY + 1.5);
  currentY += 4;

  // Detecta coluna "Status" para colorir badges
  const statusIdx = headers.findIndex((h) => /status|estado/i.test(h));

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: currentY,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 3.5, right: 4, bottom: 3.5, left: 4 },
      overflow: 'linebreak',
      lineColor: COLORS.border,
      lineWidth: 0.1,
      textColor: COLORS.ink,
    },
    headStyles: {
      fillColor: COLORS.surface,
      textColor: COLORS.muted,
      fontStyle: 'bold',
      halign: 'left',
      fontSize: 8,
      cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
      lineColor: COLORS.border,
      lineWidth: { top: 0, right: 0, bottom: 0.4, left: 0 },
    },
    alternateRowStyles: {
      fillColor: [252, 252, 253],
    },
    bodyStyles: {
      lineColor: COLORS.border,
      lineWidth: { top: 0, right: 0, bottom: 0.1, left: 0 },
    },
    margin: { top: 20, left: 14, right: 14, bottom: 18 },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && statusIdx >= 0 && hookData.column.index === statusIdx) {
        const raw = String(hookData.cell.raw ?? '').toLowerCase();
        if (/pago|paga/.test(raw)) hookData.cell.styles.textColor = COLORS.success;
        else if (/pendente/.test(raw)) hookData.cell.styles.textColor = COLORS.warning;
        else if (/vencid|atrasad/.test(raw)) hookData.cell.styles.textColor = COLORS.danger;
        hookData.cell.styles.fontStyle = 'bold';
      }
      // Destacar coluna de valor
      if (hookData.section === 'body') {
        const headerLabel = String(headers[hookData.column.index] ?? '').toLowerCase();
        if (/valor|montante|total/.test(headerLabel)) {
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.halign = 'right';
        }
      }
      if (hookData.section === 'head') {
        const headerLabel = String(headers[hookData.column.index] ?? '').toLowerCase();
        if (/valor|montante|total/.test(headerLabel)) {
          hookData.cell.styles.halign = 'right';
        }
      }
    },
    didDrawPage: (hookData) => {
      if (hookData.pageNumber > 1) {
        addCompactHeader(doc, config);
      }
      const pageCount = doc.getNumberOfPages();
      const currentPage = doc.getCurrentPageInfo().pageNumber;
      addFooter(doc, currentPage, pageCount);
    },
  });

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  const sanitizedFilename = filename.toLowerCase().replace(/\s+/g, '_');
  const timestamp = new Date().toISOString().split('T')[0];
  doc.save(`${sanitizedFilename}_${timestamp}.pdf`);
};

export const previewPDF = (doc: jsPDF) => {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
