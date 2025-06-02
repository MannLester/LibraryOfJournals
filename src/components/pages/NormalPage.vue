<template>
  <div class="page" ref="pageElement">
    <div 
      class="page-content"
      contenteditable="true"
      data-placeholder="Continue writing..."
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
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
  'create-next-page',
  'delete-current-page',
  'focus-previous-page'
]);

const pageElement = ref(null);
const contentElement = ref(null);

onMounted(() => {
  if (contentElement.value) {
    contentElement.value.innerHTML = props.page.content || '';
    // Ensure placeholder shows if empty
    updatePlaceholderVisibility();
    nextTick(() => {
      checkForOverflow();
    });
  }
});

// Watch for content changes from parent
watch(() => props.page.content, (newContent) => {
  if (contentElement.value && newContent !== contentElement.value.innerHTML) {
    contentElement.value.innerHTML = newContent || '';
    updatePlaceholderVisibility();
    nextTick(() => {
      checkForOverflow();
    });
  }
});

// Check if content is empty
const isEmpty = () => {
  if (!contentElement.value) return true;
  const text = contentElement.value.textContent || '';
  const html = contentElement.value.innerHTML || '';
  
  // Check for truly empty content
  return text.trim() === '' || html.trim() === '' || html === '<br>' || html === '<div><br></div>';
};

// Update placeholder visibility
const updatePlaceholderVisibility = () => {
  if (!contentElement.value) return;
  
  if (isEmpty()) {
    contentElement.value.classList.add('empty');
    // Ensure the element is truly empty for CSS :empty selector
    if (contentElement.value.innerHTML.trim() !== '') {
      contentElement.value.innerHTML = '';
    }
  } else {
    contentElement.value.classList.remove('empty');
  }
};

// Check if cursor is at start
const isAtStart = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;
  
  const range = selection.getRangeAt(0);
  return range.startOffset === 0 && range.collapsed;
};

// FIXED: Check for content overflow using actual element dimensions
const checkForOverflow = () => {
  if (!contentElement.value) return;
  
  const element = contentElement.value;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  
  console.log('Checking overflow:', { scrollHeight, clientHeight, overflowing: scrollHeight > clientHeight });
  
  // If content is scrolling (overflowing), handle it
  if (scrollHeight > clientHeight) {
    console.log('Content is overflowing, handling...');
    handleOverflow();
  }
};

// IMPROVED: Handle content overflow by moving excess to next page
const handleOverflow = () => {
  if (!contentElement.value) return;
  
  const content = contentElement.value.textContent;
  if (!content || content.trim() === '') return;
  
  console.log('Handling overflow for content:', content.substring(0, 50) + '...');
  
  // Get current cursor position
  const selection = window.getSelection();
  let cursorPosition = 0;
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    cursorPosition = range.startOffset;
    
    // If cursor is in a text node, get the position relative to the whole content
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const walker = document.createTreeWalker(
        contentElement.value,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let textOffset = 0;
      let node;
      while (node = walker.nextNode()) {
        if (node === range.startContainer) {
          cursorPosition = textOffset + range.startOffset;
          break;
        }
        textOffset += node.textContent.length;
      }
    }
  }
  
  // Find split point using actual element measurements
  const splitPoint = findOptimalSplitPoint(content);
  
  console.log('Split point found:', splitPoint, 'of', content.length, 'cursor at:', cursorPosition);
  
  if (splitPoint > 0 && splitPoint < content.length) {
    const currentPageContent = content.substring(0, splitPoint).trim();
    const nextPageContent = content.substring(splitPoint).trim();
    
    console.log('Splitting content:', { currentPageContent: currentPageContent.substring(0, 30), nextPageContent: nextPageContent.substring(0, 30) });
    
    // Update current page
    contentElement.value.textContent = currentPageContent;
    updatePlaceholderVisibility();
    
    emit('update:content', { 
      index: props.pageIndex, 
      content: contentElement.value.innerHTML 
    });
    
    // Create next page with overflow content
    emit('create-next-page', {
      pageIndex: props.pageIndex,
      overflowContent: nextPageContent,
      shouldFocusAtEnd: cursorPosition >= splitPoint // Focus at end if cursor was in the moved content
    });
  }
};

