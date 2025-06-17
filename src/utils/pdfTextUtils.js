import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { uploadFile } from './supabase';

/**
 * Convert chapter content to a text-based PDF
 * @param {HTMLElement} contentElement - The DOM element containing the chapter content
 * @param {Object} options - Options for PDF generation
 * @param {string} options.chapterId - The ID of the chapter
 * @param {string} options.userId - The ID of the user
 * @param {string} options.journalId - The ID of the journal
 * @returns {Promise<Blob>} - The generated PDF as a Blob
 */
export async function createTextBasedPdf(contentElement, { chapterId, userId, journalId }) {
  try {
    if (!contentElement) {
      throw new Error('Content element is required');
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a new page with the same dimensions as A4
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (72 dpi)
    const { width, height } = page.getSize();
    
    // Load a standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Get all text nodes from the content element and filter out empty pages
    const textContent = getTextContent(contentElement).filter(item => {
      // Skip empty text nodes
      if (!item.text || !item.text.trim()) return false;
      
      // Skip elements with 'No content' text in double page view
      if (item.text.trim() === 'No content' && item.className?.includes('empty-page-content')) {
        return false;
      }
      
      return true;
    });
    
    if (textContent.length === 0) {
      throw new Error('No content to save');
    }
    
    // Draw the content on the page
    let y = height - 50; // Start 50 points from the top
    const lineHeight = 14;
    const paragraphSpacing = 10;
    const margin = 50;
    
    // Add title (if any)
    const title = contentElement.querySelector('h1, h2, h3, .chapter-title');
    if (title && title.textContent.trim()) {
      page.drawText(title.textContent.trim(), {
        x: margin,
        y,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      y -= 30;
    }
    
    // Add content
    for (const item of textContent) {
      // Skip empty text nodes
      if (!item.text || !item.text.trim()) continue;
      
      // Handle different element types
      const isBold = item.isBold || item.tagName === 'STRONG' || item.tagName === 'B';
      const isHeading = item.tagName && item.tagName.match(/^H[1-6]$/);
      const currentFont = isBold || isHeading ? boldFont : font;
      const currentSize = isHeading ? 14 : 12;
      
      // Split text into lines that fit the page width
      const lines = splitTextIntoLines(
        item.text.trim(), 
        width - (2 * margin), 
        currentFont, 
        currentSize
      );
      
      // Draw each line
      for (const line of lines) {
        // Add new page if needed
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([width, height]);
          y = height - margin;
        }
        
        page.drawText(line, {
          x: margin,
          y,
          size: currentSize,
          font: currentFont,
          color: rgb(0, 0, 0),
        });
        
        y -= lineHeight;
      }
      
      // Add spacing after paragraph
      y -= paragraphSpacing;
    }
    
    // Save the PDF to a Blob
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error creating text-based PDF:', error);
    throw error;
  }
}

/**
 * Get all text content from an element while preserving formatting
 */
function getTextContent(element) {
  const result = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Get the parent element to check formatting
      const parent = node.parentElement;
      const isBold = window.getComputedStyle(parent).fontWeight >= '600' || 
                    parent.tagName === 'STRONG' || 
                    parent.tagName === 'B';
      
      result.push({
        text: node.textContent,
        isBold,
        tagName: parent.tagName,
        className: parent.className
      });
    }
  }
  
  return result;
}

/**
 * Extract text content from a DOM element
 * @param {HTMLElement} element - The element to extract text from
 * @returns {Object} - Extracted content with title and paragraphs
 */
function extractTextContent(element) {
  const title = element.querySelector('h1, h2, h3')?.textContent || '';
  const paragraphs = [];
  
  // Extract all paragraph elements
  const paragraphElements = element.querySelectorAll('p, div.text-content');
  paragraphElements.forEach(p => {
    if (p.textContent.trim()) {
      paragraphs.push({
        text: p.textContent.trim(),
        styles: getComputedStyles(p)
      });
    }
  });
  
  return { title, paragraphs };
}

/**
 * Split text into lines that fit within a given width
 */
function splitTextIntoLines(text, maxWidth, font, fontSize) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = words[0] || '';
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Save chapter as a text-based PDF to Supabase Storage
 * @param {HTMLElement} contentElement - The element containing the chapter content
 * @param {Object} options - Options for saving the PDF
 * @param {string} options.chapterId - The ID of the chapter
 * @param {string} options.userId - The ID of the user
 * @param {string} options.journalId - The ID of the journal
 * @returns {Promise<string>} - The public URL of the saved PDF
 */
export async function saveChapterAsTextPdf(contentElement, { chapterId, userId, journalId }) {
  if (!contentElement) {
    throw new Error('Content element is required');
  }
  
  if (!chapterId || !userId || !journalId) {
    throw new Error('Missing required parameters: chapterId, userId, and journalId are required');
  }
  
  console.log('Starting PDF generation for chapter:', { chapterId, userId, journalId });
  
  try {
    // Create a text-based PDF
    const pdfBlob = await createTextBasedPdf(contentElement, { chapterId, userId, journalId });
    
    if (!(pdfBlob instanceof Blob)) {
      throw new Error('Failed to generate PDF: Invalid blob returned');
    }
    
    console.log('PDF generated successfully, size:', pdfBlob.size, 'bytes');
    
    // Sanitize chapter name/number for safe filenames
    function sanitizeFilename(name) {
      return name
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dash
        .replace(/^-+|-+$/g, '')     // trim leading/trailing dashes
        .replace(/-+/g, '-')         // collapse multiple dashes
        || 'chapter';
    }
    
    const sanitizedChapter = sanitizeFilename(chapterId);
    // Simplified file path structure as requested - just userId/chapterId
    // The uploadFile function will handle versioning by adding a timestamp
    const fileName = `${userId}/${sanitizedChapter}.pdf`;
    console.log('Uploading PDF to Supabase bucket "pdfs" with filename:', fileName);
    
    const { publicUrl, error } = await uploadFile('pdfs', fileName, pdfBlob);
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload PDF: ${error.message || 'Unknown error'}`);
    }
    
    if (!publicUrl) {
      throw new Error('Failed to get public URL from Supabase');
    }
    
    console.log('PDF uploaded successfully to:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('Error in saveChapterAsTextPdf:', error);
    throw new Error(`Failed to save chapter as PDF: ${error.message}`);
  }
}
