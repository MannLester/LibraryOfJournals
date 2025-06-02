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
              <button class="primary-button w-full" @click="navigateToWrite">
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
              <p class="card-subtitle">Begin your life's journal or a new chapter</p>
            </div>
            <div class="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#E9184C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div class="option-buttons">
            <button class="option-button" @click="navigateToWrite">
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
      
      <!-- Saved Journals Section -->
      <div class="journals-section">
        <div class="section-header">
          <h2>Saved Journals</h2>
          <button class="view-all-btn">View All &rarr;</button>
        </div>
        <!-- Empty Journals State (displayed when no journals exist) -->
        <div class="journals-container" v-if="true">
          <div class="empty-state">
            <p>You don't have any journals yet. Create your first one to get started!</p>
            <button class="primary-button">
              <span class="icon">📖</span>
              Explore New Journals
            </button>
          </div>
        </div>
      </div>
      
      <!-- Two Column Layout for Stats and Community -->
      <div class="two-column-layout">
        <div class="left-column">
          <!-- Your Writing Journey Section -->
          <div class="dashboard-card">
            <div class="card-header">
              <div>
                <h2 class="card-title">Your Writing Journey</h2>
                <p class="card-subtitle">Insights from your journaling practice</p>
              </div>
              <div class="icon-circle">
                <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="#e11d48"
  >
    <path d="M23,6h-6c-0.6,0-1,0.4-1,1s0.4,1,1,1h3.6l-9.1,9.1l-5-5c-0.4-0.4-1-0.4-1.4,0l-5,5c-0.4,0.4-0.4,1,0,1.4 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l4.3-4.3l5,5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l9.8-9.8V10c0,0.6,0.4,1,1,1 s1-0.4,1-1V7C24,6.4,23.6,6,23,6z"/>
  </svg>
              </div>
            </div>
            
            <!-- Activity Tabs -->
            <div class="activity-tabs">
              <button @click="switchTab('activity')" class="tab-button" :class="{ active: activeTab === 'activity' }">Activity</button>
              <button @click="switchTab('stats')" class="tab-button" :class="{ active: activeTab === 'stats' }">Stats</button>
            </div>
            
            <!-- Activity View -->
            <div class="activity-view" v-show="activeTab === 'activity'">
              <!-- This Week's Writing -->
              <div class="stats-section">
                <h3 class="stats-title">This Week's Writing</h3>
                <div class="week-chart">
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 50px;"></div>
                    <div class="day-label">Mon</div>
                    <div class="day-value">2</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 30px;"></div>
                    <div class="day-label">Tue</div>
                    <div class="day-value">1</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 70px;"></div>
                    <div class="day-label">Wed</div>
                    <div class="day-value">3</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 10px;"></div>
                    <div class="day-label">Thu</div>
                    <div class="day-value">0</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 50px;"></div>
                    <div class="day-label">Fri</div>
                    <div class="day-value">2</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 90px;"></div>
                    <div class="day-label">Sat</div>
                    <div class="day-value">4</div>
                  </div>
                  <div class="chart-day">
                    <div class="chart-bar" style="height: 30px;"></div>
                    <div class="day-label">Sun</div>
                    <div class="day-value">1</div>
                  </div>
                </div>
              </div>
              
              <!-- Monthly Overview -->
              <div class="stats-section">
                <h3 class="stats-title">Monthly Overview</h3>
                <div class="month-chart">
                  <div class="month-block">
                    <div class="month-bar" style="height: 70px;"></div>
                    <div class="month-label">Week 1</div>
                    <div class="month-value">8</div>
                  </div>
                  <div class="month-block">
                    <div class="month-bar" style="height: 120px;"></div>
                    <div class="month-label">Week 2</div>
                    <div class="month-value">12</div>
                  </div>
                  <div class="month-block">
                    <div class="month-bar" style="height: 50px;"></div>
                    <div class="month-label">Week 3</div>
                    <div class="month-value">5</div>
                  </div>
                  <div class="month-block">
                    <div class="month-bar" style="height: 100px;"></div>
                    <div class="month-label">Week 4</div>
                    <div class="month-value">10</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Stats View -->
            <div class="stats-view" v-show="activeTab === 'stats'">
              <div class="stats-grid">
                <!-- Total Entries -->
                <div class="stat-item">
                  <div class="stat-label">Total Entries</div>
                  <div class="stat-value">87</div>
                </div>
                
                <!-- Total Words -->
                <div class="stat-item">
                  <div class="stat-label">Total Words</div>
                  <div class="stat-value">24,356</div>
                </div>
                
                <!-- Avg. Words/Entry -->
                <div class="stat-item">
                  <div class="stat-label">Avg. Words/Entry</div>
                  <div class="stat-value">280</div>
                </div>
                
                <!-- Longest Streak -->
                <div class="stat-item">
                  <div class="stat-label">Longest Streak</div>
                  <div class="stat-value">14 days</div>
                </div>
                
                <!-- Most Active Time -->
                <div class="stat-item">
                  <div class="stat-label">Most Active Time</div>
                  <div class="stat-value">Morning</div>
                </div>
                
                <!-- Common Themes -->
                <div class="stat-item themes-item">
                  <div class="stat-label">Common Themes</div>
                  <div class="themes-container">
                    <span class="theme-tag">Reflection</span>
                    <span class="theme-tag">Gratitude</span>
                    <span class="theme-tag">Ideas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quote of the Day -->
          <div class="quote-card">
            <div class="quote-content">
              <div class="quote-marks">&ldquo;</div>
              <p class="quote-text">The habit of writing thus for my own eye only is good practice. It loosens the ligaments.</p>
              <div class="quote-author">
                <span class="author-name">Virginia Woolf</span>
                <span class="author-book">A Writer's Diary</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="right-column">
          <!-- Community Spotlight -->
          <div class="dashboard-card">
            <div class="card-header">
              <div>
                <h2 class="card-title">Community Spotlight</h2>
                <p class="card-subtitle">Discover inspiring journals</p>
              </div>
              <div class="icon-circle">
                <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="#e11d48"
  >
    <path d="M12,2L9.91,9.09L2,12l7.91,2.91L12,22l2.09-7.09L22,12l-7.91-2.91L12,2z" />
  </svg>
              </div>
            </div>
            
            <!-- Community Journals -->
            <div class="community-journals">
              <!-- Journal 1 -->
              <div class="community-journal">
                <h3 class="journal-title">Travel Adventures</h3>
                <p class="journal-author">by James T.</p>
                <p class="journal-preview font-caveat">Exploring the hidden gems of Thailand! Asia has been an incredible journey...</p>
              </div>
              
              <!-- Journal 2 -->
              <div class="community-journal" style="background-color: #e6f7e9;">
                <h3 class="journal-title">Mindfulness Journey</h3>
                <p class="journal-author">by Sam K.</p>
                <p class="journal-preview font-caveat">My meditation practice has evolved significantly over the past two weeks...</p>
              </div>
            </div>
            
            <!-- Explore More Button -->
            <button class="outline-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                <path d="M15.5 14H14.71L14.43 13.73C15.63 12.33 16.25 10.42 15.91 8.39C15.44 5.61 13.12 3.39 10.32 3.05C6.09 2.53 2.53 6.09 3.05 10.32C3.39 13.12 5.61 15.44 8.39 15.91C10.42 16.25 12.33 15.63 13.73 14.43L14 14.71V15.5L18.25 19.75C18.66 20.16 19.33 20.16 19.74 19.75C20.15 19.34 20.15 18.67 19.74 18.26L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#555"/>
              </svg>
              Explore More Journals
            </button>
          </div>
          
          <!-- Writing Streak -->
          <div class="streak-card">
            <div class="streak-header">
              <div class="streak-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 10H7V12H9V10Z" fill="#E9184C"/>
                  <path d="M13 10H11V12H13V10Z" fill="#E9184C"/>
                  <path d="M17 10H15V12H17V10Z" fill="#E9184C"/>
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="#E9184C"/>
                </svg>
              </div>
              <div>
                <h2 class="streak-title">Writing Streak</h2>
                <p class="streak-subtitle">You're on a roll!</p>
              </div>
            </div>
            
            <div class="streak-value">
              <div class="streak-number">7</div>
              <div class="streak-label">days in a row</div>
            </div>
            
            <button class="outline-button" @click="navigateToWrite">
              Keep the Streak Going
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

