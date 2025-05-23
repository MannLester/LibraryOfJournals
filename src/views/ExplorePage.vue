<template>
  <div class="min-h-screen bg-paper">
    <!-- Hero Section with Search -->
    <section class="explore-hero">
      <div class="hero-content">
        <h1>Discover Journals</h1>
        <p class="subtitle">Find inspiration from the community's shared experiences</p>
        
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-input">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search journals, topics, or tags..."
              @keyup.enter="performSearch"
            >
            <button class="search-btn" @click="performSearch">Search</button>
          </div>
        </div>
        
        <!-- Quick Filters -->
        <div class="quick-filters">
          <button 
            v-for="filter in quickFilters" 
            :key="filter.id"
            :class="['filter-chip', { active: activeFilter === filter.id }]"
            @click="setActiveFilter(filter.id)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- Main Content -->
    <div class="explore-container">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <div class="filter-section">
          <h3>Categories</h3>
          <div class="filter-options">
            <label v-for="category in categories" :key="category.id" class="filter-option">
              <input 
                type="checkbox" 
                :value="category.id" 
                v-model="selectedCategories"
              >
              <span class="checkmark"></span>
              {{ category.name }}
              <span class="count">({{ category.count }})</span>
            </label>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>Tags</h3>
          <div class="tags-container">
            <span 
              v-for="tag in popularTags" 
              :key="tag"
              class="tag"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
        
        <div class="filter-section">
          <h3>Sort By</h3>
          <select v-model="sortBy" class="sort-select">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </aside>
      
      <!-- Journal Grid -->
      <main class="journal-grid">
        <div v-if="filteredJournals.length === 0" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" class="no-results-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>No journals found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
        
        <div v-else class="journals-container">
          <div v-for="journal in filteredJournals" :key="journal.id" class="journal-card">
            <div class="journal-cover" :style="{ backgroundImage: `url(${journal.coverImage})` }">
              <div class="journal-category">{{ journal.category }}</div>
              <div class="journal-actions">
                <button class="action-btn" @click="saveJournal(journal)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="journal-details">
              <h3 class="journal-title">{{ journal.title }}</h3>
              <p class="journal-excerpt">{{ journal.excerpt }}</p>
              <div class="journal-meta">
                <div class="author-info">
                  <img :src="journal.author.avatar" :alt="journal.author.name" class="author-avatar">
                  <span class="author-name">{{ journal.author.name }}</span>
                </div>
                <div class="journal-stats">
                  <span class="stat">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ journal.likes }}
                  </span>
                </div>
              </div>
              <div class="journal-tags">
                <span v-for="tag in journal.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Load More Button -->
        <div v-if="hasMoreResults" class="load-more">
          <button class="load-more-btn" @click="loadMore">
            Load More
            <svg xmlns="http://www.w3.org/2000/svg" class="load-more-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Search and filter state
const searchQuery = ref('');
const activeFilter = ref('all');
const selectedCategories = ref([]);
const selectedTags = ref([]);
const sortBy = ref('recent');
const currentPage = ref(1);
const itemsPerPage = 9;

// Sample data - replace with actual API calls
const quickFilters = [
  { id: 'all', label: 'All' },
  { id: 'featured', label: 'Featured' },
  { id: 'popular', label: 'Popular' },
  { id: 'recent', label: 'Recent' },
  { id: 'following', label: 'Following' },
];

const categories = [
  { id: 'travel', name: 'Travel', count: 156 },
  { id: 'food', name: 'Food & Cooking', count: 89 },
  { id: 'lifestyle', name: 'Lifestyle', count: 203 },
  { id: 'technology', name: 'Technology', count: 67 },
  { id: 'health', name: 'Health & Wellness', count: 142 },
  { id: 'personal', name: 'Personal Growth', count: 98 },
];

const popularTags = [
  'adventure', 'foodie', 'minimalism', 'productivity', 
  'mindfulness', 'photography', 'writing', 'creativity',
  'fitness', 'travelbug', 'inspiration', 'diy'
];

