<template>
  <div class="page" ref="pageElement">
    <div 
      class="page-title" 
      ref="titleElement"
      contenteditable="true"
      data-placeholder="Untitled Chapter"
      @input="handleTitleInput"
      @keydown="handleTitleKeydown"
    ></div>
    <div 
      class="page-content" 
      ref="contentElement"
      contenteditable="true"
      data-placeholder="Start writing here..."
      @input="handleContentInput"
      @keydown="handleContentKeydown"
      @paste="handleContentPaste"
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
  'create-next-page'
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

// FIXED: Check for content overflow using actual element dimensions
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

// FIXED: Handle content overflow
const handleOverflow = () => {
  if (!contentElement.value) return;
  
  const content = contentElement.value.textContent;
  if (!content || content.trim() === '') return;
  
  console.log('Chapter page handling overflow for content:', content.substring(0, 50) + '...');
  
  const splitPoint = findOptimalSplitPoint(content);
  
  console.log('Chapter page split point found:', splitPoint, 'of', content.length);
  
  if (splitPoint > 0 && splitPoint < content.length) {
    const currentPageContent = content.substring(0, splitPoint).trim();
    const nextPageContent = content.substring(splitPoint).trim();
    
    console.log('Chapter page splitting content:', { currentPageContent: currentPageContent.substring(0, 30), nextPageContent: nextPageContent.substring(0, 30) });
    
    // Update current page
    contentElement.value.textContent = currentPageContent;
    updateContentPlaceholder();
    
    emit('update:content', { 
      index: props.pageIndex, 
      content: contentElement.value.innerHTML 
    });
    
    // Create next page with overflow
    emit('create-next-page', {
      pageIndex: props.pageIndex,
      overflowContent: nextPageContent
    });
  }
};

// FIXED: Find optimal split point using actual element dimensions
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
  max-height: calc(127.26vh - 6vh - 6vh - 3.5rem - 3vh);
}

/* FIXED: Better placeholder handling for both title and content */
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
    padding: 2rem;
  }
  
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .page-content {
    font-size: 1rem;
    line-height: 1.7;
  }
}
</style>