// For tab switching in Writing Journey section
const activeTab = ref('activity');

function switchTab(tab) {
  activeTab.value = tab;
}

function navigateToWrite() {
  const event = new CustomEvent('showPage', { detail: { page: 'writing' } });
  window.dispatchEvent(event);
}

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

.container {
  position: relative;
  z-index: 6; /* Place content above the background with higher z-index */
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
  margin-top: 2rem;
  margin-bottom: 2rem;
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

/* Two Column Layout */
.two-column-layout {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.left-column {
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-column {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Dashboard Cards */
.dashboard-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  text-align: left;
}

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  margin-bottom: 0.25rem;
}

.card-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FEF0F2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #E9184C;
}

/* Activity Tabs */
.activity-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #E9184C;
  border-bottom: 2px solid #E9184C;
  font-weight: 600;
}

/* Stats Section */
.stats-section {
  margin-bottom: 1.5rem;
  text-align: left;
  padding-left: 0.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0.5rem;
}

.stat-item {
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-align: left;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.themes-item {
  grid-column: span 2;
}

.themes-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
  text-align: left;
}

.theme-tag {
  background-color: #FEF0F2;
  color: #E9184C;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
}

.stats-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: left;
  display: block;
}

/* Week Chart */
.week-chart {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  height: 130px;
  margin: 0;
  gap: 1rem;
  padding-right: 2rem;
}