// Sample journal data - replace with actual API call
const journals = ref([
  {
    id: 1,
    title: 'My Journey Through Southeast Asia',
    excerpt: 'Discovering hidden gems and local secrets across Thailand, Vietnam, and Cambodia...',
    category: 'Travel',
    coverImage: 'https://source.unsplash.com/random/600x400?travel,asia',
    author: {
      name: 'Alex Morgan',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    likes: 124,
    comments: 28,
    tags: ['adventure', 'travel', 'asia', 'photography'],
    date: '2 days ago'
  },
  // Add more sample journal entries
  ...Array(8).fill().map((_, i) => ({
    id: i + 2,
    title: `Sample Journal Entry ${i + 1}`,
    excerpt: 'This is a sample journal entry description that gives a brief overview of the content...',
    category: ['Lifestyle', 'Technology', 'Health', 'Personal Growth'][i % 4],
    coverImage: `https://source.unsplash.com/random/600x400?${['lifestyle','tech','health','personal'][i%4]},${i+1}`,
    author: {
      name: ['Taylor Swift', 'John Doe', 'Jane Smith', 'Mike Johnson'][i % 4],
      avatar: `https://randomuser.me/api/portraits/${['men','women'][i%2]}/${30 + i}.jpg`
    },
    likes: Math.floor(Math.random() * 200) + 10,
    comments: Math.floor(Math.random() * 50) + 5,
    tags: [
      ['mindfulness', 'productivity', 'minimalism'],
      ['tech', 'innovation', 'future'],
      ['fitness', 'wellness', 'health'],
      ['growth', 'inspiration', 'goals']
    ][i % 4],
    date: `${i + 1} ${['hour', 'day', 'week', 'month'][(i % 4)]}${i === 0 ? '' : 's'} ago`
  }))
]);

// Computed properties
const filteredJournals = computed(() => {
  let result = [...journals.value];
  
  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(journal => 
      journal.title.toLowerCase().includes(query) ||
      journal.excerpt.toLowerCase().includes(query) ||
      journal.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply category filter
  if (selectedCategories.value.length > 0) {
    result = result.filter(journal => 
      selectedCategories.value.includes(journal.category.toLowerCase())
    );
  }
  
  // Apply tag filter
  if (selectedTags.value.length > 0) {
    result = result.filter(journal =>
      selectedTags.value.every(tag => 
        journal.tags.map(t => t.toLowerCase()).includes(tag)
      )
    );
  }
  
  // Apply active filter
  switch (activeFilter.value) {
    case 'featured':
      result = result.filter(journal => journal.likes > 100);
      break;
    case 'popular':
      result.sort((a, b) => b.likes - a.likes);
      break;
    case 'recent':
      // Assuming newer journals have higher IDs - adjust based on your data
      result.sort((a, b) => b.id - a.id);
      break;
    case 'following':
      // In a real app, filter by followed users
      result = result.slice(0, 3);
      break;
  }
  
  // Apply pagination
  const start = 0; // In a real app: (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return result.slice(0, end);
});

const hasMoreResults = computed(() => {
  // In a real app, check if there are more items to load
  return filteredJournals.value.length < 50; // Example limit
});

// Methods
function setActiveFilter(filterId) {
  activeFilter.value = filterId;
  currentPage.value = 1; // Reset to first page
}

function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
  currentPage.value = 1; // Reset to first page
}

function performSearch() {
  currentPage.value = 1; // Reset to first page on new search
  // In a real app, you would trigger an API call here
  console.log('Searching for:', searchQuery.value);
}

function loadMore() {
  currentPage.value += 1;
  // In a real app, you would load the next page of results
}

function saveJournal(journal) {
  // In a real app, add to user's saved items
  console.log('Saving journal:', journal.title);
  // Show a toast notification
  showToast(`Saved "${journal.title}" to your library`);
}

function showToast(message) {
  // In a real app, implement a proper toast notification
  alert(message);
}

// Lifecycle hooks
onMounted(() => {
  // In a real app, you would fetch initial data here
  console.log('Explore page mounted');
});
</script>

<style scoped>
/* Base styles */
.explore-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

/* Hero Section */

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
  z-index: -10;
  pointer-events: none;
}
.explore-hero {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 4rem 1rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 700;
  font-family: 'Cormorant Garamond', serif;
}

.subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

/* Search Bar */
.search-container {
  max-width: 700px;
  margin: 0 auto 2rem;
}

.search-input {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.search-input:focus-within {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #a0aec0;
  margin-right: 0.75rem;
}

.search-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.75rem 0;
  background: transparent;
}

.search-btn {
  background-color: #E9184C;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #d11643;
}

/* Quick Filters */
.quick-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.filter-chip {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.filter-chip.active {
  background-color: #E9184C;
  color: white;
  border-color: #E9184C;
}

/* Main Layout */
.explore-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  gap: 2rem;
}

/* Sidebar */
.filters-sidebar {
  flex: 0 0 280px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #edf2f7;
}

/* Journal Grid */
.journal-grid {
  flex: 1;
}

.journals-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.journal-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.journal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.journal-cover {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.journal-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.journal-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.journal-card:hover .journal-actions {
  opacity: 1;
}

.action-btn {
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 18px;
  height: 18px;
  color: #4a5568;
}

.journal-details {
  padding: 1.25rem;
}

.journal-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #2d3748;
}

.journal-excerpt {
  color: #4a5568;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.journal-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #edf2f7;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.8125rem;
  color: #4a5568;
  font-weight: 500;
}

.journal-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #718096;
}

.stat-icon {
  width: 16px;
  height: 16px;
}

.journal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  display: inline-block;
  background-color: #f7fafc;
  color: #4a5568;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.tag:hover, .tag.active {
  background-color: #E9184C;
  color: white;
  border-color: #E9184C;
}

/* No Results */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.no-results-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e0;
  margin: 0 auto 1.5rem;
}

.no-results h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #718096;
  margin: 0;
}

/* Load More Button */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  background-color: #f7fafc;
  border-color: #cbd5e0;
  color: #2d3748;
}

.load-more-icon {
  width: 16px;
  height: 16px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .explore-container {
    flex-direction: column;
  }
  
  .filters-sidebar {
    position: static;
    margin-bottom: 2rem;
  }
  
  .journals-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 640px) {
  .explore-hero {
    padding: 2rem 1rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .search-input {
    flex-direction: column;
    padding: 0.5rem;
  }
  
  .search-input input {
    width: 100%;
    margin: 0.5rem 0;
  }
  
  .search-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .quick-filters {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .filter-chip {
    white-space: nowrap;
  }
}
</style>
