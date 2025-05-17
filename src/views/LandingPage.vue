<template>
  <div class="min-h-screen" style="position: relative; background-color: #F5F3EE;">
    <!-- Solid background color for now -->
    <!-- Header will be imported in App.vue -->
    
    <!-- Hero Section -->
    <section class="pt-12 pb-6 text-center">
      <h1 class="text-8xl font-cormorant font-semibold text-signup-pink mb-3">Library of Journals</h1>
      <p class="text-gray-600 text-4xl font-caveat italic">Where your story matters...</p>
    </section>
    
    <!-- Journal Preview Section -->
    <section class="max-w-4xl mx-auto px-4 relative mt-4">
      <JournalPreview 
        @next-page="handleNextPage" 
        :current-page="currentPage" 
        :total-pages="totalPages"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JournalPreview from '../components/JournalPreview.vue';

// State for journal pagination
const currentPage = ref(1);
const totalPages = ref(3);

// Handler for next page button click
function handleNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
</script>

<style scoped>
/* Component-specific styles */
.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.landing-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
}
</style>
