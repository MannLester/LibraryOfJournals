<template>
  <div class="min-h-screen bg-paper">
    <!-- Decorative elements -->
    <div class="decorative-circle top-right"></div>
    <div class="decorative-circle bottom-left"></div>
    
    <div class="container">
      <!-- Personal greeting section -->
      <div class="greeting-section">
        <h1 class="greeting text-left">
          Good day, <span class="user-name">{{ account?.username?.split(' ')[0] || 'User' }}</span>
        </h1>
        <p class="date text-left">{{ formattedDate }}</p>
      </div>
      
      <!-- Quick actions -->
      <div class="action-cards">
        <!-- Continue Writing Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Continue Writing</h2>
              <p class="card-subtitle">Pick up where you left off</p>
            </div>
            <div class="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div v-if="hasRecentEntries" class="card-inner">
            <div class="recent-entry">
              <div class="recent-entry-header">
                <h3 class="recent-entry-title">Morning Reflections</h3>
                <span class="recent-entry-time">2 hours ago</span>
              </div>
              <p class="entry-preview">Today I woke up with a sense of clarity I haven't felt in months. The morning light filtered through...</p>
            </div>
            
            <div class="button-container">
              <button class="primary-button w-full">
                <span class="icon">✎</span>
                Continue Writing
              </button>
            </div>
          </div>
          
          <div v-else class="card-inner">
            <div class="no-entries">
              <p>You haven't written anything yet.</p>
            </div>
            
            <div class="button-container">
              <button class="primary-button w-full">
                <span class="icon">✎</span>
                Start Writing
              </button>
            </div>
          </div>
        </div>
        
        <!-- Start Something New Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Start Something New</h2>
              <p class="card-subtitle">Begin a new journal or chapter</p>
            </div>
            <div class="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div class="option-buttons">
            <button class="option-button">
              <span class="option-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span>New Journal</span>
            </button>
            <button class="option-button">
              <span class="option-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span>New Chapter</span>
            </button>
          </div>
          
          <!-- Writer's Block Helper Box -->
          <div class="prompt-box">
            <div class="prompt-header">
              <span class="prompt-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 2V4" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 20V22" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.93 4.93L6.34 6.34" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.66 17.66L19.07 19.07" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12H4" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 12H22" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.93 19.07L6.34 17.66" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.66 6.34L19.07 4.93" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <h3>Writer's Block Helper</h3>
            </div>
            <p class="prompt-text">What's something you've been avoiding thinking about?</p>
            <div class="prompt-actions">
              <div class="try-another">Try Another</div>
              <button class="action-button prompt-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                  <path d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99995 20.1046 9.99995 19V18.469C9.99995 17.5739 9.64438 16.7155 9.01151 16.0827L8.46441 15.5356Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Write Tips
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Your Journals Section -->
      <div class="journals-section">
        <div class="section-header">
          <h2>Your Journals</h2>
          <button class="view-all-btn">View All &rarr;</button>
        </div>
        <!-- Empty Journals State (displayed when no journals exist) -->
        <div class="journals-container" v-if="true">
          <div class="empty-state">
            <p>You don't have any journals yet. Create your first one to get started!</p>
            <button class="primary-button">
              <span class="icon">📖</span>
              Create New Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import useAuth from '../composables/useAuth';

// Get authentication state
const { user, account, isAuthenticated } = useAuth();

const formattedDate = computed(() => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('en-US', options);
});

// You would fetch the user's journals here
onMounted(() => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    // Handle if somehow the user got here without being authenticated
    console.warn('User is not authenticated, but viewing HomePage');
  } else {
    console.log('User is authenticated:', account.value?.username);
    // Here you would fetch the user's journals from your database
  }
});
</script>

<style scoped>
/* Main container */
.min-h-screen {
  min-height: 100vh;
}

.bg-paper {
  background-color: #fcfaf7;
  position: relative;
}

/* Decorative elements */
.decorative-circle {
  position: fixed;
  border-radius: 9999px;
  filter: blur(3rem);
  z-index: -10;
}

.top-right {
  top: 25%;
  right: 0;
  width: 16rem;
  height: 16rem;
  background-color: rgba(233, 24, 76, 0.05);
}

.bottom-left {
  bottom: 25%;
  left: 0;
  width: 24rem;
  height: 24rem;
  background-color: rgba(253, 230, 138, 0.1);
}

/* Container layout */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0rem;
}

/* Greeting section styles */
.greeting-section {
  margin-bottom: 2rem;
}

.greeting {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #333;
  max-width: 80%;
}

@media (min-width: 768px) {
  .greeting {
    font-size: 3.5rem;
  }
}

.user-name {
  color: #E9184C;
}

.date {
  font-size: 1rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Card layout and styles */
.action-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .action-cards {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Card header styles */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #333;
}

.card-subtitle {
  color: #666;
  font-size: 1rem;
}

/* Icon circle */
.icon-circle {
  height: 3rem;
  width: 3rem;
  border-radius: 9999px;
  background-color: rgba(233, 24, 76, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle svg {
  height: 1.5rem;
  width: 1.5rem;
  color: #E9184C;
}

/* Space utilities */
.space-y > * + * {
  margin-top: 1rem;
}

.card-inner {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
}

.button-container {
  margin-top: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

/* Recent entry styling */
.recent-entry {
  background-color: #FFF9E6;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(253, 230, 138, 0.2);
}

.recent-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.recent-entry-title {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  font-size: 1rem;
}

.recent-entry-time {
  font-size: 0.75rem;
  color: #666;
}

.entry-preview {
  font-family: 'Caveat', cursive;
  font-size: 1.05rem;
  color: #555;
  line-height: 1.4;
  font-style: italic;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* No entries state */
.no-entries {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

/* Button styles */
.primary-button {
  background-color: #E9184C;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #d0153e;
}

.w-full {
  width: 100%;
}

/* Option buttons styling */
.option-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.option-button {
  width: 100%;
  height: auto;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option-button:hover {
  background-color: #f5f5f5;
}

/* Writer's Block Helper styling */
.prompt-box {
  background-color: #FEF0F2;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.prompt-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.prompt-icon {
  color: #E9184C;
}

.prompt-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.prompt-text {
  font-family: 'Caveat', cursive;
  font-size: 1.15rem;
  color: #555;
  margin-bottom: 1.25rem;
  font-style: italic;
  text-align: left;
  margin-left: 26px;
}

.prompt-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.try-another {
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
}

.prompt-btn {
  background-color: #E9184C;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Journals section */
.journals-section {
  margin-top: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.view-all-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-btn:hover {
  color: #333;
}

/* Empty state for journals */
.journals-container {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #FEF0F2;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  color: #555;
  margin-bottom: 1.5rem;
}
</style>