.chart-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chart-bar {
  width: 40px;
  background-color: #E9184C;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.day-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.day-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
}

/* Month Chart */
.month-chart {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  height: 160px;
  margin: 0;
  gap: 1.5rem;
  padding-right: 2rem;
}

.month-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.month-bar {
  width: 65px;
  background-color: #E9184C;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.month-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.month-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
}

/* Quote Card */
.quote-card {
  background: linear-gradient(to bottom right, rgba(255, 0, 0, 0.1), rgba(255, 228, 230, 0.3));
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* equivalent to shadow-md */
  border: 1px solid rgba(229, 231, 235, 0.2);
  z-index: 2; /* Maintaining proper z-index hierarchy */
}

.quote-content {
  position: relative;
  padding: 1rem;
  opacity:1;
}

.quote-marks {
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  color: #E9184C;
  opacity: 1;
  position: absolute;
  top: -25px;
  left: -15px;
}

.quote-text {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.2rem;
  line-height: 1.5;
  color: black;
  margin-bottom: 1.5rem;
  max-width: 85%;
  position: relative;
  opacity:1;
  z-index: 3; /* Ensuring text is above decorative elements */
}

.quote-author {
  text-align: right;
  margin-top: 1rem;
  opacity:1;
  color:black;
}

.author-name {
  display: block;
  font-weight: 600;
  color: black;
  opacity:1
}

.author-book {
  display: block;
  font-size: 0.85rem;
  color: black;
  font-style: italic;
  opacity:1;
}

/* Community Journals */
.community-journals {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.community-journal {
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1rem;
}

.journal-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
  color: #333;
}

.journal-author {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
  margin-bottom: 0.5rem;
}

.journal-preview {
  font-size: 1rem;
  margin: 0;
  color: #333;
}

.font-caveat {
  font-family: 'Caveat', cursive;
}

/* Outline Button */
.outline-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background-color: white;
  color: black;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.outline-button:hover {
  background-color: #f5f5f5;
}

/* Writing Streak Card */
.streak-card {
  background: linear-gradient(to bottom right, rgba(255, 204, 214, 0.6), rgba(255, 240, 220, 0.6));
  border-radius: 0.75rem; 
  padding: 1.5rem;
  opacity:0.7;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.streak-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.streak-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.streak-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
  color: black;
}

.streak-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.streak-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.streak-number {
  font-size: 3rem;
  font-weight: 700;
  color: #E9184C;
}

.streak-label {
  font-size: 0.9rem;
  color: #666;
}
</style>