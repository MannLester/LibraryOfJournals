<template>
  <div class="writing-page-container">
    <!-- Top Navigation Bar -->
    <div class="top-nav-bar">
      <div class="top-nav-content">
        <div class="nav-section">
          <div class="view-options">
            <button 
              class="view-toggle-btn" 
              :class="{ 'active': !isDoublePage }"
              @click="toggleViewMode('single')"
            >
              Single Page
            </button>
            <button 
              class="view-toggle-btn"
              :class="{ 'active': isDoublePage }"
              @click="toggleViewMode('double')"
            >
              Double Page
            </button>
          </div>
        </div>
        
        <div class="nav-section">
          <div class="zoom-controls">
            <button class="zoom-btn" @click="handleZoomOut">-</button>
            <span class="zoom-percent" :class="{ 'zoom-changed': zoomChanged }">{{ zoomLevel }}%</span>
            <button class="zoom-btn" @click="handleZoomIn">+</button>
          </div>
        </div>
        
        <div class="nav-section">
          <div class="mode-toggle">
            <button class="mode-btn active">Write Mode</button>
            <button class="mode-btn">Present Mode</button>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content-area">
      <!-- Left Sidebar -->
      <div class="left-sidebar">
        <div class="sidebar-top">
          <button class="back-to-home" @click="goToHome">
            <span class="home-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                style="color: inherit;"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" style="color: inherit;"/>
                <polyline points="9,22 9,12 15,12 15,22" style="color: inherit;"/>
              </svg>
            </span>
            <span class="btn-text">Back to Home</span>
          </button>
          <div class="search-bar">
            <input type="text" placeholder="Search chapters..." />
          </div>
          <button class="new-journal-btn">
            <span class="icon-plus"></span> New Chapter
          </button>
        </div>
        
        <div class="scrollable-content">
          <div class="chapter-list">
            <!-- Cover Page -->
            <div class="chapter-item active">
              <span class="chapter-icon">📕</span>
              <div class="chapter-details">
                <p class="chapter-title">Cover Page</p>
                <p class="chapter-meta">Click to edit</p>
              </div>
            </div>
            
            <!-- Back Page -->
            <div class="chapter-item">
              <span class="chapter-icon">📕</span>
              <div class="chapter-details">
                <p class="chapter-title">Back Page</p>
                <p class="chapter-meta">Click to edit</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-bottom">
          <button class="settings-btn">
            <span class="settings-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                style="color: inherit;"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" style="color: inherit;"/>
                <circle cx="12" cy="12" r="3" style="color: inherit;"/>
              </svg>
            </span>
            <span class="btn-text">Settings</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Editor Area -->
        <div class="editor-area">
          <div class="editor-content" :class="{ 'double-page': isDoublePage }">
            <!-- Chapter Page (First Page) -->
            <ChapterPage
              v-if="pages.length > 0"
              :page="pages[0]"
              :pageIndex="0"
              @update:title="updatePageTitle"
              @update:content="updatePageContent"
              @create-next-page="handleCreateNextPage"
              @push-overflow-to-next-page="handlePushOverflow"
              @focus-next-page="handleFocusNextPage"
              ref="chapterPageRef"
            />
            
            <!-- Normal Pages -->
            <NormalPage
              v-for="(page, index) in normalPages"
              :key="page.id"
              :page="page"
              :pageIndex="index + 1"
              @update:content="updatePageContent"
              @create-next-page="handleCreateNextPage"
              @push-overflow-to-next-page="handlePushOverflow"
              @focus-next-page="handleFocusNextPage"
              @delete-current-page="handleDeletePage"
              :ref="el => setNormalPageRef(el, index + 1)"
            />
          </div>
        </div>

        <!-- Bottom Navigation - Only show in Double Page mode -->
        <div class="bottom-nav-bar" v-if="isDoublePage">
          <div class="nav-section left-section">
            <button class="pagination-btn" title="Previous page">
              <span class="icon-arrow-left"></span> Previous
            </button>
          </div>
          <div class="nav-section center-section">
            <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
          <div class="nav-section right-section">
            <button class="pagination-btn" title="Next page">
              Next <span class="icon-arrow-right"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Action Buttons -->
      <div class="floating-actions">
        <button class="fab" title="Save">
          <span class="icon-save"></span>
        </button>
        <button class="fab" title="Voice Input">
          <span class="icon-mic"></span>
        </button>
        <button class="fab" title="History">
          <span class="icon-clock"></span>
        </button>
        <button class="fab" title="Undo">
          <span class="icon-undo"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import ChapterPage from '../components/pages/ChapterPage.vue';
