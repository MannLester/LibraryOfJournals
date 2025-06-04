<template>
  <div class="page" :class="{ 
    'double-page-left': isDoublePageLeft, 
    'double-page-right': isDoublePageRight 
  }" ref="pageElement">
    <div 
      class="page-title" 
      ref="titleElement"
      contenteditable="true"
      data-placeholder="Untitled Chapter"
      @input="handleTitleInput"
      @keydown="handleTitleKeydown"
      :style="{
        paddingLeft: isDoublePageLeft ? '12vh' : '8vh',
        paddingRight: isDoublePageRight ? '12vh' : '8vh'
      }"
    ></div>
    <div 
      class="page-content" 
      ref="contentElement"
      contenteditable="true"
      data-placeholder="Start writing here..."
      @input="handleContentInput"
      @keydown="handleContentKeydown"
      @paste="handleContentPaste"
      :style="{
        paddingLeft: isDoublePageLeft ? '12vh' : '8vh',
        paddingRight: isDoublePageRight ? '12vh' : '8vh'
      }"
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
  },
  isDoublePageLeft: {
    type: Boolean,
    default: false
  },
  isDoublePageRight: {
    type: Boolean,
    default: false
  },
  isInDoublePageMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:title',
  'update:content',
  'create-next-page',
  'push-overflow-to-next-page', // New event for pushing content to existing page
  'focus-next-page'
]);

const pageElement = ref(null);
const titleElement = ref(null);
const contentElement = ref(null);

onMounted(() => {
  if (titleElement.value) {
    titleElement.value.innerHTML = props.page.title || '';
    updateTitlePlaceholder();
  }
  if (contentElement.value) {
    contentElement.value.innerHTML = props.page.content || '';
    updateContentPlaceholder();
    nextTick(() => {
      checkForOverflow();
    });
  }
});

// Watch for content changes
watch(() => props.page.content, (newContent) => {
  if (contentElement.value && newContent !== contentElement.value.innerHTML) {
    contentElement.value.innerHTML = newContent || '';
    updateContentPlaceholder();
    nextTick(() => {
      checkForOverflow();
    });
  }
});

watch(() => props.page.title, (newTitle) => {
  if (titleElement.value && newTitle !== titleElement.value.innerHTML) {
    titleElement.value.innerHTML = newTitle || '';
    updateTitlePlaceholder();
  }
});

// Check if element is empty
const isElementEmpty = (element) => {
  if (!element) return true;
  const text = element.textContent || '';
  const html = element.innerHTML || '';
  return text.trim() === '' || html.trim() === '' || html === '<br>' || html === '<div><br></div>';
};

// Update placeholder visibility for title
const updateTitlePlaceholder = () => {
  if (!titleElement.value) return;
  
  if (isElementEmpty(titleElement.value)) {
    titleElement.value.classList.add('empty');
    if (titleElement.value.innerHTML.trim() !== '') {
      titleElement.value.innerHTML = '';
    }
  } else {
    titleElement.value.classList.remove('empty');
  }
};

// Update placeholder visibility for content
const updateContentPlaceholder = () => {
  if (!contentElement.value) return;
  
  if (isElementEmpty(contentElement.value)) {
    contentElement.value.classList.add('empty');
    if (contentElement.value.innerHTML.trim() !== '') {
      contentElement.value.innerHTML = '';
    }
  } else {
    contentElement.value.classList.remove('empty');
  }
};

// Check for content overflow using actual element dimensions
const checkForOverflow = () => {
  if (!contentElement.value) return;
  
  const element = contentElement.value;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;
  
  console.log('Chapter page checking overflow:', { scrollHeight, clientHeight, overflowing: scrollHeight > clientHeight });
  
  if (scrollHeight > clientHeight) {
    console.log('Chapter page content is overflowing, handling...');
    handleOverflow();
  }
};

