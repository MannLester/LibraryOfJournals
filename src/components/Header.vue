<template>
  <header class="header-container" :class="{ 'logged-in-header': isAuthenticated }">
    <div class="header-content">
      <!-- Left: Logo and Brand Name - Always visible -->
      <div class="logo-container">
        <img src="../assets/LoJ_logo.png" alt="Library of Journals Logo" class="logo">
        <span class="brand-name">Library of Journals</span>
      </div>
      
      <!-- LOGGED IN: Navigation matching the design in the image -->
      <div class="center-nav" v-if="isAuthenticated">
        <a href="#" class="center-nav-item" :class="{ 'active': activeNavItem === 'home' }" @click.prevent="navigateTo('home', '/')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="nav-icon" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
          </svg>
          Home
        </a>
        <a href="#" class="center-nav-item" :class="{ 'active': activeNavItem === 'library' }" @click.prevent="navigateTo('library', '/library')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="nav-icon" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
          </svg>
          My Library
        </a>
        <a href="#" class="center-nav-item" :class="{ 'active': activeNavItem === 'explore' }" @click.prevent="navigateTo('explore', '/explore')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="nav-icon" viewBox="0 0 16 16">
            <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
            <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
          </svg>
          Explore
        </a>
        <a href="#" class="center-nav-item" :class="{ 'active': activeNavItem === 'donate' }" @click.prevent="navigateTo('donate', '/donate')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="nav-icon" viewBox="0 0 24 24">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
          Donate
        </a>
      </div>
      
      <!-- LANDING PAGE: Navigation and auth buttons when not logged in -->
      <nav class="navigation" v-else>
        <a @click="scrollToSection('features')" class="nav-link" >
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Features
        </a>
        <a @click="scrollToSection('testimonials')" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Testimonials
        </a>
        <a @click="scrollToSection('contacts')" class="nav-link last">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contacts
        </a>
      </nav>

      <!-- LANDING PAGE: Login and signup buttons -->
      <div class="auth-buttons" v-if="!isAuthenticated">
        <button class="login-btn" @click="handleLogin">Log In with Google</button>
        <button class="signup-btn" @click="handleSignup">Sign up</button>
      </div>

      <!-- LOGGED IN: Header controls (search, notifications, theme toggle, user) -->
      <div class="header-controls" v-else>
        <button class="icon-button" @click="navigateToExplore" :class="{ 'active': activeNavItem === 'explore' }" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
        <button class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
          </svg>
        </button>
        <button class="icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
          </svg>
        </button>
        <div class="user-avatar-circle">
          <span v-if="!account?.imageLink">{{ getInitials() }}</span>
          <img v-else :src="account.imageLink" :alt="account?.username || 'User'" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #FFFFFF;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Logged-in header style - lighter background to match the image */
.logged-in-header {
  background-color: #FCFAF7;
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  width: 100%;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0 0 0 1rem;
  margin: 0;
}

.logo {
  height: 42px;
  width: auto;
}

.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 14px;
}

.navigation {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  color: #6B6B6B;
  font-size: 1rem;
  margin-right: 46px;
  text-decoration: none;
  cursor: pointer;
}

#home-pointer{
  cursor: pointer;
}

.nav-link.last {
  margin-right: 0;
}

.nav-icon {
  height: 16px;
  width: 16px;
  margin-right: 0.5rem; /* 8px */
  color: #6B6B6B;
  opacity: 0.8;
}

.auth-buttons {
  display: flex;
  align-items: center;
  padding-right: 24px;
}

.login-btn {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  padding: 9px 22px;
  border-radius: 4px;
  background-color: #EAEAEA;
  border: none;
  margin-right: 14px;
  cursor: pointer;
}

.signup-btn {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  padding: 9px 22px;
  border-radius: 4px;
  background-color: #E9184C;
  color: white;
  border: none;
  cursor: pointer;
}

.logout-btn {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  padding: 6px 18px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  margin-left: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #e0e0e0;
}

.user-profile {
  display: flex;
  align-items: center;
}

/* User section styling */
.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  border: 1px solid #eee;
}