import NormalPage from '../components/pages/NormalPage.vue';
import { defineEmits } from 'vue';

// Zoom state
const zoomLevel = ref(90);
const zoomChanged = ref(false);
let zoomTimeout = null;

// View mode state
const isDoublePage = ref(false);

// Page management
const pages = ref([
  {
    id: 1,
    type: 'chapter',
    title: '',
    content: ''
  }
]);

const currentPage = ref(1);

// Component refs
const chapterPageRef = ref(null);
const normalPageRefs = ref({});

// Computed properties
const normalPages = computed(() => {
  return pages.value.slice(1).filter(page => page.type === 'normal');
});

const totalPages = computed(() => {
  return pages.value.length;
});

// Helper function to set normal page refs
const setNormalPageRef = (el, index) => {
  if (el) {
    normalPageRefs.value[index] = el;
  }
};

// Toggle view mode
const toggleViewMode = (mode) => {
  const wasDoublePage = isDoublePage.value;
  isDoublePage.value = mode === 'double';
  
  if (!wasDoublePage && isDoublePage.value) {
    zoomLevel.value = 90;
    triggerZoomChange();
  }
};

const handleZoomIn = () => {
  if (zoomLevel.value < 150) {
    zoomLevel.value += 10;
    triggerZoomChange();
  }
};

const handleZoomOut = () => {
  if (zoomLevel.value > 50) {
    zoomLevel.value -= 10;
    triggerZoomChange();
  }
};

const triggerZoomChange = () => {
  const scale = zoomLevel.value / 100;
  const editor = document.querySelector('.editor-content');
  if (editor) {
    editor.style.transform = `scale(${scale})`;
    editor.style.transformOrigin = 'top center';
  }
  
  zoomChanged.value = true;
  if (zoomTimeout) clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => {
    zoomChanged.value = false;
  }, 600);
};

// Page content management
const updatePageTitle = (title) => {
  if (pages.value[0]) {
    pages.value[0].title = title;
  }
};

const updatePageContent = ({ index, content }) => {
  if (pages.value[index]) {
    pages.value[index].content = content;
  }
};

// NEW: Handle pushing overflow content to next page with ripple effect
const handlePushOverflow = ({ pageIndex, nextPageIndex, overflowContent }) => {
  console.log(`Pushing overflow from page ${pageIndex} to ${nextPageIndex}`, { overflowContent });
  
  // Check if next page exists
  if (nextPageIndex < pages.value.length) {
    // Next page exists, prepend overflow content to it
    console.log('Next page exists, prepending content');
    
    const nextPageRef = nextPageIndex === 0 ? chapterPageRef.value : normalPageRefs.value[nextPageIndex];
    
    if (nextPageRef) {
      // Prepend content to next page
      nextPageRef.prependContent(overflowContent);
      
      // Focus will stay on current page where user is typing
    }
  } else {
    // Next page doesn't exist, create it
    console.log('Next page does not exist, creating new page');
    handleCreateNextPage({ 
      pageIndex, 
      overflowContent 
    });
  }
};

// Handle creating next page when content overflows
const handleCreateNextPage = ({ pageIndex, overflowContent }) => {
  const newPage = {
    id: Date.now(),
    type: 'normal',
    content: overflowContent
  };
  
  // Insert new page after current page
  pages.value.splice(pageIndex + 1, 0, newPage);
  
  // Focus the new page
  nextTick(() => {
    const newPageRef = normalPageRefs.value[pageIndex + 1];
    if (newPageRef) {
      newPageRef.focusAtEnd();
    }
  });
};

