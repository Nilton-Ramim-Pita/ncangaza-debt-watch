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

const addLogoToDoc = (doc: jsPDF) => {
  try {
    // Add logo (converted to base64 or use direct path)
    doc.addImage(logoImage, 'JPEG', 14, 10, 30, 30);
  } catch (error) {
    console.error('Erro ao adicionar logo:', error);
  }
};

const addHeader = (doc: jsPDF, config: PDFConfig) => {
  const { title, subtitle, showLogo = true } = config;
  const pageWidth = doc.internal.pageSize.width;
  
  // NCANGAZA brand colors
  const brandRed = [229, 57, 53]; // #E53935
  const brandDark = [33, 33, 33]; // #212121
  
  // Header background with NCANGAZA red
  doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // Decorative accent line
  doc.setFillColor(brandDark[0], brandDark[1], brandDark[2]);
  doc.rect(0, 55, pageWidth, 3, 'F');
  
  // Add logo if enabled
  if (showLogo) {
    // White background circle for logo
    doc.setFillColor(255, 255, 255);
    doc.circle(29, 27, 18, 'F');
    addLogoToDoc(doc);
  }
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('NCANGAZA', showLogo ? 52 : 14, 22);
  
  // Tagline
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('MULTISERVICES', showLogo ? 52 : 14, 29);
  
  // Document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, showLogo ? 52 : 14, 40);
  
  // Subtitle/Info
  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, showLogo ? 52 : 14, 48);
  }
  
  // Generation date and time (right aligned)
  const currentDateTime = new Date().toLocaleString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(9);
  doc.text(`Gerado em: ${currentDateTime}`, pageWidth - 14, 22, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  // NCANGAZA brand colors
  const brandRed = [229, 57, 53]; // #E53935
  
  // Footer accent line with brand color
  doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setLineWidth(0.5);
  doc.line(14, pageHeight - 22, pageWidth - 14, pageHeight - 22);
  
  // Footer background
  doc.setFillColor(250, 250, 250);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  // Page number with brand styling
  doc.setFontSize(9);
  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Página ${pageNumber} de ${totalPages}`,
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  );
  
  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Sistema de Gestão de Dívidas - NCANGAZA Multiservices',
    pageWidth / 2,
    pageHeight - 7,
    { align: 'center' }
  );
  
  // Copyright
  doc.text(
    `© ${new Date().getFullYear()} NCANGAZA`,
    14,
    pageHeight - 7
  );
  
  // Contact info
  doc.text(
    'Moçambique',
    pageWidth - 14,
    pageHeight - 7,
    { align: 'right' }
  );
};

const addSummarySection = (doc: jsPDF, summaryData: SummaryData[], startY: number) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // NCANGAZA brand colors
  const brandRed = [229, 57, 53]; // #E53935
  
  // Summary box with subtle red border
  doc.setFillColor(255, 250, 250);
  doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, startY, pageWidth - 28, summaryData.length * 10 + 16, 4, 4, 'FD');
  
  // Red accent bar on left
  doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.roundedRect(14, startY, 4, summaryData.length * 10 + 16, 4, 0, 'F');
  doc.rect(16, startY, 2, summaryData.length * 10 + 16, 'F');
  
  // Summary title with brand color
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.text('Resumo Executivo', 24, startY + 10);
  
  // Divider line
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.2);
  doc.line(24, startY + 14, pageWidth - 20, startY + 14);
  
  // Summary items
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  
  summaryData.forEach((item, index) => {
    const y = startY + 24 + (index * 8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`${item.label}:`, 24, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(item.value, 85, y);
  });
  
  return startY + summaryData.length * 10 + 26;
};

export const generatePDF = (
  config: PDFConfig, 
  headers: string[], 
  data: any[][],
  summaryData?: SummaryData[]
) => {
  const { orientation = 'portrait', filename = 'relatorio' } = config;
  
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  // Add header
  addHeader(doc, config);
  
  let currentY = 60;
  
  // Add summary section if provided
  if (summaryData && summaryData.length > 0) {
    currentY = addSummarySection(doc, summaryData, currentY);
  }

  // NCANGAZA brand colors
  const brandRed: [number, number, number] = [229, 57, 53]; // #E53935
  const brandDark: [number, number, number] = [33, 33, 33]; // #212121

  // Add table with NCANGAZA styling
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: currentY,
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 5,
      overflow: 'linebreak',
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: brandRed,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 10,
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [255, 248, 248] // Very light red tint
    },
    bodyStyles: {
      textColor: brandDark,
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'center' },
    },
    margin: { top: 68, left: 14, right: 14, bottom: 28 },
    didDrawPage: (data) => {
      // Add header to subsequent pages
      if (data.pageNumber > 1) {
        doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
        doc.rect(0, 0, doc.internal.pageSize.width, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('NCANGAZA Multiservices', 14, 8);
        doc.text(config.title, doc.internal.pageSize.width - 14, 8, { align: 'right' });
      }
      // Add footer to each page
      const pageCount = doc.getNumberOfPages();
      const currentPage = doc.getCurrentPageInfo().pageNumber;
      addFooter(doc, currentPage, pageCount);
    }
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
