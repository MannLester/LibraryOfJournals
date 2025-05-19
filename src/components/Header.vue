<template>
  <header>
    <div class="header-content">
      <!-- Left: Logo and Brand Name -->
      <a @click="scrollToSection('home')" id="home-pointer">
      <div class="logo-container">
        <img src="../assets/LoJ_logo.png" alt="Library of Journals Logo" class="logo">
        <span class="brand-name">Library of Journals</span>
      </div>
      </a>
      
      <!-- Center: Navigation with icons -->
      <nav class="navigation">
        <a @click="scrollToSection('features')" class="nav-link">
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
      
      <!-- Right: Auth Buttons -->
      <div class="auth-buttons">
        <button class="login-btn">Log In</button>
        <button class="signup-btn">Sign up</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background-color: #FFFFFF;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #f5f5f5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
}

.logo-container {
  display: flex;
  align-items: center;
  padding-left: 24px;
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
  margin-right: 8px;
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
</style>

<script setup lang="ts">
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