// Handle deleting current page
const handleDeletePage = (pageIndex) => {
  // Don't delete if it's the only page or the chapter page
  if (pageIndex <= 0 || pages.value.length <= 1) {
    return;
  }
  
  // Remove the page
  pages.value.splice(pageIndex, 1);
  
  // Focus the previous page
  nextTick(() => {
    const prevIndex = pageIndex - 1;
    
    if (prevIndex === 0) {
      // Focus the chapter page
      if (chapterPageRef.value) {
        chapterPageRef.value.focusContentAtEnd();
      }
    } else {
      // Focus the previous normal page
      const prevPageRef = normalPageRefs.value[prevIndex];
      if (prevPageRef) {
        prevPageRef.focusAtEnd();
      }
    }
  });
};

const goToHome = () => {
  // Dispatch custom event to change page
  window.dispatchEvent(new CustomEvent('showPage', { detail: { page: 'home' } }));
};

// Initialize zoom when component is mounted
onMounted(() => {
  triggerZoomChange();
});

const emit = defineEmits([
  'update:title',
  'update:content',
  'create-next-page',
  'push-overflow-to-next-page',
  'focus-next-page' // Add this new event
]);

// NEW: Handle focusing next page when cursor moves to overflow content
const handleFocusNextPage = ({ pageIndex, nextPageIndex, cursorOffset }) => {
  console.log(`Focusing next page ${nextPageIndex} at offset ${cursorOffset}`);
  
  nextTick(() => {
    if (nextPageIndex === 0) {
      // Focus chapter page
      if (chapterPageRef.value) {
        chapterPageRef.value.focusAtPosition(cursorOffset);
      }
    } else {
      // Focus normal page
      const nextPageRef = normalPageRefs.value[nextPageIndex];
      if (nextPageRef) {
        nextPageRef.focusAtPosition(cursorOffset);
      }
    }
  });
};
</script>

<style scoped>
/* All the existing styles remain the same */
.writing-page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f0f0f0;
  position: relative;
}