.user-avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-name {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.logout-button {
  background: none;
  border: none;
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  padding: 5px 10px;
  cursor: pointer;
  transition: color 0.2s;
}

.logout-button:hover {
  color: #E9184C;
}

/* Center navigation for logged-in users */
.center-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.center-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  padding: 5px 8px;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}

.center-nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.center-nav-item .nav-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: color 0.2s, opacity 0.2s;
}

/* Active nav item styling */
.center-nav-item.active {
  color: #E9184C;
}

.center-nav-item.active .nav-icon {
  opacity: 1;
  color: #E9184C;
}

/* Header controls (right side) */
.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  padding: 0 1rem 0 0;
}

.icon-button {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-name {
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  color: #333;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import useAuth from '../composables/useAuth';

// Use our custom auth composable
const { user, account, isAuthenticated, login, signup, logout } = useAuth();

// Track active navigation item
const activeNavItem = ref('home'); // Default to home

// Set initial active nav item based on current path
const updateActiveNavFromPath = () => {
  const path = window.location.pathname;
  if (path === '/explore') {
    activeNavItem.value = 'explore';
  } else if (path === '/library') {
    activeNavItem.value = 'library';
  } else if (path === '/donate') {
    activeNavItem.value = 'donate';
  } else {
    activeNavItem.value = 'home';
  }
};

// Listen for popstate events (back/forward navigation) and showPage events
const handleShowPage = (event: Event) => {
  const customEvent = event as CustomEvent;
  if (customEvent.detail?.page) {
    activeNavItem.value = customEvent.detail.page;
  }
};

onMounted(() => {
  updateActiveNavFromPath();
  window.addEventListener('popstate', updateActiveNavFromPath);
  window.addEventListener('showPage', handleShowPage as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('popstate', updateActiveNavFromPath);
  window.removeEventListener('showPage', handleShowPage as EventListener);
});

// Function to set active nav item
const navigateTo = (item: string, path: string) => {
  activeNavItem.value = item;
  // Update the URL without reloading the page first
  if (window.history.pushState) {
    window.history.pushState({}, '', path);
  } else {
    window.location.href = path;
  }
  // Then emit the event to notify other components
  window.dispatchEvent(new CustomEvent('showPage', { detail: { page: item } }));
};

// These functions would need to be implemented elsewhere in your app
// to show/hide the appropriate pages
function showLibraryPage() {
  // This is a simplified approach - in a real app, you'd use proper routing
  // You'll need to implement these methods in App.vue or elsewhere
  const event = new CustomEvent('showPage', { detail: { page: 'library' } });
  window.dispatchEvent(event);
}

function navigateToExplore() {
  activeNavItem.value = 'explore';
  navigateTo('explore', '/explore');
}

function showHomePage() {
  const event = new CustomEvent('showPage', { detail: { page: 'home' } });
  window.dispatchEvent(event);
}

// Function to get user initials for avatar fallback
function getInitials() {
  if (!account?.username) return 'U';
  const words = account.username.split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// Handle login
async function handleLogin() {
  try {
    await login();
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}

// Handle signup - forces logout first for fresh sign-up
async function handleSignup() {
  try {
    await signup();
  } catch (error) {
    console.error('Signup failed:', error);
  }
}

// Handle logout
async function handleLogout() {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Scroll to section function with smooth behavior and header offset
function scrollToSection(sectionId: string) {
  // Prevent default navigation behavior
  event?.preventDefault();
  
  // Find the target section
  const targetSection = document.getElementById(sectionId);
  
  if (targetSection) {
    // Get the height of the header for offset
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Calculate the target position with offset
    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    // Use smooth scrolling
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}
</script>

<style scoped>
/* We'll add these custom classes in our main CSS, but we'll also define them here for scoped use */
.text-nav-gray {
  color: #6B6B6B;
}
.bg-login-gray {
  background-color: #DFDFDF;
}
.bg-signup-pink {
  background-color: #E9184C;
}
.font-cormorant {
  font-family: 'Cormorant Garamond', serif;
}
.font-roboto {
  font-family: 'Roboto', sans-serif;
}
</style>
