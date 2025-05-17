<template>
  <!-- Journal Preview Component with isolation -->
  <div class="journal-preview">
    <!-- Container that creates an isolated stacking context -->
    <div class="journal-container">
      <!-- Background rotated white square on left with shadow -->
      <div class="absolute left-[-35%] bottom-[20%] w-[40%] h-[80%] bg-white rounded-lg shadow-xl" 
           style="transform: rotate(18deg); z-index: 5; box-shadow: 2px 4px 20px rgba(0,0,0,0.08);"></div>
      
      <!-- NEW: Background rotated white square on right with shadow -->
      <div class="absolute right-[-48%] bottom-[10%] w-[40%] h-[90%] bg-white rounded-lg shadow-xl" 
           style="transform: rotate(-18deg); z-index: 5; box-shadow: 2px 4px 20px rgba(0,0,0,0.08);"></div>
      
      <!-- Paper effect with shadow/fold styling -->
      <div class="rounded-lg shadow-lg overflow-hidden relative transform rotate-0" 
           style="background-color: #f5efd5; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transform-style: preserve-3d; z-index: 10;">
      <!-- Journal Header -->
      <div class="p-6 border-b border-gray-100" style="background-color: #f5efd5;">
        <div class="flex justify-between items-center">
          <div class="text-left">
            <h2 class="text-3xl font-cormorant font-bold">{{ title }}</h2>
            <p class="text-gray-500 text-sm mt-1">{{ date }}</p>
          </div>
          <div class="flex space-x-4">
            <button class="text-gray-500 hover:text-gray-700">
              <span class="sr-only">Add tag</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </button>
            <button class="text-gray-500 hover:text-gray-700">
              <span class="sr-only">Record audio</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button class="text-gray-500 hover:text-gray-700">
              <span class="sr-only">Book mode</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Journal Content - with handwritten style -->
      <div class="p-8 min-h-[200px]" style="background-color: #f5efd5;">
        <p class="font-caveat text-2xl leading-relaxed text-gray-800 text-center">
          {{ content }}
        </p>
      </div>
      
      <!-- Journal Footer with page number and next button -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center" style="background-color: #f5efd5;">
        <!-- Previous Button - Only show if not on first page -->
        <div class="w-1/3 flex justify-start">
          <button 
            v-if="currentPage > 1"
            class="flex items-center text-gray-700 hover:text-signup-pink transition-colors duration-200"
            @click="prevPage"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
        </div>
        
        <!-- Page Counter -->
        <div class="w-1/3 text-center">
          <div class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</div>
        </div>
        
        <!-- Next Button - Only show if not on last page -->
        <div class="w-1/3 flex justify-end">
          <button 
            v-if="currentPage < totalPages"
            class="flex items-center text-gray-700 hover:text-signup-pink transition-colors duration-200"
            @click="nextPage"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Add subtle folded corner effect -->
      <div class="absolute bottom-0 right-0 w-16 h-16 bg-gray-100 transform rotate-45 translate-x-8 translate-y-8 opacity-50 pointer-events-none"></div>
      </div>
      
      <!-- Add page shadow underneath -->
      <div class="absolute bottom-0 left-0 right-0 h-4 bg-gray-800 opacity-5 rounded-b-full blur-md transform translate-y-2 mx-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Morning Reflections'
  },
  date: {
    type: String,
    default: 'May 15, 2023'
  },
  content: {
    type: String,
    default: 'Today I woke up with a sense of clarity I haven\'t felt in months. The morning light filtered through my curtains differently, casting patterns that seemed to speak of new beginnings...'
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 3
  }
});

// Methods to emit events when navigation buttons are clicked
const emit = defineEmits(['next-page', 'prev-page']);

function nextPage() {
  emit('next-page');
}

function prevPage() {
  emit('prev-page');
}
</script>

<style scoped>
.journal-preview {
  position: relative;
  width: 100%;
}

.journal-container {
  position: relative;
  isolation: isolate; /* Creates a new stacking context */
  background-color: transparent;
}
</style>
