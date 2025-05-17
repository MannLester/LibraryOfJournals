<script setup lang="ts">
import Header from './components/Header.vue'
import LandingPage from './views/LandingPage.vue'
import bgImage from './assets/bgImage.jpg'
</script>

<template>
  <Header />
  <div class="content-area">
    <img :src="bgImage" class="bg-image" alt="" />
    <div class="content-wrapper">
      <LandingPage />
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
  left: 0;
  right: 0;
  overflow: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
  z-index: 6;
}



</style>

<style>
/* Global styles can be added here */
</style>
