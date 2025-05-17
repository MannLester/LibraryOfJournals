<template>
  <div class="min-h-screen bg-paper">
    <!-- Header will be imported in App.vue -->
    
    <!-- Hero Section -->
    <section class="py-16 text-center">
      <h1 class="text-6xl font-cormorant font-semibold text-signup-pink mb-3">Library of Journals</h1>
      <p class="text-gray-600 text-xl font-roboto italic">Where your story matters...</p>
    </section>
    
    <!-- Journal Preview Section -->
    <section class="max-w-4xl mx-auto py-8 px-4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden border-l-8 border-signup-pink">
        <!-- Journal Header -->
        <div class="p-6 bg-paper border-b">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-3xl font-cormorant font-bold">Morning Reflections</h2>
              <p class="text-gray-500 text-sm">May 15, 2023</p>
            </div>
            <div class="flex space-x-4">
              <button class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Add tag</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </button>
              <button class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Record audio</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button class="text-gray-500 hover:text-gray-700">
                <span class="sr-only">Book mode</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Journal Content -->
        <div class="p-6 bg-paper">
          <p class="font-cormorant text-lg italic leading-relaxed">
            Today I woke up with a sense of clarity I haven't felt in months. The morning light filtered through my curtains differently, casting patterns that seemed to speak of new beginnings...
          </p>
        </div>
        
        <!-- Journal Footer -->
        <div class="px-6 py-3 bg-paper border-t flex justify-between items-center">
          <div class="text-sm text-gray-500">Page 1 of 3</div>
          <button class="flex items-center text-gray-700 hover:text-signup-pink transition">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Landing page component logic can be added here
</script>

<style scoped>
/* Any additional component-specific styles */
</style>
