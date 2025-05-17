<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<template>
  <Header />
  <div class="content-area">
    <!-- Main content will go here -->
  </div>
</template>

<style>
#app {
  margin: 0;
  padding: 0;
  width: 100%;
}

.app-container {
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.content-area {
  background-color: #FCFAF7;
  min-height: calc(100vh - 70px);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
  position: relative;
  left: 0;
  right: 0;
}
</style>

<style>
/* Global styles can be added here */
</style>
