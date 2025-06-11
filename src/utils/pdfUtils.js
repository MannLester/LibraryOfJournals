import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert a DOM element to PDF
 * @param {HTMLElement} element - The element to convert to PDF
 * @param {string} filename - The name of the output PDF file
 * @returns {Promise<Blob>} - The PDF as a Blob
 */
export async function elementToPdf(element, filename = 'document.pdf') {
  // Create a new PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Convert element to canvas
  const canvas = await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    allowTaint: true
  });

  // Add canvas image to PDF
  const imgData = canvas.toDataURL('image/png');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  
  // Convert to Blob
  return pdf.output('blob');
}

/**
 * Convert chapter content to PDF and upload to Supabase
 * @param {string} elementId - ID of the element containing chapter content
 * @param {string} chapterId - ID of the chapter
 * @param {string} userId - ID of the user
 * @param {string} journalId - ID of the journal
 * @returns {Promise<string>} - Public URL of the uploaded PDF
 */
export async function saveChapterAsPdf(elementId, { chapterId, userId, journalId }) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Generate PDF
    const pdfBlob = await elementToPdf(element);
    
    // Upload to Supabase
    const filePath = `${userId}/${journalId}/${chapterId}.pdf`;
    const { publicUrl } = await uploadFile('chapters', filePath, pdfBlob);
    
    return publicUrl;
  } catch (error) {
    console.error('Error saving chapter as PDF:', error);
    throw error;
  }
}
