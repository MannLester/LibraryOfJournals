<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Header from './components/Header.vue'
import LandingPage from './views/LandingPage.vue'
import HomePage from './views/HomePage.vue'
import LibraryPage from './views/LibraryPage.vue'
import bgImage from './assets/bgImage.jpg'
import useAuth from './composables/useAuth';

// Initialize authentication
const { isAuthenticated, isLoading, user, account } = useAuth();

// Track current page
const currentPage = ref('home');

// Listen for navigation events from the Header component
onMounted(() => {
  window.addEventListener('showPage', (event: CustomEvent) => {
    const { page } = event.detail;
    currentPage.value = page;
  });
});
</script>

<template>
  <Header />
  <div class="content-area">
    <!-- Background image is now applied via CSS -->
    <div class="content-wrapper">
      <!-- First check authentication, then check which page to show -->
      <template v-if="isAuthenticated">
        <HomePage v-if="currentPage === 'home'" />
        <LibraryPage v-else-if="currentPage === 'library'" />
      </template>
      <!-- Show landing page for non-authenticated users -->
      <LandingPage v-else />
    </div>
  </div>
</template>

<style>

.app-container {
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.content-area {
  background-color: #FCFAF7;
  position: relative;
  min-height: calc(100vh - 70px);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
  padding-top: 70px; /* Add padding equal to header height */
  left: 0;
  right: 0;
  overflow-x: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
  isolation: isolate; /* Creates a new stacking context */
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5; /* Increased opacity to make it more visible */
  z-index: 10; /* Much higher z-index */
  pointer-events: none; /* Allows clicking through */
}



</style>

<style>
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500&display=swap');

/* Global styles */
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

.font-caveat {
  font-family: 'Caveat', cursive;
}

.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}

.text-primary {
  color: #E9184C;
}
</style>
