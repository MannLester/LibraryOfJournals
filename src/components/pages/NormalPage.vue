<template>
  <div class="page" ref="pageElement">
    <div 
      class="page-content"
      contenteditable="true"
      data-placeholder="Continue writing..."
      @input="handleContentInput"
      @keydown="handleContentKeydown"
      @keyup="handleContentKeyup"
      @paste="handleContentInput"
      @click="handleContentClick"
      ref="contentElement"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  page: {
    type: Object,
    required: true
  },
  pageIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits([
  'update:content',
  'content-overflow',
  'focus-next-page',
  'focus-previous-page',
  'delete-page' // For page deletion
]);

const pageElement = ref(null);
const contentElement = ref(null);
const isBackspacePressed = ref(false);
const isPageFull = ref(false);

// Page height constants (in pixels) - same as ChapterPage
const PAGE_HEIGHT = 1123; // A4 height at 96 DPI
const CONTENT_PADDING = 120; // Top and bottom padding
// For NormalPage, we have more available height since there's no title
const AVAILABLE_CONTENT_HEIGHT = PAGE_HEIGHT - CONTENT_PADDING - 30; // Added 30px buffer

// Focus the content when component is mounted
onMounted(() => {
  if (contentElement.value) {
    contentElement.value.innerHTML = props.page.content || '';
    contentElement.value.focus();
    nextTick(() => {
      checkContentOverflow();
    });
  }
  
  if (typeof ResizeObserver !== 'undefined' && contentElement.value) {
    const resizeObserver = new ResizeObserver(() => {
      checkContentOverflow();
    });
    resizeObserver.observe(contentElement.value);
  }
});

// Watch for content changes from parent
watch(() => props.page.content, (newContent) => {
  if (contentElement.value && newContent !== contentElement.value.innerHTML) {
    contentElement.value.innerHTML = newContent || '';
    nextTick(() => {
      checkContentOverflow();
    });
  }
}, { deep: true });

// Helper function to check if element is truly empty - improved version
const isElementEmpty = (element) => {
  if (!element) return true;
  
  // Check innerHTML first - fastest way to detect truly empty content
  if (!element.innerHTML || element.innerHTML === '' || 
      element.innerHTML === '<br>' || element.innerHTML === '<div><br></div>') {
    return true;
  }
  
  // Then check text content as a fallback
  const text = element.textContent || element.innerText || '';
  const trimmedText = text.trim();
  return trimmedText === '' || trimmedText === '\n' || trimmedText === '\r\n';
};

// Helper function to clean up empty elements
const cleanupElement = (element) => {
  if (!element) return;
  
  if (isElementEmpty(element)) {
    element.innerHTML = '';
  }
};

// NEW: Handle content click to check if page is full
const handleContentClick = (event) => {
  // Check if the page is full
  if (isPageFull.value) {
    // If the page is full, prevent editing and move to the next page
    event.preventDefault();
    emit('focus-next-page', props.pageIndex);
  }
};

// Check for content overflow
const checkContentOverflow = () => {
  // Don't check for overflow if we're handling a backspace deletion
  if (isBackspacePressed.value) return;
  
  if (!contentElement.value) return;
  
  const contentHeight = contentElement.value.scrollHeight;
  const clientHeight = contentElement.value.clientHeight;
  
  // Check if the page is full (at or near capacity)
  isPageFull.value = contentHeight >= AVAILABLE_CONTENT_HEIGHT * 0.98 || 
                     contentHeight >= clientHeight * 0.98;
  
  // Use a more aggressive threshold for overflow detection
  if (contentHeight > AVAILABLE_CONTENT_HEIGHT || contentHeight > clientHeight) {
    handleOverflow();
  }
};

// Handle content overflow by splitting content
const handleOverflow = () => {
  if (!contentElement.value) return;
  
  const textContent = contentElement.value.textContent;
  
  const splitPoint = findSplitPoint(textContent, AVAILABLE_CONTENT_HEIGHT);
  
  if (splitPoint > 0) {
    const remainingText = textContent.substring(0, splitPoint);
    const overflowText = textContent.substring(splitPoint);
    
    contentElement.value.textContent = remainingText;
    
    emit('content-overflow', {
      pageIndex: props.pageIndex,
      remainingContent: contentElement.value.innerHTML,
      overflowContent: overflowText
    });
  }
};

