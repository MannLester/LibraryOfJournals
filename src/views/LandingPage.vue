<template>
  <div class="min-h-screen landing-bg" style="position: relative;">
    <!-- Solid background color for now -->
    <!-- Header will be imported in App.vue -->
    
    <!-- Hero Section -->
    <section class="pt-12 pb-6 text-center">
      <h1 class="text-8xl font-cormorant font-semibold text-signup-pink mb-3">Library of Journals</h1>
      <p class="text-gray-600 text-4xl font-caveat italic">Where your thoughts find their home...</p>
    </section>
    
    <!-- Journal Preview Section -->
    <section class="max-w-4xl mx-auto px-4 relative mt-4">
      <JournalPreview 
        @next-page="handleNextPage"
        @prev-page="handlePrevPage" 
        :current-page="currentPage" 
        :total-pages="totalPages"
      />
    </section>

    <!-- CTA Section -->
    <section class="flex flex-col items-center justify-center mt-20 mb-14 px-4">
      <h2 class="text-center text-2xl md:text-3xl max-w-3xl mx-auto mb-12 leading-relaxed">
        Your journey deserves to be captured in a space as 
        beautiful as the thoughts within it.
      </h2>
      <div class="flex flex-col md:flex-row gap-5 mb-14">
        <button class="px-9 py-3.5 rounded-full bg-signup-pink text-white font-medium hover:bg-pink-700 transition duration-300 ease-in-out shadow-sm">
          Begin Your Journey
        </button>
        <button class="px-9 py-3.5 rounded-full border border-gray-800 hover:bg-gray-50 transition duration-300 ease-in-out">
          Explore Journals
        </button>
      </div>
      <div class="flex flex-col items-center text-gray-500 mt-2 animate-bounce-slow">
        <span>Scroll to Discover</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Story Section -->
    <section class="text-center mt-55 py-20">
      <div class="relative mx-auto max-w-4xl">
        <h2 class="text-6xl font-cormorant font-black text-black mb-6">Your Story Matters</h2>
        <p class="text-gray-600 text-2xl font-roboto max-w-2xl mx-auto">In a world of noise, your inner voice deserves a sanctuary</p>
      </div>
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

// Handler for previous page button click
function handlePrevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<style scoped>
/* Component-specific styles */
.landing-bg {
  position: relative;
}

.landing-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F5F3EE;
  background-image: url('../assets/bgImage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.2;
  z-index: -1;
}

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
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