// FIXED: Handle content overflow with "ripple effect" to existing pages
// Modify the handleOverflow function to preserve cursor position
const handleOverflow = () => {
  if (!contentElement.value) return;
  
  const content = contentElement.value.textContent;
  if (!content || content.trim() === '') return;
  
  console.log('Chapter page handling overflow for content:', content.substring(0, 50) + '...');
  
  // Save cursor position and selection before modifying content
  const selection = window.getSelection();
  let cursorPosition = 0;
  let selectionRange = null;
  
  if (selection.rangeCount > 0) {
    selectionRange = selection.getRangeAt(0).cloneRange();
    
    // Get cursor position relative to the content element
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
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
  }
  
  const splitPoint = findOptimalSplitPoint(content);
  
  console.log('Chapter page split point found:', splitPoint, 'of', content.length, 'cursor at:', cursorPosition);
  
  if (splitPoint > 0 && splitPoint < content.length) {
    const currentPageContent = content.substring(0, splitPoint).trim();
    const overflowContent = content.substring(splitPoint).trim();
    
    console.log('Chapter page splitting content:', { currentPageContent: currentPageContent.substring(0, 30), overflowContent: overflowContent.substring(0, 30) });
    
    // Update current page
    contentElement.value.textContent = currentPageContent;
    updateContentPlaceholder();
    
    emit('update:content', { 
      index: props.pageIndex, 
      content: contentElement.value.innerHTML 
    });
    
    // Check if next page already exists
    const nextPageIndex = props.pageIndex + 1;
    
    // Emit event to push overflow to next page (parent will handle creating or updating)
    emit('push-overflow-to-next-page', {
      pageIndex: props.pageIndex,
      nextPageIndex: nextPageIndex,
      overflowContent: overflowContent
    });
    
    // Restore cursor position if it was in the content that remains on this page
    if (cursorPosition <= splitPoint) {
      // Cursor was in content that stays on this page - restore position
      nextTick(() => {
        // Focus the element first
        contentElement.value.focus();
        
        // Try to restore the exact selection if possible
        if (selectionRange) {
          try {
            // Create a new range at the same position
            const newRange = document.createRange();
            const selection = window.getSelection();
            
            // Find the appropriate text node and offset
            const walker = document.createTreeWalker(
              contentElement.value,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            
            let textOffset = 0;
            let targetNode = null;
            let targetOffset = 0;
            let node;
            
            while (node = walker.nextNode()) {
              const nodeLength = node.textContent.length;
              if (textOffset + nodeLength >= cursorPosition) {
                targetNode = node;
                targetOffset = cursorPosition - textOffset;
                break;
              }
              textOffset += nodeLength;
            }
            
            // If we found a suitable node, set the selection
            if (targetNode) {
              newRange.setStart(targetNode, targetOffset);
              newRange.setEnd(targetNode, targetOffset);
              selection.removeAllRanges();
              selection.addRange(newRange);
              
              // Ensure the cursor is visible
              const rect = newRange.getBoundingClientRect();
              if (rect) {
                contentElement.value.scrollIntoView({
                  behavior: 'auto',
                  block: 'nearest'
                });
              }
            } else {
              // Fallback: position at end of content
              focusContentAtEnd();
            }
          } catch (e) {
            console.error('Error restoring cursor position:', e);
            // Fallback: focus at end
            focusContentAtEnd();
          }
        } else {
          // Fallback: focus at end
          focusContentAtEnd();
        }
      });
    } else {
      // Cursor was in content that moved to next page - focus next page
      console.log('Cursor was in moved content, focusing next page');
      nextTick(() => {
        // Emit event to focus the next page at the beginning
        emit('focus-next-page', {
          pageIndex: props.pageIndex,
          nextPageIndex: props.pageIndex + 1,
          cursorOffset: cursorPosition - splitPoint
        });
      });
    }
  }
};

// Find optimal split point using actual element dimensions
const findOptimalSplitPoint = (text) => {
  if (!contentElement.value) return 0;
  
  const element = contentElement.value;
  const originalContent = element.textContent;
  const maxHeight = element.clientHeight;
  
  console.log('Chapter page finding split point, maxHeight:', maxHeight);
  
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
    if (nearbySpace > bestSplit * 0.8) {
      bestSplit = nearbySpace;
    }
  }
  
  console.log('Chapter page final split point:', bestSplit);
  return bestSplit;
};

// Handle title input
const handleTitleInput = () => {
  updateTitlePlaceholder();
  emit('update:title', titleElement.value?.innerHTML || '');
};

// Handle title keydown
const handleTitleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    contentElement.value?.focus();
  }
  
  // Update placeholder for other keys
  setTimeout(() => {
    updateTitlePlaceholder();
  }, 10);
};

// Handle content input
const handleContentInput = () => {
  updateContentPlaceholder();
  
  emit('update:content', { 
    index: props.pageIndex, 
    content: contentElement.value?.innerHTML || '' 
  });
  
  setTimeout(() => {
    checkForOverflow();
  }, 10);
};

// Handle content paste
const handleContentPaste = (event) => {
  setTimeout(() => {
    updateContentPlaceholder();
    handleContentInput();
  }, 10);
};

// Handle content keydown
const handleContentKeydown = (event) => {
  if (event.key === 'Enter') {
    setTimeout(() => {
      updateContentPlaceholder();
      checkForOverflow();
    }, 10);
  }
  
  // For other keys that might change content
  if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
    setTimeout(() => {
      updateContentPlaceholder();
      checkForOverflow();
    }, 10);
  }
};

// Expose methods
defineExpose({
  focusTitle: () => {
    if (titleElement.value) {
      titleElement.value.focus();
    }
  },
  
  focusContent: () => {
    if (contentElement.value) {
      contentElement.value.focus();
    }
  },
  
  focusContentAtEnd: () => {
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
      
      contentElement.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  },
  
  // New method to prepend content and check for overflow
  prependContent: (contentToPrepend) => {
    if (!contentElement.value) return;
    
    const currentContent = contentElement.value.textContent || '';
    // Remove the extra space that was causing spacing issues
    contentElement.value.textContent = contentToPrepend + currentContent;
    
    // Check for overflow after prepending
    setTimeout(() => {
      checkForOverflow();
    }, 10);
    
    return contentElement.value.textContent;
  },

  focusAtPosition: (position) => {
    if (!contentElement.value) return;
    
    contentElement.value.focus();
    
    // Find the text node and offset for the given position
    const walker = document.createTreeWalker(
      contentElement.value,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let textOffset = 0;
    let targetNode = null;
    let targetOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (textOffset + nodeLength >= position) {
        targetNode = node;
        targetOffset = position - textOffset;
        break;
      }
      textOffset += nodeLength;
    }
    
    if (targetNode) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(targetNode, targetOffset);
      range.setEnd(targetNode, targetOffset);
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
  padding: 6vh 0; /* Remove horizontal padding from page container */
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
  padding-left: 8vh; /* Default horizontal padding */
  padding-right: 8vh; /* Default horizontal padding */
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
  max-height: calc(127.26vh - 6vh - 6vh - 3.5rem - 3vh);
  padding: 0 8vh; /* Default horizontal padding */
}

/* Better placeholder handling for both title and content */
.page-title:empty::before,
.page-title.empty::before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
  display: block;
}

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
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .page-content {
    padding: 0 2rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1.5rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .page-content {
    font-size: 1rem;
    line-height: 1.7;
    padding: 0 1.5rem;
  }
}
</style>
