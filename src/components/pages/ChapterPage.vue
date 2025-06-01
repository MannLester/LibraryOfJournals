<template>
  <div class="page" ref="pageElement">
    <div 
      class="page-title" 
      ref="titleElement"
      contenteditable="true"
      data-placeholder="Untitled Chapter"
      @input="handleTitleInput"
      @keyup="handleTitleKeyup"
      @paste="handleTitleInput"
    ></div>
    <div 
      class="page-content" 
      ref="contentElement"
      contenteditable="true"
      data-placeholder="Start writing here..."
      @input="handleContentInput"
      @keyup="handleContentKeyup"
      @paste="handleContentInput"
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
  'update:title',
  'update:content',
  'content-overflow',
  'focus-next-page'
]);

const pageElement = ref(null);
const titleElement = ref(null);
const contentElement = ref(null);

// Page height constants (in pixels)
// Reduced the available content height to match visual perception
const PAGE_HEIGHT = 1123; // A4 height at 96 DPI
const CONTENT_PADDING = 120; // Top and bottom padding
const TITLE_HEIGHT = 80; // Approximate title height
// Reduce the available height by a small buffer to trigger overflow earlier
const AVAILABLE_CONTENT_HEIGHT = PAGE_HEIGHT - CONTENT_PADDING - TITLE_HEIGHT - 30; // Added 30px buffer

// Focus the title when component is mounted
onMounted(() => {
  if (titleElement.value) {
    titleElement.value.innerHTML = props.page.title || '';
    titleElement.value.focus();
  }
  if (contentElement.value) {
    contentElement.value.innerHTML = props.page.content || '';
    // Check for overflow on initial render
    nextTick(() => {
      checkContentOverflow();
    });
  }
  
  // Set up a resize observer to check for overflow when the window size changes
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

// Helper function to check if element is truly empty
const isElementEmpty = (element) => {
  if (!element) return true;
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

// Check for content overflow
const checkContentOverflow = () => {
  if (!contentElement.value) return;
  
  const contentHeight = contentElement.value.scrollHeight;
  const clientHeight = contentElement.value.clientHeight;
  
  // Use a more aggressive threshold for overflow detection
  // This helps catch overflow before the user sees scrolling
  if (contentHeight > AVAILABLE_CONTENT_HEIGHT || contentHeight > clientHeight) {
    handleOverflow();
  }
};

// Handle content overflow by splitting content
const handleOverflow = () => {
  if (!contentElement.value) return;
  
  const content = contentElement.value.innerHTML;
  const textContent = contentElement.value.textContent;
  
  // Find a good split point (try to split at word boundaries)
  const splitPoint = findSplitPoint(textContent, AVAILABLE_CONTENT_HEIGHT);
  
  if (splitPoint > 0) {
    const remainingText = textContent.substring(0, splitPoint);
    const overflowText = textContent.substring(splitPoint);
    
    // Update current page content
    contentElement.value.textContent = remainingText;
    
    // Emit overflow event with the split content
    emit('content-overflow', {
      pageIndex: props.pageIndex,
      remainingContent: contentElement.value.innerHTML,
      overflowContent: overflowText
    });
  }
};

// Find optimal split point for content
const findSplitPoint = (text, maxHeight) => {
  // Create a temporary element to measure text height
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
  
  // Use a slightly reduced height threshold to trigger overflow earlier
  const adjustedMaxHeight = maxHeight * 0.95; // 95% of max height
  
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

// Content input handlers
const handleTitleInput = () => {
  cleanupElement(titleElement.value);
  emit('update:title', titleElement.value?.innerHTML || '');
};

const handleTitleKeyup = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    contentElement.value?.focus();
  }
};

const handleContentInput = () => {
  cleanupElement(contentElement.value);
  emit('update:content', { 
    index: props.pageIndex, 
    content: contentElement.value?.innerHTML || '' 
  });
  
  // Check for overflow after content update
  nextTick(() => {
    checkContentOverflow();
  });
};

const handleContentKeyup = (event) => {
  // Check for overflow on key events that might add content
  if (['Enter', 'Space', 'Backspace', 'Delete'].includes(event.code) || 
      event.key.length === 1) {
    // Use immediate check for overflow to prevent visible scrolling
    checkContentOverflow();
  }
  
  // Handle navigation to next page
  if (event.key === 'ArrowDown' && isAtEndOfContent()) {
    emit('focus-next-page', props.pageIndex);
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
  focusTitle: () => titleElement.value?.focus(),
  focusContent: () => contentElement.value?.focus()
});
</script>

<style scoped>
.page {
  background: #f5efd5;
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

.page-title {
  font-size: clamp(2rem, 3.5vw, 2.5rem);
  margin: 0 0 2vh 0;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 1vh;
  line-height: 1.2;
  min-height: 3.5rem;
  outline: none;
  font-family: 'Caveat', cursive;
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
  max-height: calc(127.26vh - 6vh - 6vh - 3.5rem - 3vh); /* Explicit max-height to prevent scrolling */
}

/* Placeholder text styling */
.page-title[contenteditable="true"]:empty::before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
}

.page-content[contenteditable="true"]:empty::before {
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
  
  .page-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-content {
    font-size: 1rem;
    line-height: 1.7;
  }
}
</style>
