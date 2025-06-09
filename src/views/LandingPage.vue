<template>
  <div class="page-wrapper">
    <div class="min-h-screen landing-bg" style="position: relative;">
    <!-- Solid background color for now -->
    <!-- Header will be imported in App.vue -->
    
    <!-- Hero Section -->
    <section id="home" class="pt-12 pb-6 text-center">
      <h1 class="text-8xl font-cormorant font-semibold text-signup-pink mb-3">Library of Journals</h1>
      <p class="text-gray-600 text-4xl font-caveat italic">Where your thoughts find their home...</p>
    </section>
    
    <!-- Journal Preview Section -->
    <section class="max-w-4xl mx-auto px-4 relative mt-4">
      <JournalPreview 
        @next-page="handleNextPage"
        @prev-page="handlePrevPage" 
        :current-page="currentPage" 
        :total-pages="totalPages"
      />
    </section>

    <!-- CTA Section -->
    <section class="flex flex-col items-center justify-center mt-20 mb-14 px-4">
      <h2 class="text-center text-2xl md:text-3xl max-w-3xl mx-auto mb-12 leading-relaxed">
        Your journey deserves to be captured in a space as 
        beautiful as the thoughts within it.
      </h2>
      <div class="flex flex-col md:flex-row gap-5 mb-14">
        <button class="px-9 py-3.5 rounded-full bg-signup-pink text-white font-medium hover:bg-pink-700 transition duration-800 ease-in-out shadow-sm">
          Begin Your Journey
        </button>
        <button class="px-9 py-3.5 rounded-full border border-gray-800 hover:bg-gray-50 transition duration-300 ease-in-out">
          Explore Journals
        </button>
      </div>
      <div class="flex flex-col items-center text-gray-500 mt-2 animate-bounce-slow">
        <span>Scroll to Discover</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Story Section -->
    <section class="text-center mt-55 py-20">
      <div class="relative mx-auto max-w-4xl">
        <h2 class="text-6xl font-cormorant font-black text-black mb-6">Your Story Matters</h2>
        <p class="text-gray-600 text-2xl font-roboto max-w-2xl mx-auto">In a world of noise, your inner voice deserves a sanctuary</p>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-32 px-4">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <!-- Left side - Image container with layered design -->
        <div class="md:w-1/2 flex items-center justify-center">
          <div class="relative w-full h-[600px] flex items-center justify-center">
            <!-- Rotated background square -->
            <div class="absolute w-[85%] h-[85%] bg-white rounded-lg shadow-lg transform -rotate-[18.58deg] z-10"></div>
            
            <!-- Journal container -->
            <div class="relative w-[75%] h-[75%] bg-[#f5efd5] rounded-sm shadow-md z-25 flex flex-col p-10">
              <!-- Journal header -->
              <div class="mb-6 border-b border-gray-300 pb-3">
                <h4 class="font-cormorant text-2xl font-semibold text-left">My Journal</h4>
                <p class="text-gray-500 text-base">May 18, 2025</p>
              </div>
              
              <!-- Journal content -->
              <div class="flex-grow flex items-center justify-center">
                <p class="font-caveat text-2xl text-center italic leading-relaxed">
                  Today I realized that every moment <br/>
                  is a chance to begin again...<br/>
                  <span class="text-signup-pink">everything changed...</span>
                </p>
              </div>
              
              <!-- Journal footer -->
              <div class="mt-auto flex justify-between items-center border-t border-gray-300 pt-3">
                <span class="text-gray-500 text-base">Page 1 of 3</span>
                <button class="text-signup-pink text-lg">Next →</button>
              </div>
            </div>
            
            <!-- Testimonial quote -->
            <div class="absolute bottom-0 right-0 transform translate-x-0 translate-y-1/4 rounded-lg shadow-md p-6 max-w-[55%] z-20 bg-[#f5efd5]">
              <p class="font-caveat text-xl italic mb-2">"I never knew how much I needed this space until I found it."</p>
              <p class="text-right text-gray-500">&mdash; Jamie, writing since 2022</p>
            </div>
          </div>
        </div>
        
        <!-- Right side - Text content -->
        <div class="md:w-1/2 flex flex-col justify-center md:-mt-10">
          <!-- Feature 1 -->
          <div class="mb-14 text-left">
            <h3 class="text-4xl font-cormorant font-black mb-5">A Space That Grows With You</h3>
            <p class="text-gray-600 text-xl leading-relaxed">Your journals evolve as you do. From quick thoughts to deep reflections, each entry becomes a chapter in the story of your life.</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="mb-14 text-left">
            <h3 class="text-4xl font-cormorant font-bold mb-5">Write Your Way</h3>
            <p class="text-gray-600 text-xl leading-relaxed">Whether you prefer typing, speaking, or setting a timer to encourage flow, your writing experience adapts to your unique process.</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="text-left">
            <h3 class="text-4xl font-cormorant font-bold mb-5">Share When Ready</h3>
            <p class="text-gray-600 text-xl leading-relaxed">Keep your thoughts private, share with trusted friends, or contribute to our community of writers when inspiration strikes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid Section -->
    <section id="features" class="py-24 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-5xl font-cormorant font-bold text-center mb-4">Crafted for Your Journey</h2>
        <p class="text-xl text-gray-600 text-center mb-16">Every feature designed to enhance your writing experience</p>
        
        <!-- Features Grid - Top Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Feature 1 - Left column (tilt left on hover) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:-rotate-2 hover:shadow-md feature-card-left">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">Timed Writing Flow</h3>
            <p class="text-gray-600 text-center">Set a timer and let your thoughts flow without distraction. Many writers report their most profound insights come during timed sessions.</p>
          </div>
          
          <!-- Feature 2 - Middle column (One Life, One Journal) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md feature-card-middle">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">One Life, One Journal</h3>
            <p class="text-gray-600 text-center">Embrace the philosophy of a single continuous journey - your life's story captured in one evolving journal that grows with you.</p>
          </div>
          
          <!-- Feature 3 - Right column (Books & Chapters) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-2 hover:shadow-md feature-card-right">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">Books & Chapters</h3>
            <p class="text-gray-600 text-center">Organize your writing into beautiful books with chapters, creating a library that tells the story of your life's journey.</p>
          </div>
        </div>
        
        <!-- Features Grid - Bottom Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 4 - Left column (Speak Your Truth) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:-rotate-2 hover:shadow-md feature-card-left">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">Speak Your Truth</h3>
            <p class="text-gray-600 text-center">When typing feels limiting, speak your thoughts with our seamless speech-to-text feature that captures your voice.</p>
          </div>
          
          <!-- Feature 5 - Middle column (Share Your Perspective) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md feature-card-middle">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">Share Your Perspective</h3>
            <p class="text-gray-600 text-center">Choose which journals to keep private and which to share with the world or just a few trusted friends.</p>
          </div>
          
          <!-- Feature 6 - Right column (tilt right on hover) -->
          <div class="relative bg-white pt-10 pb-6 px-8 rounded-lg shadow-sm mt-6 transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-2 hover:shadow-md feature-card-right">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-14 h-14 bg-signup-pink rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-cormorant font-bold text-center mb-3">Beautiful Exports</h3>
            <p class="text-gray-600 text-center">Transform your digital journals into stunning PDFs or printable books to keep or share as meaningful gifts.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Stories Section -->
    <section id="testimonials" class="py-32 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-5xl font-cormorant font-bold text-center mb-4">Stories from Our Community</h2>
        <p class="text-xl text-gray-600 text-center mb-16">
          <span v-if="writerCount === 0">Loading writer count...</span>
          <span v-else>Join <span class="text-[#ED6A8F] font-medium">{{ writerCount }} writers </span> documenting their journey</span>
        </p>
        
        <div class="relative">
          <!-- Vertical line with dots -->
          <div class="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 timeline-gradient">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-signup-pink"></div>
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-signup-pink"></div>
          </div>
          
          <!-- Testimonial Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Left testimonial -->
            <div class="md:mr-12 md:text-right">
              <div class="bg-white p-8 rounded-lg shadow-sm relative hover:shadow-md transition-shadow duration-300">
                <p class="font-caveat text-lg italic mb-4">"I started journaling during the hardest time in my life. Having a beautiful space to process my thoughts changed everything. Three years later, I can look back and see how far I've come."</p>
                <p class="font-bold">Alex K.</p>
                <p class="text-sm text-gray-500">Writing since 2020</p>
              </div>
            </div>
            
            <!-- Right placeholder for image -->
            <div class="hidden md:flex items-center justify-center">
              <div class="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Bottom right placeholder for second testimonial (optional) -->
            <div class="md:col-start-1 md:row-start-2 hidden md:flex items-center justify-center">
              <div class="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Space for second testimonial (can be added later) -->
            <div class="md:col-start-2 md:row-start-2 md:ml-12">
              <!-- Second testimonial could go here -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-24 px-4 bg-[#f8e8e8]">
      <div class="max-w-7xl mx-auto relative">
        <!-- Left journal decoration -->
        <div class="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div class="w-44 h-60 bg-white rounded shadow-md transform rotate-[-6deg]"></div>
        </div>
        
        <!-- Right journal decoration -->
        <div class="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div class="w-44 h-60 bg-white rounded shadow-md transform rotate-[6deg]"></div>
        </div>
        
        <!-- CTA content -->
        <div class="text-center max-w-3xl mx-auto">
          <h2 class="text-6xl font-cormorant font-bold mb-6">Begin Your Story Today</h2>
          <p class="text-xl text-gray-600 mb-8">Your journey is waiting to be written. Join our community of writers and start documenting your story.</p>
          
          <!-- Handwritten text -->
          <div class="flex justify-end max-w-md mx-auto mb-8">
            <p class="font-caveat text-xl transform -rotate-2">Start here!</p>
          </div>
          
          <!-- CTA button -->
          <a href="#" class="inline-block px-10 py-4 rounded-full bg-[#ED6A8F] text-white text-lg font-medium hover:bg-opacity-90 transition duration-300 shadow-md mb-6 blink-button">
            Create Your First Journal
          </a>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="contacts" class="py-16 px-4 bg-[#f5f5f5]">
      <!-- Contacts Section -->
      <div class="max-w-7xl mx-auto mb-16">
        <h2 class="text-5xl font-cormorant font-bold text-center mb-4">Get In Touch</h2>
        <p class="text-xl text-gray-600 text-center mb-8">We'd love to hear from you</p>
      </div>
      
    <!-- Footer Section -->
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- Brand column -->
          <div class="mb-8 md:mb-0">
            <h3 class="text-xl font-cormorant font-bold mb-4">Library of Journals</h3>
            <p class="text-gray-600 mb-2">Your thoughts deserve a beautiful home.</p>
            <p class="font-caveat text-lg text-signup-pink">Write. Reflect. Grow.</p>
          </div>
          
          <!-- Explore column -->
          <div>
            <h4 class="font-bold mb-4">Explore</h4>
            <ul class="space-y-2">
              <li><a href="#features" class="text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Community Journals</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Writing Prompts</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Pricing</a></li>
            </ul>
          </div>
          
          <!-- Company column -->
          <div>
            <h4 class="font-bold mb-4">Company</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900">About Us</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
          
          <!-- Connect column -->
          <div>
            <h4 class="font-bold mb-4">Connect</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Instagram</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">Facebook</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <!-- Copyright and legal links -->
        <div class="text-center pt-8 border-t border-gray-200">
          <p class="text-gray-500 mb-4">&copy; 2025 Library of Journals. All rights reserved.</p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-500 hover:text-gray-700">Privacy</a>
            <a href="#" class="text-gray-500 hover:text-gray-700">Terms</a>
            <a href="#" class="text-gray-500 hover:text-gray-700">Cookies</a>
          </div>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import JournalPreview from '../components/JournalPreview.vue';
import { collection, getCountFromServer, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/config';

// State for journal pagination
const currentPage = ref(1);
const totalPages = 3; // Total number of pages in the journal preview
const writerCount = ref(0);

// Reference to the accounts collection
const accountsRef = collection(db, 'accounts');

// Set up real-time updates when component mounts
onMounted(() => {
  console.log('Setting up writer count listener...');
  
  // Set up real-time listener first for immediate updates
  const unsubscribe = onSnapshot(accountsRef, 
    (snapshot) => {
      const count = snapshot.size;
      console.log('Writer count updated:', count);
      writerCount.value = count;
    },
    (error) => {
      console.error('Error in real-time listener:', error);
    }
  );
  
  // Also get initial count (this might be slightly more accurate)
  getCountFromServer(accountsRef)
    .then(snapshot => {
      const count = snapshot.data().count;
      console.log('Initial count from server:', count);
      // Only update if we don't have a value yet
      if (writerCount.value === 0) {
        writerCount.value = count;
      }
    })
    .catch(error => {
      console.error('Error getting initial count:', error);
    });
  
  // Clean up the listener when component is unmounted
  onUnmounted(() => {
    console.log('Cleaning up writer count listener');
    unsubscribe();
  });
});

// Handler for next page button click
function handleNextPage() {
  if (currentPage.value < totalPages) {
    currentPage.value++;
  }
}

// Handler for previous page button click
function handlePrevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<style scoped>
/* Component-specific styles */
.page-wrapper {
  position: relative;
  overflow-x: hidden;
}

.page-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F5F3EE;
  background-image: url('../assets/bgImage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  opacity: 0.2;
  z-index: -1;
}

.landing-bg {
  position: relative;
}

.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.landing-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
}
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.timeline-gradient {
  background: linear-gradient(to bottom, rgba(233, 30, 99, 0.8), rgba(233, 30, 99, 0.1) 30%, rgba(233, 30, 99, 0.05) 70%, rgba(233, 30, 99, 0.8));
}

html {
  scroll-behavior: smooth;
}

@keyframes blink {
  0% { opacity: 1; box-shadow: 0 0 10px #ED6A8F; }
  50% { opacity: 0.7; box-shadow: 0 0 20px #ED6A8F; }
  100% { opacity: 1; box-shadow: 0 0 10px #ED6A8F; }
}

.blink-button {
  animation: blink 1.5s ease-in-out infinite;
  position: relative;
  z-index: 15;
}
</style>
