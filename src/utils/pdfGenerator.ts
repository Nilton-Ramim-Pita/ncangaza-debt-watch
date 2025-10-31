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
  
  // Header background with gradient effect
  doc.setFillColor(30, 58, 138); // Dark blue
  doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F');
  
  // Add logo if enabled
  if (showLogo) {
    addLogoToDoc(doc);
  }
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Ncangaza Multiservices', showLogo ? 50 : 14, 20);
  
  // Document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, showLogo ? 50 : 14, 32);
  
  // Subtitle/Info
  if (subtitle) {
    doc.setFontSize(10);
    doc.text(subtitle, showLogo ? 50 : 14, 40);
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
  doc.text(`Gerado em: ${currentDateTime}`, doc.internal.pageSize.width - 14, 20, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
};

const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  // Footer line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
  
  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Página ${pageNumber} de ${totalPages}`,
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  );
  doc.text(
    'Relatório gerado automaticamente pelo Sistema de Gestão de Dívidas',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );
  doc.text(
    `© ${new Date().getFullYear()} Ncangaza Multiservices - Todos os direitos reservados`,
    14,
    pageHeight - 12
  );
};

const addSummarySection = (doc: jsPDF, summaryData: SummaryData[], startY: number) => {
  // Summary box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(14, startY, doc.internal.pageSize.width - 28, summaryData.length * 10 + 10, 3, 3, 'F');
  
  // Summary title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Resumo Executivo', 20, startY + 8);
  
  // Summary items
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  summaryData.forEach((item, index) => {
    const y = startY + 18 + (index * 8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.label}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, 80, y);
  });
  
  return startY + summaryData.length * 10 + 20;
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

  // Add table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: currentY,
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'center' },
    },
    margin: { top: 60, left: 14, right: 14, bottom: 25 },
    didDrawPage: (data) => {
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
