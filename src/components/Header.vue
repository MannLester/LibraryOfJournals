<template>
  <div style="width: 100%; background-color: #FFFFFF; position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #f5f5f5; margin: 0; padding: 0; box-sizing: border-box;">
    <div style="width: 100%; padding: 14px 0; margin: 0; display: flex; align-items: center; justify-content: space-between;">
      <!-- Left: Logo and Brand Name -->
      <div style="display: flex; align-items: center;">
        <img src="../assets/LoJ_logo.png" alt="Library of Journals Logo" style="height: 42px; width: auto;">
        <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; margin-left: 14px;">Library of Journals</span>
      </div>
      
      <!-- Center: Navigation with icons -->
      <nav style="display: flex; align-items: center; margin-left: auto; margin-right: auto;">
        <a href="#features" style="display: flex; align-items: center; font-family: 'Roboto', sans-serif; color: #6B6B6B; font-size: 1rem; margin-right: 46px; text-decoration: none;">
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 16px; width: 16px; margin-right: 8px; color: #6B6B6B; opacity: 0.8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Features
        </a>
        <a href="#testimonials" style="display: flex; align-items: center; font-family: 'Roboto', sans-serif; color: #6B6B6B; font-size: 1rem; margin-right: 46px; text-decoration: none;">
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 16px; width: 16px; margin-right: 8px; color: #6B6B6B; opacity: 0.8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Testimonials
        </a>
        <a href="#contacts" style="display: flex; align-items: center; font-family: 'Roboto', sans-serif; color: #6B6B6B; font-size: 1rem; text-decoration: none;">
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 16px; width: 16px; margin-right: 8px; color: #6B6B6B; opacity: 0.8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Contacts
        </a>
      </nav>
      
      <!-- Right: Auth Buttons -->
      <div style="display: flex; align-items: center;">
        <button style="font-family: 'Roboto', sans-serif; font-size: 0.95rem; padding: 9px 22px; border-radius: 4px; background-color: #EAEAEA; border: none; margin-right: 14px; cursor: pointer;">Log In</button>
        <button style="font-family: 'Roboto', sans-serif; font-size: 0.95rem; padding: 9px 22px; border-radius: 4px; background-color: #E9184C; color: white; border: none; cursor: pointer;">Sign up</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
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
