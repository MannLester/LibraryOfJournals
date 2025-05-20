<template>
  <div class="home-page-container">
    <div class="content-wrapper">
      <h1 class="page-title">Welcome to Your Journal Space</h1>
      <p class="welcome-message">Select a journal to continue your writing journey or create a new one.</p>
      
      <div class="journals-container">
        <!-- This will be populated with the user's journals -->
        <div class="empty-state">
          <p>You don't have any journals yet. Create your first one to get started!</p>
          <button class="create-journal-btn">Create New Journal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useAuth from '../composables/useAuth';

// Get authentication state
const { user, account, isAuthenticated } = useAuth();

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
.home-page-container {
  padding-top: 70px; /* Space for the fixed header */
  min-height: 100vh;
  background-color: #FCFAF7;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.welcome-message {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2.5rem;
}

.journals-container {
  margin: 2rem auto;
  max-width: 800px;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #FDF9E8;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: #555;
}

.create-journal-btn {
  background-color: #E9184C;
  color: white;
  font-family: 'Roboto', sans-serif;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}

.create-journal-btn:hover {
  background-color: #d0153e;
}
</style>