// Find optimal split point for content - same logic as ChapterPage
const findSplitPoint = (text, maxHeight) => {
  const tempElement = document.createElement('div');
  tempElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${contentElement.value.offsetWidth}px;
    font-family: 'Caveat', cursive;
    font-size: clamp(1.6rem, 1.2vw, 1.6rem);
    line-height: 1.8;
    padding: 0;
    margin: 0;
  `;
  document.body.appendChild(tempElement);
  
  let splitPoint = 0;
  const words = text.split(' ');
  let currentText = '';
  
  const adjustedMaxHeight = maxHeight * 0.95;
  
  for (let i = 0; i < words.length; i++) {
    const testText = currentText + (currentText ? ' ' : '') + words[i];
    tempElement.textContent = testText;
    
    if (tempElement.scrollHeight > adjustedMaxHeight) {
      break;
    }
    
    currentText = testText;
    splitPoint = testText.length;
  }
  
  document.body.removeChild(tempElement);
  return splitPoint;
};

// Check if cursor is at the start of content - improved version
const isAtStartOfContent = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  
  const range = selection.getRangeAt(0);
  const element = contentElement.value;
  
  // Check if both start and end offsets are 0
  return range.startOffset === 0 && 
         range.endOffset === 0 && 
         range.startContainer === element.firstChild || 
         (range.startContainer === element && element.childNodes.length === 0);
};

// Handle keydown events (before the key action is processed)
const handleContentKeydown = (event) => {
  // If the page is full and the key would add content, prevent it and move to next page
  if (isPageFull.value && 
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete', 'Home', 'End'].includes(event.key) &&
      !event.ctrlKey && !event.metaKey) {
    console.log('Page is full, redirecting input to next page');
    event.preventDefault();
    emit('focus-next-page', props.pageIndex);
    return;
  }
  
  // Handle backspace on empty page
  if (event.key === 'Backspace') {
    console.log('Backspace pressed, checking conditions...');
    console.log('Is page empty?', isElementEmpty(contentElement.value));
    console.log('Is cursor at start?', isAtStartOfContent());
    
    // Check if the page is empty and cursor is at the start
    if (isElementEmpty(contentElement.value) || isAtStartOfContent()) {
      console.log('Conditions met for page deletion');
      
      // Only delete if this is not the first page (index > 0)
      if (props.pageIndex > 0) {
        console.log('Deleting page at index:', props.pageIndex);
        
        // Set flag to prevent overflow checks during deletion
        isBackspacePressed.value = true;
        
        // Prevent default backspace behavior
        event.preventDefault();
        event.stopPropagation();
        
        // Emit delete event
        emit('delete-page', props.pageIndex);
        
        // Reset flag after a short delay
        setTimeout(() => {
          isBackspacePressed.value = false;
        }, 300);
        
        return;
      }
    }
  }
};

const handleContentInput = () => {
  // Don't process input events during backspace deletion
  if (isBackspacePressed.value) return;
  
  cleanupElement(contentElement.value);
  emit('update:content', { 
    index: props.pageIndex, 
    content: contentElement.value?.innerHTML || '' 
  });
  
  nextTick(() => {
    checkContentOverflow();
  });
};

const handleContentKeyup = (event) => {
  // Don't process keyup events during backspace deletion
  if (isBackspacePressed.value) return;
  
  if (['Enter', 'Space', 'Backspace', 'Delete'].includes(event.code) || 
      event.key.length === 1) {
    checkContentOverflow();
  }
  
  if (event.key === 'ArrowDown' && isAtEndOfContent()) {
    emit('focus-next-page', props.pageIndex);
  } else if (event.key === 'ArrowUp' && isAtStartOfContent()) {
    emit('focus-previous-page', props.pageIndex);
  }
};

// Check if cursor is at the end of content
const isAtEndOfContent = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return false;
  
  const range = selection.getRangeAt(0);
  const element = contentElement.value;
  
  return range.endOffset === element.textContent.length;
};

defineExpose({
  focusContent: () => contentElement.value?.focus(),
  // Expose a method to position cursor at the end
  focusContentAtEnd: () => {
    if (!contentElement.value) return;
    
    contentElement.value.focus();
    
    // Position cursor at the end
    const range = document.createRange();
    const selection = window.getSelection();
    
    // Find the last text node
    let lastNode = contentElement.value;
    while (lastNode.lastChild) {
      if (lastNode.lastChild.nodeType === Node.TEXT_NODE) {
        lastNode = lastNode.lastChild;
        break;
      } else {
        lastNode = lastNode.lastChild;
      }
    }
    
    // If we found a text node, position cursor at its end
    if (lastNode.nodeType === Node.TEXT_NODE) {
      range.setStart(lastNode, lastNode.textContent.length);
      range.setEnd(lastNode, lastNode.textContent.length);
    } else {
      // Fallback: position at end of element
      range.selectNodeContents(contentElement.value);
      range.collapse(false);
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
</script>

<style scoped>
.page {
  background: white;
  width: 90vh;
  max-width: 100%;
  height: 127.26vh;
  padding: 6vh 8vh;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #e0e0e0;
  margin: 10px 0;
  overflow: hidden;
}

.page-content {
  font-size: clamp(1.6rem, 1.2vw, 1.6rem);
  line-height: 1.8;
  color: #333;
  margin: 0;
  text-align: justify;
  font-weight: 400;
  min-height: 3rem;
  outline: none;
  font-family: 'Caveat', cursive;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: calc(127.26vh - 6vh - 6vh - 2rem); /* Adjusted for NormalPage without title */
  direction: ltr;
  unicode-bidi: normal;
}

.page-content:empty::before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
}

/* Remove outline from editable elements when focused */
[contenteditable="true"]:focus {
  outline: none;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .page {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1.5rem;
  }
  
  .page-content {
    font-size: 1rem;
    line-height: 1.7;
  }
}
</style>
