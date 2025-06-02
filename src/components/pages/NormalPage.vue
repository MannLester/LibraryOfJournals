<template>
  <div class="page" ref="pageElement">
    <div 
      class="page-content"
      contenteditable="true"
      data-placeholder="Continue writing..."
      @input="handleContentInput"
      @keyup="handleContentKeyup"
      @paste="handleContentInput"
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
  'focus-previous-page'
]);

const pageElement = ref(null);
const contentElement = ref(null);

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

const handleContentInput = () => {
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

// Check if cursor is at the start of content
const isAtStartOfContent = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return false;
  
  const range = selection.getRangeAt(0);
  
  return range.startOffset === 0;
};

defineExpose({
  focusContent: () => contentElement.value?.focus()
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