.top-nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 5;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.top-nav-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-section {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-section:first-child {
  justify-content: flex-start;
}

.nav-section:nth-child(2) {
  justify-content: center;
}

.nav-section:last-child {
  justify-content: flex-end;
}

.view-options {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
}

.zoom-controls {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
  gap: 0;
  margin-right: 15px;
}

@keyframes zoomPulse {
  0% { color: #6c757d; }
  50% { color: #E9184C; }
  100% { color: #6c757d; }
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  color: #6c757d;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.zoom-btn:hover {
  color: #E9184C;
}

.zoom-percent {
  font-size: 0.9rem;
  color: #6c757d;
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.mode-toggle {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
  gap: 0;
}

.view-toggle-btn {
  padding: 0 20px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  background: transparent;
  color: #6c757d;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.view-toggle-btn:hover {
  color: #212529;
}

.view-toggle-btn.active {
  background: white;
  color: #E9184C;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 600;
}

.mode-btn {
  padding: 0 20px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  background: transparent;
  color: #6c757d;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.mode-btn:hover {
  color: #212529;
}

.mode-btn.active {
  background: white;
  color: #E9184C;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-weight: 600;
}

.main-content-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  margin-top: 60px;
  margin-left: 280px;
  width: calc(100% - 280px);
}

/* Left Sidebar Styles */
.left-sidebar {
  width: 280px;
  background-color: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  padding: 0;
}

.sidebar-top {
  padding: 20px 20px 15px;
  border-bottom: 1px solid #e0e0e0;
  background: #f7f7f7;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.sidebar-bottom {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f7f7f7;
  margin-top: auto;
}

.back-to-home {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  margin-bottom: 8px;
  border-radius: 6px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: none !important;
}

.back-to-home:focus {
  outline: none;
  box-shadow: none;
}

.back-to-home:hover {
  background-color: #f8f9fa;
  color: #E9184C;
}

.back-to-home:hover .home-icon,
.back-to-home:hover .home-icon svg,
.back-to-home:hover .home-icon path,
.back-to-home:hover .home-icon polyline,
.back-to-home:hover .btn-text {
  color: #E9184C;
  stroke: #E9184C;
}

.back-to-home:active {
  background-color: #f1f3f5;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  border-radius: 6px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: none !important;
}

.settings-btn:focus {
  outline: none;
  box-shadow: none;
}

.settings-btn:hover {
  background-color: #f8f9fa;
  color: #E9184C;
}

.settings-btn:hover .settings-icon,
.settings-btn:hover .settings-icon svg,
.settings-btn:hover .settings-icon path,
.settings-btn:hover .settings-icon circle,
.settings-btn:hover .btn-text {
  color: #E9184C;
  stroke: #E9184C;
}

.settings-btn:active {
  background-color: #f1f3f5;
}

.settings-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: color 0.2s ease;
}

.settings-btn:hover .settings-icon {
  color: #495057;
}

.home-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: color 0.2s ease;
}

.back-to-home:hover .home-icon {
  color: #495057;
}

.btn-text {
  font-weight: 500;
}

.search-bar {
  margin-bottom: 15px;
  width: 100%;
}

.search-bar input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.new-journal-btn {
  width: 100%;
  padding: 12px;
  background-color: #E9184C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.new-journal-btn:hover {
  background-color: #d31642;
}

.icon-plus {
  margin-right: 8px;
  font-size: 1rem;
}

.chapter-list {
  padding: 10px;
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chapter-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.chapter-item.active {
  background-color: rgba(233, 24, 76, 0.1);
  border-left: 3px solid #E9184C;
}

.chapter-icon {
  font-size: 1.5rem;
  margin-right: 12px;
  width: 32px;
  text-align: center;
}

.chapter-details {
  flex: 1;
  min-width: 0;
}

.chapter-title {
  font-weight: 500;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-meta {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* Editor Area */
.editor-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 0;
  box-sizing: border-box;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100% - 60px);
}

.editor-content {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin: 2vh auto;
  box-sizing: border-box;
  position: relative;
  background: white;
  transform-origin: top center;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  width: 90vh;
  min-height: 127.26vh;
  max-width: 100%;
}

.editor-content.double-page {
  width: 180vh;
  max-width: calc(100vw - 320px);
  flex-direction: row;
  justify-content: center;
  gap: 40px;
  padding: 20px 0;
}

@media (max-width: 1200px) {
  .editor-content {
    transform: scale(0.7);
  }
}

@media (max-width: 768px) {
  .editor-content {
    width: 90vw;
    height: calc(90vw * 1.414);
    transform: none;
    padding: 4vh 5vw;
    margin: 2vh auto;
  }
}

/* Bottom Navigation */
.bottom-nav-bar {
  min-height: 50px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 8px 20px 12px;
  box-sizing: border-box;
  width: 100%;
  color: #6c757d;
  font-size: 0.9rem;
}

.bottom-nav-bar .nav-section {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.bottom-nav-bar .left-section {
  justify-content: flex-start;
  padding-left: 0;
  width: 20%;
}

.bottom-nav-bar .center-section {
  justify-content: center;
  width: 60%;
}

.bottom-nav-bar .right-section {
  justify-content: flex-end;
  padding-right: 0;
  width: 20%;
  text-align: right;
}

.page-indicator {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
}

.pagination-btn {
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.pagination-btn:hover {
  color: #E9184C;
  transform: none;
  background: transparent;
}

.icon-arrow-left,
.icon-arrow-right {
  display: inline-block;
  width: 1.6vh;
  height: 1.6vh;
  min-width: 14px;
  min-height: 14px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.icon-arrow-left {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236c757d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7' /%3E%3C/svg%3E");
}

.icon-arrow-right {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236c757d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' /%3E%3C/svg%3E");
}

/* Floating Action Buttons */
.floating-actions {
  position: fixed;
  right: 2vw;
  bottom: 12vh;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  z-index: 100;
  transition: all 0.3s ease;
}

.fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  color: #555;
  font-size: 1.2rem;
}

.fab:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.fab:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-actions {
    bottom: 15vh;
    right: 3vw;
  }
  
  .fab {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
}

/* Icons */
.icon-home::before { content: "🏠"; }
.icon-plus::before { content: "+"; font-weight: bold; }
.icon-settings::before { content: "⚙️"; }
.icon-save::before { content: "💾"; }
.icon-mic::before { content: "🎤"; }
.icon-clock::before { content: "🕒"; }
.icon-undo::before { content: "↩️"; }
.journal-icon::before { content: "📄"; }

/* Animation for zoom level */
.zoom-changed {
  animation: zoomPulse 0.6s ease;
}
</style>
