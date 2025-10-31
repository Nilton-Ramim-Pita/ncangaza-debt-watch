import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFConfig {
  title: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
}

export const generatePDF = (config: PDFConfig, headers: string[], data: any[][]) => {
  const { title, subtitle, orientation = 'portrait' } = config;
  
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  // Add logo/header area
  doc.setFillColor(59, 130, 246); // primary color
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Ncangaza Multiservices', 14, 20);
  
  // Document title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 30);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Subtitle/date
  if (subtitle) {
    doc.setFontSize(10);
    doc.text(subtitle, 14, 50);
  }
  
  // Current date
  const currentDate = new Date().toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Data: ${currentDate}`, 14, subtitle ? 56 : 50);

  // Add table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: subtitle ? 62 : 56,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { top: 62, left: 14, right: 14 },
  });

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    doc.text(
      '© 2025 Ncangaza Multiservices',
      14,
      doc.internal.pageSize.height - 10
    );
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
