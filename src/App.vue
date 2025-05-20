<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Header from './components/Header.vue'
import LandingPage from './views/LandingPage.vue'
import HomePage from './views/HomePage.vue'
import bgImage from './assets/bgImage.jpg'
import useAuth from './composables/useAuth';

// Initialize authentication
const { isAuthenticated, isLoading, user, account } = useAuth();
</script>

<template>
  <Header />
  <div class="content-area">
    <!-- Background image is now applied via CSS -->
    <div class="content-wrapper">
      <!-- Conditionally render HomePage or LandingPage based on authentication -->
      <HomePage v-if="isAuthenticated" />
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
/* Global styles can be added here */
</style>
