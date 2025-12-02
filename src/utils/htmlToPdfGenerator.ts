import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface HtmlToPdfConfig {
  filename: string;
  title?: string;
  scale?: number;
  quality?: number;
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  onProgress?: (message: string) => void;
}

/**
 * Função utilitária padronizada para gerar PDF a partir de elementos HTML
 * usando html2canvas + jsPDF. Resolve problemas conhecidos de:
 * - Canvas tainted com imagens externas
 * - Wrong PNG signature (usa JPEG em vez de PNG)
 * - Conteúdo cortado fora da viewport
 */
export const generatePdfFromHtml = async (
  element: HTMLElement,
  config: HtmlToPdfConfig
): Promise<void> => {
  const {
    filename,
    scale = 2,
    quality = 0.95,
    orientation = 'portrait',
    margin = 0,
    onProgress
  } = config;

  // Guardar estilos originais para restaurar depois
  const originalStyle = {
    position: element.style.position,
    overflow: element.style.overflow,
    transform: element.style.transform,
    maxHeight: element.style.maxHeight,
    width: element.style.width,
  };

  try {
    onProgress?.('A preparar documento para captura...');

    // Garantir que todo o conteúdo está visível para captura
    element.style.position = 'static';
    element.style.overflow = 'visible';
    element.style.transform = 'none';
    element.style.maxHeight = 'none';

    onProgress?.('A capturar conteúdo...');

    // Capturar elemento com html2canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false, // Evita erro de "canvas tainted" com imagens externas
      scrollX: 0,
      scrollY: -window.scrollY,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
    });

    onProgress?.('A gerar PDF...');

    // Converter para JPEG (evita bug "wrong PNG signature" do jsPDF)
    const imgData = canvas.toDataURL('image/jpeg', quality);

    // Configurações de página A4
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = orientation === 'portrait' ? 210 : 297;
    const pageHeight = orientation === 'portrait' ? 297 : 210;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    // Primeira página
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);

    // Páginas adicionais se necessário
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
    }

    // Salvar PDF
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedFilename = filename.replace(/\s+/g, '_');
    pdf.save(`${sanitizedFilename}_${timestamp}.pdf`);

    onProgress?.('PDF gerado com sucesso!');
    toast.success('PDF gerado com sucesso!');

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.error('Erro ao gerar PDF. Tente novamente.');
    throw error;
  } finally {
    // Restaurar estilos originais
    element.style.position = originalStyle.position;
    element.style.overflow = originalStyle.overflow;
    element.style.transform = originalStyle.transform;
    element.style.maxHeight = originalStyle.maxHeight;
    element.style.width = originalStyle.width;
  }
};

/**
 * Função para pré-visualizar PDF em nova aba
 */
export const previewPdfFromHtml = async (
  element: HTMLElement,
  config: Omit<HtmlToPdfConfig, 'filename'>
): Promise<void> => {
  const {
    scale = 2,
    quality = 0.95,
    orientation = 'portrait',
    margin = 0,
    onProgress
  } = config;

  const originalStyle = {
    position: element.style.position,
    overflow: element.style.overflow,
    transform: element.style.transform,
    maxHeight: element.style.maxHeight,
  };

  try {
    onProgress?.('A preparar pré-visualização...');

    element.style.position = 'static';
    element.style.overflow = 'visible';
    element.style.transform = 'none';
    element.style.maxHeight = 'none';

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = orientation === 'portrait' ? 210 : 297;
    const pageHeight = orientation === 'portrait' ? 297 : 210;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
    }

    // Abrir em nova aba
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('Erro ao gerar pré-visualização:', error);
    toast.error('Erro ao gerar pré-visualização.');
    throw error;
  } finally {
    element.style.position = originalStyle.position;
    element.style.overflow = originalStyle.overflow;
    element.style.transform = originalStyle.transform;
    element.style.maxHeight = originalStyle.maxHeight;
  }
};
