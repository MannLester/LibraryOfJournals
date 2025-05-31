<template>
  <div class="page">
    <div 
      class="page-title" 
      ref="titleElement"
      contenteditable="true"
      data-placeholder="Untitled Chapter"
      @input="handleTitleInput"
      @keyup="handleTitleInput"
      @paste="handleTitleInput"
    ></div>
    <div 
      class="page-content" 
      ref="firstPageElement"
      contenteditable="true"
      data-placeholder="Start writing here..."
      @input="handleFirstPageInput"
      @keyup="handleFirstPageInput"
      @paste="handleFirstPageInput"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits([
  'update:title',
  'update:content',
  'add-new-page',
  'focus-content'
]);

const titleElement = ref(null);
const firstPageElement = ref(null);

// Focus the title when component is mounted
onMounted(() => {
  if (titleElement.value) {
    titleElement.value.focus();
  }
});

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
  
  // If the element is empty, clear any HTML but keep the element itself
  if (isElementEmpty(element)) {
    element.innerHTML = '';
  }
};

// Content input handlers with cleanup
const handleTitleInput = () => {
  cleanupElement(titleElement.value);
  emit('update:title', titleElement.value?.innerHTML || '');
};

const handleFirstPageInput = () => {
  cleanupElement(firstPageElement.value);
  emit('update:content', firstPageElement.value?.innerHTML || '');
};

defineExpose({
  focusTitle: () => titleElement.value?.focus(),
  focusContent: () => firstPageElement.value?.focus()
});
</script>

<style scoped>
.page {
  background: #f5efd5; /* Beige background */
  width: 100%;
  min-height: 100%;
  padding: 2.5cm;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #e0e0e0;
  margin: 10px 0;
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

/* Set Caveat font for all editable content */
[contenteditable="true"] {
  font-family: 'Caveat', cursive;
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