// FIXED: Find optimal split point using actual element dimensions
const findOptimalSplitPoint = (text) => {
  if (!contentElement.value) return 0;
  
  const element = contentElement.value;
  const originalContent = element.textContent;
  const maxHeight = element.clientHeight;
  
  console.log('Finding split point, maxHeight:', maxHeight);
  
  // Binary search for the optimal split point
  let low = 0;
  let high = text.length;
  let bestSplit = 0;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testText = text.substring(0, mid);
    
    // Test this content length
    element.textContent = testText;
    const testHeight = element.scrollHeight;
    
    console.log('Testing split at', mid, 'height:', testHeight, 'vs max:', maxHeight);
    
    if (testHeight <= maxHeight) {
      bestSplit = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  // Restore original content
  element.textContent = originalContent;
  
  // Try to split at word boundary near the best split point
  if (bestSplit > 0) {
    const nearbySpace = text.lastIndexOf(' ', bestSplit);
    if (nearbySpace > bestSplit * 0.8) { // Only use word boundary if it's close enough
      bestSplit = nearbySpace;
    }
  }
  
  console.log('Final split point:', bestSplit);
  return bestSplit;
};

// Handle all input events
const handleInput = (event) => {
  updatePlaceholderVisibility();
  
  // Update content
  emit('update:content', { 
    index: props.pageIndex, 
    content: contentElement.value?.innerHTML || '' 
  });
  
  // Check for overflow after input with a small delay to ensure DOM is updated
  setTimeout(() => {
    checkForOverflow();
  }, 10);
};

// Handle paste events
const handlePaste = (event) => {
  // Let the paste happen naturally, then check for overflow
  setTimeout(() => {
    updatePlaceholderVisibility();
    handleInput(event);
  }, 10);
};

// Handle key events
const handleKeydown = (event) => {
  // Handle backspace at start of empty page
  if (event.key === 'Backspace' && isEmpty() && isAtStart()) {
    if (props.pageIndex > 0) { // Don't delete the first page
      event.preventDefault();
      emit('delete-current-page', props.pageIndex);
    }
    return;
  }
  
  // Handle Enter key - check for overflow after
  if (event.key === 'Enter') {
    setTimeout(() => {
      updatePlaceholderVisibility();
      checkForOverflow();
    }, 10);
  }
  
  // For other keys that might change content
  if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
    setTimeout(() => {
      updatePlaceholderVisibility();
      checkForOverflow();
    }, 10);
  }
};

// Expose methods for parent component
defineExpose({
  focus: () => {
    if (contentElement.value) {
      contentElement.value.focus();
    }
  },
  
  focusAtEnd: () => {
    if (contentElement.value) {
      contentElement.value.focus();
      
      // Ensure there's content to position cursor after
      if (contentElement.value.textContent.length > 0) {
        // Move cursor to end of text content
        const range = document.createRange();
        const selection = window.getSelection();
        
        // Find the last text node
        const walker = document.createTreeWalker(
          contentElement.value,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let lastTextNode = null;
        let node;
        while (node = walker.nextNode()) {
          lastTextNode = node;
        }
        
        if (lastTextNode) {
          range.setStart(lastTextNode, lastTextNode.textContent.length);
          range.setEnd(lastTextNode, lastTextNode.textContent.length);
        } else {
          // Fallback: position at end of element
          range.selectNodeContents(contentElement.value);
          range.collapse(false);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Scroll into view
      contentElement.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  },
  
  focusAtStart: () => {
    if (contentElement.value) {
      contentElement.value.focus();
      
      // Move cursor to start
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentElement.value);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
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
  max-height: calc(127.26vh - 6vh - 6vh - 2rem);
  direction: ltr;
  unicode-bidi: normal;
}

/* FIXED: Better placeholder handling */
.page-content:empty::before,
.page-content.empty::before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
  display: block;
}

[contenteditable="true"]:focus {
  outline: none;
}

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
