<template>
  <div class="min-h-screen bg-paper">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header with Title and Search/Filter buttons -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">My Library</h1>
        <div class="search-filter-container flex gap-3">
          <!-- Search Input -->
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search journals..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-signup-pink focus:border-transparent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <!-- Filter Dropdown -->
          <div class="relative">
            <button 
              @click="toggleFilterMenu"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
            
            <!-- Filter Dropdown Menu -->
            <div v-if="showFilterMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div class="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-200">Sort by</div>
              <button @click="sortBy('date')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Date (newest first)
              </button>
              <button @click="sortBy('title')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Title (A-Z)
              </button>
              <button @click="sortBy('chapters')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Most Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Journal Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Journal Card 1 -->
        <div v-for="journal in filteredJournals" :key="journal.id" class="journal-card rounded-md overflow-hidden shadow-sm border border-gray-100">
          <div class="journal-content h-64 flex items-center justify-center" :style="{ backgroundColor: journal.color }">
            <!-- Privacy Icon -->
            <div class="absolute top-4 right-4">
              <svg v-if="journal.private" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 class="text-xl font-bold text-center">{{ journal.title }}</h2>
          </div>
          <div class="journal-info p-4 bg-white text-sm text-gray-600">
            <div class="flex flex-col space-y-1">
              <div>Started: {{ formatDate(journal.startDate) }}</div>
              <div>Last updated: {{ formatDate(journal.lastUpdated) }}</div>
              <div>{{ journal.chapters }} chapters</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State (shown when no journals match filter) -->
      <div v-if="filteredJournals.length === 0" class="mt-8 text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="text-xl font-medium text-gray-500 mb-2">No journals found</h3>
        <p class="text-gray-400 max-w-md mx-auto">Try adjusting your search or filter settings to find what you're looking for.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Search and filter state
const searchQuery = ref('');
const showFilterMenu = ref(false);
const currentSort = ref('date');

// Sample journals data
const journals = ref([
  {
    id: '1',
    title: 'Morning Reflections',
    private: true,
    color: '#ffcdd2', // Light pink
    startDate: new Date('2023-01-01'),
    lastUpdated: new Date('2023-05-15'),
    chapters: 24
  },
  {
    id: '2',
    title: 'Travel Memories',
    private: false,
    color: '#bbdefb', // Light blue
    startDate: new Date('2023-03-12'),
    lastUpdated: new Date('2023-05-10'),
    chapters: 15
  },
  {
    id: '3',
    title: 'Creative Ideas',
    private: false,
    color: '#fff9c4', // Light yellow
    startDate: new Date('2023-04-05'),
    lastUpdated: new Date('2023-05-12'),
    chapters: 8
  },
  {
    id: '4',
    title: 'Daily Gratitude',
    private: true,
    color: '#c8e6c9', // Light green
    startDate: new Date('2023-02-15'),
    lastUpdated: new Date('2023-05-16'),
    chapters: 42
  }
]);

// Format date to more readable form
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Toggle filter menu visibility
function toggleFilterMenu(): void {
  showFilterMenu.value = !showFilterMenu.value;
}

// Sort journals by different criteria
function sortBy(criteria: string): void {
  currentSort.value = criteria;
  showFilterMenu.value = false;
}

// Filter and sort journals based on search query and sort criteria
const filteredJournals = computed(() => {
  let result = [...journals.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(journal => 
      journal.title.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  if (currentSort.value === 'date') {
    result.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  } else if (currentSort.value === 'title') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort.value === 'chapters') {
    result.sort((a, b) => b.chapters - a.chapters);
  }
  
  return result;
});

// Close filter menu when clicking outside (register in onMounted if needed)
function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showFilterMenu.value = false;
  }
}

// Register and unregister outside click handler
document.addEventListener('click', handleClickOutside);
</script>

<style scoped>

.min-h-screen {
  min-height: 100vh;
}

.bg-paper {
  background-color: #fcfaf7;
  position: relative;
  isolation: isolate;
}

.bg-paper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/home_page_design.png');
  background-repeat: repeat;
  background-size: auto;
  background-position: center;
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
}

.journal-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.journal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.journal-content {
  position: relative;
}
</style>
