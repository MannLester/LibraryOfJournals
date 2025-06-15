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
          </button>          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search chapters..." 
            />
          </div>
          <button class="new-journal-btn" @click="createNewChapter">
            <span class="icon-plus"></span> New Chapter
          </button>
        </div>
        
        <div class="scrollable-content">
          <div class="chapter-list">
            <!-- Cover Page -->
            <div class="chapter-item">
              <span class="chapter-icon">📕</span>
              <div class="chapter-details">
                <p class="chapter-title">Cover Page</p>
                <p class="chapter-meta">Click to edit</p>
              </div>
            </div>
              <!-- Chapters -->            <ChapterListItem
              v-for="(chapter, index) in filteredChapters"
              :key="chapter.id"              :title="chapter.title || `Chapter ${index + 1}`"
              :isActive="currentChapter === index"
              :isFirstChapter="index === 0"
              @click="selectChapter(index)"
              @delete="deleteChapter(index)"
            />
            
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
          <div class="editor-content" :class="{ 'double-page': isDoublePage, 'page-turning': isPageTurning }">
            
            <!-- Single Page View: Vertical Stack -->
            <template v-if="!isDoublePage">
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
                @page-became-empty="handlePageBecameEmpty"
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
                @page-became-empty="handlePageBecameEmpty"
                :ref="el => setNormalPageRef(el, index + 1)"
              />
            </template>

            <!-- Double Page View: Enhanced Book-like Experience -->
            <template v-else>
              <div class="book-container">
                <!-- Current Spread -->
                <div class="book-spread" :class="{ 'turning': isPageTurning }" ref="currentSpread">
                  <!-- Left Page -->
                  <div class="book-page left-page">
                    <div class="page-wrapper">
                      <ChapterPage
                        v-if="pages.length > 0 && currentDoublePageIndex === 0"
                        :page="pages[0]"
                        :pageIndex="0"
                        :isDoublePageLeft="true"
                        :isInDoublePageMode="true"
                        @update:title="updatePageTitle"
                        @update:content="updatePageContent"
                        @create-next-page="handleCreateNextPage"
                        @push-overflow-to-next-page="handlePushOverflowDoublePageMode"
                        @focus-next-page="handleFocusNextPage"
                        @page-became-empty="handlePageBecameEmpty"
                        ref="chapterPageRef"
                      />
                      <NormalPage
                        v-else-if="leftPageData"
                        :key="leftPageData.id"
                        :page="leftPageData"
                        :pageIndex="leftPageIndex"
                        :isDoublePageLeft="true"
                        :isInDoublePageMode="true"
                        @update:content="updatePageContent"
                        @create-next-page="handleCreateNextPage"
                        @push-overflow-to-next-page="handlePushOverflowDoublePageMode"
                        @focus-next-page="handleFocusNextPage"
                        @delete-current-page="handleDeletePage"
                        @page-became-empty="handlePageBecameEmpty"
                        :ref="el => setNormalPageRef(el, leftPageIndex)"
                      />
                      <div v-else class="empty-page">
                        <div class="empty-page-content">No content</div>
                      </div>
                    </div>
                  </div>

                  <!-- Book Spine/Gutter -->
                  <div class="book-spine"></div>

                  <!-- Right Page with Enhanced Animation -->
                  <div class="book-page right-page" ref="rightPageElement">
                    <div class="page-wrapper" ref="rightPageWrapper">
                      <!-- Page Back (what shows when page is flipped) -->
                      <div class="page-back" ref="pageBack">
                        <div class="content-isolation-wrapper">
                          <div class="page-back-content">
                            <!-- Next spread content will be shown here during transition -->
                          </div>
                        </div>
                      </div>
                      
                      <!-- Page Front (current content) -->
                      <div class="page-front" ref="pageFront">
                        <div class="content-isolation-wrapper">
                          <NormalPage
                            v-if="rightPageData"
                            :key="rightPageData.id"
                            :page="rightPageData"
                            :pageIndex="rightPageIndex"
                            :isDoublePageRight="true"
                            :isInDoublePageMode="true"
                            @update:content="updatePageContent"
                            @create-next-page="handleCreateNextPage"
                            @push-overflow-to-next-page="handlePushOverflowDoublePageMode"
                            @focus-next-page="handleFocusNextPage"
                            @delete-current-page="handleDeletePage"
                            @page-became-empty="handlePageBecameEmpty"
                            :ref="el => setNormalPageRef(el, rightPageIndex)"
                          />
                          <div v-else class="empty-page">
                            <div class="empty-page-content">No content</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Next Spread (hidden, used for seamless transition) -->
                <div class="book-spread next-spread" ref="nextSpread" v-show="false">
                  <!-- This will contain the next spread content -->
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Bottom Navigation - Only show in Double Page mode -->
        <div class="bottom-nav-bar" v-if="isDoublePage">
          <div class="nav-section left-section">
            <button 
              class="pagination-btn" 
              title="Previous spread"
              @click="previousSpread"
              :disabled="currentDoublePageIndex <= 0 || isPageTurning"
            >
              <span class="icon-arrow-left"></span> Previous
            </button>
          </div>
          <div class="nav-section center-section">
            <span class="page-indicator">
              Pages {{ getDisplayPageNumbers() }} of {{ totalPages }}
            </span>
          </div>
          <div class="nav-section right-section">
            <button 
              class="pagination-btn" 
              title="Next spread"
              @click="nextSpreadHandler"
              :disabled="!canGoToNextSpread || isPageTurning"
            >
              Next <span class="icon-arrow-right"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Action Buttons -->
      <div class="floating-actions">
        <button 
          class="fab" 
          title="Save"
          @click="saveChapter"
          :disabled="isSaving"
          :class="{ 'saving': isSaving }"
        >
          <span v-if="!isSaving" class="icon-save"></span>
          <span v-else class="icon-loading"></span>
          <span v-if="saveSuccess" class="fab-success">✓</span>
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
import ChapterListItem from '../components/ChapterListItem.vue';
import { defineEmits } from 'vue';
import { saveChapterAsTextPdf } from '../utils/pdfTextUtils';

// Zoom state
const zoomLevel = ref(90);
const zoomChanged = ref(false);
let zoomTimeout = null;

// Search state
const searchQuery = ref('');

// View mode state
const isDoublePage = ref(false);
const currentDoublePageIndex = ref(0);
const isPageTurning = ref(false);

// Enhanced page turning refs
const rightPageElement = ref(null);
const rightPageWrapper = ref(null);
const pageFront = ref(null);
const pageBack = ref(null);
const currentSpread = ref(null);
const nextSpread = ref(null);

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

// Save chapter as PDF
const isSaving = ref(false);
const saveError = ref(null);
const saveSuccess = ref(false);

const saveChapter = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  saveError.value = null;
  saveSuccess.value = false;
  
  try {
    // Get the main content element
    const contentElement = document.querySelector('.editor-content');
    if (!contentElement) {
      throw new Error('Editor content element not found. Please try again.');
    }

    // Get the current user ID and document IDs (replace with actual values)
    const userId = 'current-user'; // TODO: Get from auth
    const journalId = 'current-journal'; // TODO: Get from route/params
    const chapterId = 'current-chapter'; // TODO: Get from route/params
    
    if (!userId || !journalId || !chapterId) {
      throw new Error('Missing required document IDs');
    }

    console.log('Starting PDF generation...');
    
    // Generate and save PDF
    const { publicUrl, error } = await saveChapterAsTextPdf(contentElement, {
      chapterId,
      userId,
      journalId
    });

    if (error) {
      throw error;
    }

    console.log('PDF saved successfully:', publicUrl);
    
    // Here you would typically update the chapter's pdfPath in Firebase
    // Example:
    // await updateDoc(doc(db, 'users', userId, 'journals', journalId, 'chapters', chapterId), {
    //   pdfPath: publicUrl,
    //   updatedAt: serverTimestamp()
    // });
    
    saveSuccess.value = true;
    
    // Show success message
    alert('Chapter saved successfully!');
    
  } catch (error) {
    console.error('Error saving chapter:', error);
    saveError.value = error.message || 'Failed to save chapter';
    alert(`Error: ${saveError.value}`);
  } finally {
    isSaving.value = false;
    
    // Reset success message after 3 seconds
    if (saveSuccess.value) {
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    }
  }
};

// Chapter management
const chapters = ref([
  { id: 1, title: 'Chapter 1' }
]);
const currentChapter = ref(0);

// Filter chapters based on search query
const filteredChapters = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return chapters.value;
  return chapters.value.filter(chapter => 
    chapter.title.toLowerCase().includes(query)
  );
});

const selectChapter = (index) => {
  currentChapter.value = index;
};

const createNewChapter = () => {
  const newChapter = {
    id: Date.now(),
    title: `Chapter ${chapters.value.length + 1}`
  };
  chapters.value.push(newChapter);
};

const deleteChapter = (index) => {
  if (index === 0) return; // Prevent deleting first chapter
  chapters.value.splice(index, 1);
  if (currentChapter.value >= index) {
    currentChapter.value = Math.max(0, currentChapter.value - 1);
  }
};

// Computed properties
const normalPages = computed(() => {
  return pages.value.slice(1).filter(page => page.type === 'normal');
});

const totalPages = computed(() => {
  return pages.value.length;
});

const leftPageIndex = computed(() => {
  if (currentDoublePageIndex.value === 0) {
    return 0;
  }
  return (currentDoublePageIndex.value * 2);
});

const rightPageIndex = computed(() => {
  if (currentDoublePageIndex.value === 0) {
    return 1;
  }
  return (currentDoublePageIndex.value * 2) + 1;
});

const leftPageData = computed(() => {
  if (currentDoublePageIndex.value === 0) {
    return null;
  }
  const index = leftPageIndex.value;
  return index < pages.value.length ? pages.value[index] : null;
});

const rightPageData = computed(() => {
  const index = rightPageIndex.value;
  // FIXED: Always show the page if it exists, regardless of content
  // The page component will handle showing placeholder text if empty
  if (index < pages.value.length) {
    return pages.value[index];
  }
  return null; // This will show "No content" only if page doesn't exist
});

const canGoToNextSpread = computed(() => {
  const maxPageIndex = Math.max(leftPageIndex.value, rightPageIndex.value);
  return maxPageIndex < pages.value.length - 1;
});

const getDisplayPageNumbers = () => {
  const left = leftPageIndex.value + 1;
  const right = rightPageIndex.value + 1;
  
  if (rightPageIndex.value < pages.value.length) {
    return `${left}-${right}`;
  } else {
    return `${left}`;
  }
};

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
    zoomLevel.value = 70;
    currentDoublePageIndex.value = 0;
    triggerZoomChange();
  } else if (wasDoublePage && !isDoublePage.value) {
    zoomLevel.value = 90;
    triggerZoomChange();
  }
};

// ENHANCED: Realistic paper turning animation with physics
const performPageTurn = async (direction = 'next') => {
  if (isPageTurning.value) return;
  
  isPageTurning.value = true;
  
  const rightPage = rightPageElement.value;
  const pageWrapper = rightPageWrapper.value;
  const front = pageFront.value;
  const back = pageBack.value;
  
  if (!rightPage || !pageWrapper || !front || !back) {
    isPageTurning.value = false;
    return;
  }

  // Prepare the page back with next content preview
  if (direction === 'next') {
    prepareNextPageContent();
  }

  // Add turning class to trigger CSS animations
  rightPage.classList.add('turning');
  pageWrapper.classList.add('page-turning');
  
  // Create realistic paper physics with multiple stages
  await animatePageTurn(direction);
  
  // Clean up and show new content
  rightPage.classList.remove('turning');
  pageWrapper.classList.remove('page-turning');
  
  isPageTurning.value = false;
};

// ENHANCED: Multi-stage page turning animation
const animatePageTurn = async (direction) => {
  const duration = 1200; // Longer, more realistic duration
  const stages = [
    { progress: 0, rotation: 0, curl: 0, shadow: 0 },
    { progress: 0.2, rotation: -15, curl: 5, shadow: 0.1 },
    { progress: 0.4, rotation: -45, curl: 15, shadow: 0.3 },
    { progress: 0.6, rotation: -90, curl: 25, shadow: 0.5 },
    { progress: 0.8, rotation: -135, curl: 15, shadow: 0.3 },
    { progress: 1, rotation: -180, curl: 0, shadow: 0 }
  ];

  const rightPage = rightPageElement.value;
  const pageWrapper = rightPageWrapper.value;

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const nextStage = stages[i + 1];
    
    if (nextStage) {
      await animateToStage(stage, nextStage, duration / stages.length);
    }
  }
};

// Animate between two stages with easing
const animateToStage = (fromStage, toStage, duration) => {
  return new Promise(resolve => {
    const startTime = performance.now();
    const rightPage = rightPageElement.value;
    const pageWrapper = rightPageWrapper.value;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use cubic-bezier easing for natural paper movement
      const eased = easeOutCubic(progress);
      
      // Interpolate between stages
      const rotation = lerp(fromStage.rotation, toStage.rotation, eased);
      const curl = lerp(fromStage.curl, toStage.curl, eased);
      const shadow = lerp(fromStage.shadow, toStage.shadow, eased);
      
      // Apply transformations
      if (pageWrapper) {
        pageWrapper.style.transform = `
          rotateY(${rotation}deg) 
          rotateX(${curl * 0.3}deg)
          translateZ(${curl}px)
        `;
        pageWrapper.style.filter = `drop-shadow(${shadow * 10}px 0 ${shadow * 20}px rgba(0,0,0,${shadow * 0.4}))`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
};

// Easing function for natural movement
const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

// Linear interpolation
const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

// Prepare next page content for smooth transition
const prepareNextPageContent = () => {
  const nextLeftIndex = (currentDoublePageIndex.value + 1) * 2;
  const nextRightIndex = nextLeftIndex + 1;
  
  // This would populate the page back with preview of next content
  // Implementation depends on your specific content structure
};

const previousSpread = async () => {
  if (currentDoublePageIndex.value > 0 && !isPageTurning.value) {
    await performPageTurn('prev');
    currentDoublePageIndex.value--;
  }
};

const nextSpreadHandler = async () => {
  if (canGoToNextSpread.value && !isPageTurning.value) {
    await performPageTurn('next');
    currentDoublePageIndex.value++;
  }
};

const autoAdvanceToNextSpread = async () => {
  console.log('Auto-advancing to next spread...');
  await performPageTurn('next');
  currentDoublePageIndex.value++;
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
    const cleanTitle = title?.trim() || '';
    pages.value[0].title = cleanTitle;
    chapters.value[currentChapter.value].title = cleanTitle;
  }
};

const updatePageContent = ({ index, content }) => {
  if (pages.value[index]) {
    pages.value[index].content = content;
  }
};

// NEW: Handle when a page becomes empty (all text deleted)
const handlePageBecameEmpty = async (pageIndex) => {
  console.log(`Page ${pageIndex} became empty`);
  
  if (isDoublePage.value) {
    // In double page mode, handle navigation when page becomes empty
    const isLeftPageInSpread = pageIndex === leftPageIndex.value && currentDoublePageIndex.value > 0;
    const isRightPageInSpread = pageIndex === rightPageIndex.value;
    
    console.log('Debug info:', {
      pageIndex,
      leftPageIndex: leftPageIndex.value,
      rightPageIndex: rightPageIndex.value,
      currentDoublePageIndex: currentDoublePageIndex.value,
      isLeftPageInSpread,
      isRightPageInSpread
    });
    
    if (isLeftPageInSpread) {
      // Left page became empty, go to previous spread
      console.log('Left page became empty, navigating to previous spread');
      
      // Calculate the target page index BEFORE changing currentDoublePageIndex
      // We want the right page of the previous spread
      // Special case: When we're at spread 1 (pages 2-3) and deleting page 2 (left), 
      // we want to focus on page 1 (right of spread 0, which is the chapter page)
      const targetSpreadIndex = currentDoublePageIndex.value - 1;
      
      // In spread 0, the right page is the chapter page (index 0)
      // In all other spreads, right page is (spreadIndex * 2) + 1
      let targetPageIndex;
      if (targetSpreadIndex === 0) {
        targetPageIndex = 1; // The right page of spread 0 is always index 1
      } else {
        targetPageIndex = targetSpreadIndex * 2 + 1; // Right page of target spread
      }
      
      console.log('Target page calculation:', {
        currentDoublePageIndex: currentDoublePageIndex.value,
        targetSpreadIndex,
        targetPageIndex,
        formula: `${targetSpreadIndex} * 2 + 1 = ${targetPageIndex}`
      });
      
      // Now update the current double page index
      currentDoublePageIndex.value = targetSpreadIndex;
      
      console.log('🔍 DEBUG handlePageBecameEmpty - AFTER UPDATING currentDoublePageIndex:', {
        newCurrentDoublePageIndex: currentDoublePageIndex.value,
        newLeftPageIndex: leftPageIndex.value,
        newRightPageIndex: rightPageIndex.value,
        targetPageIndex,
        targetSpreadIndex,
        normalPageRefsKeys: Object.keys(normalPageRefs.value),
        hasTargetPageRef: !!normalPageRefs.value[targetPageIndex],
        hasChapterPageRef: !!chapterPageRef.value,
        formula: `${targetSpreadIndex} * 2 + 1 = ${targetPageIndex}`
      });
      
      // Focus on the RIGHT page of the previous spread
      setTimeout(() => {
        console.log('🔍 DEBUG handlePageBecameEmpty - FOCUSING on right page of previous spread:', {
          targetPageIndex,
          targetSpreadIndex,
          currentDoublePageIndex: currentDoublePageIndex.value,
          normalPageRefsAvailable: Object.keys(normalPageRefs.value),
          hasTargetPageRef: !!normalPageRefs.value[targetPageIndex]
        });
        
        // IMPORTANT: Check if we're trying to focus on page 1 (first normal page)
        if (targetPageIndex === 1) {
          console.log('🔍 DEBUG handlePageBecameEmpty - Attempting to focus on page index 1 (first normal page)');
          console.log('🔍 DEBUG handlePageBecameEmpty - normalPageRefs keys:', Object.keys(normalPageRefs.value));
          console.log('🔍 DEBUG handlePageBecameEmpty - normalPageRefs[1] exists?', !!normalPageRefs.value[1]);
          
          // Try to get the page ref directly
          const pageOneRef = normalPageRefs.value[1];
          
          if (pageOneRef) {
            console.log('🔍 DEBUG handlePageBecameEmpty - Found page 1 ref, focusing');
            pageOneRef.focusAtEnd();
          } else {
            console.log('🔍 DEBUG handlePageBecameEmpty - Page 1 ref not found, checking if it might be the chapter page');
            // As a fallback, try the chapter page
            if (chapterPageRef.value) {
              console.log('🔍 DEBUG handlePageBecameEmpty - Focusing on chapter page as fallback');
              chapterPageRef.value.focusContentAtEnd();
            } else {
              console.log('🔍 DEBUG handlePageBecameEmpty - CRITICAL ERROR: Neither page 1 ref nor chapter page ref found');
            }
          }
        } else if (targetPageIndex === 0) {
          // This should never happen for right page, but just in case
          console.log('🔍 DEBUG handlePageBecameEmpty - Focusing on chapter page (this should not happen for right page)');
          if (chapterPageRef.value) {
            chapterPageRef.value.focusContentAtEnd();
          } else {
            console.log('🔍 DEBUG handlePageBecameEmpty - CRITICAL ERROR: Chapter page ref not found');
          }
        } else {
          // Other normal pages
          console.log(`🔍 DEBUG handlePageBecameEmpty - Focusing on normal page at index ${targetPageIndex}`);
          console.log('🔍 DEBUG handlePageBecameEmpty - Available refs:', Object.keys(normalPageRefs.value));
          
          const pageRef = normalPageRefs.value[targetPageIndex];
          if (pageRef) {
            console.log('🔍 DEBUG handlePageBecameEmpty - Found page ref, focusing');
            pageRef.focusAtEnd();
          } else {
            console.log(`🔍 DEBUG handlePageBecameEmpty - CRITICAL ERROR: Normal page ref at index ${targetPageIndex} not found`);
            console.log('🔍 DEBUG handlePageBecameEmpty - Pages array length:', pages.value.length);
            console.log('🔍 DEBUG handlePageBecameEmpty - All pages:', pages.value.map((p, i) => ({ index: i, type: p.type })));
          }
        }
      }, 100);
    } else if (isRightPageInSpread) {
      // Right page became empty, focus on left page
      setTimeout(() => {
        if (leftPageIndex.value === 0) {
          // Focus on chapter page
          console.log('Focusing on chapter page (left page of spread 1)');
          if (chapterPageRef.value) {
            chapterPageRef.value.focusContentAtEnd();
          }
        } else {
          // Focus on normal page
          console.log(`Focusing on normal page at index ${leftPageIndex.value}`);
          const leftPageRef = normalPageRefs.value[leftPageIndex.value];
          if (leftPageRef) {
            leftPageRef.focusAtEnd();
          }
        }
      }, 100);
    }
  } else {
    // In single page mode, focus on previous page
    const prevIndex = pageIndex - 1;
    setTimeout(() => {
      if (prevIndex === 0 && chapterPageRef.value) {
        chapterPageRef.value.focusContentAtEnd();
      } else if (prevIndex > 0) {
        const prevPageRef = normalPageRefs.value[prevIndex];
        if (prevPageRef) {
          prevPageRef.focusAtEnd();
        }
      }
    }, 100);
  }
};

const handlePushOverflowDoublePageMode = async ({ pageIndex, nextPageIndex, overflowContent }) => {
  console.log(`Double page mode: Pushing overflow from page ${pageIndex} to ${nextPageIndex}`, { overflowContent });
  
  const isRightPageOfSpread = pageIndex === rightPageIndex.value;
  
  if (isRightPageOfSpread) {
    console.log('Right page of spread is full, creating new spread...');
    
    const newLeftPage = {
      id: Date.now(),
      type: 'normal',
      content: overflowContent
    };
    
    pages.value.push(newLeftPage);
    
    await autoAdvanceToNextSpread();
    
    nextTick(() => {
      const newLeftPageRef = normalPageRefs.value[pages.value.length - 1];
      if (newLeftPageRef) {
        newLeftPageRef.focusAtEnd();
      }
    });
  } else {
    // FIXED: Handle overflow to right page properly
    if (nextPageIndex < pages.value.length) {
      // Page exists, prepend content
      const nextPageRef = nextPageIndex === 0 ? chapterPageRef.value : normalPageRefs.value[nextPageIndex];
      
      if (nextPageRef) {
        nextPageRef.prependContent(overflowContent);
      }
    } else {
      // Page doesn't exist, create it
      const newPage = {
        id: Date.now(),
        type: 'normal',
        content: overflowContent
      };
      
      pages.value.push(newPage);
      
      nextTick(() => {
        const newPageRef = normalPageRefs.value[nextPageIndex];
        if (newPageRef) {
          newPageRef.focusAtEnd();
        }
      });
    }
  }
};

const handlePushOverflow = ({ pageIndex, nextPageIndex, overflowContent }) => {
  console.log(`Single page mode: Pushing overflow from page ${pageIndex} to ${nextPageIndex}`, { overflowContent });
  
  if (nextPageIndex < pages.value.length) {
    console.log('Next page exists, prepending content');
    
    const nextPageRef = nextPageIndex === 0 ? chapterPageRef.value : normalPageRefs.value[nextPageIndex];
    
    if (nextPageRef) {
      nextPageRef.prependContent(overflowContent);
    }
  } else {
    console.log('Next page does not exist, creating new page');
    handleCreateNextPage({ 
      pageIndex, 
      overflowContent 
    });
  }
};

const handleCreateNextPage = ({ pageIndex, overflowContent }) => {
  const newPage = {
    id: Date.now(),
    type: 'normal',
    content: overflowContent
  };
  
  pages.value.splice(pageIndex + 1, 0, newPage);
  
  nextTick(() => {
    const newPageRef = normalPageRefs.value[pageIndex + 1];
    if (newPageRef) {
      newPageRef.focusAtEnd();
    }
  });
};

const handleDeletePage = (pageIndex) => {
  if (pageIndex <= 0 || pages.value.length <= 1) {
    return;
  }
  
  // Check if we're in double page mode and deleting a left page of a spread (not the first spread)
  const isLeftPageInSpread = isDoublePage.value && 
                            pageIndex === leftPageIndex.value && 
                            currentDoublePageIndex.value > 0;
  
  // Store the current double page index before deletion
  const currentSpreadIndex = currentDoublePageIndex.value;
  
  console.log('🔍 DEBUG handleDeletePage - BEFORE DELETION:', {
    pageIndex,
    isLeftPageInSpread,
    currentDoublePageIndex: currentDoublePageIndex.value,
    leftPageIndex: leftPageIndex.value,
    rightPageIndex: rightPageIndex.value,
    pagesLength: pages.value.length,
    allPages: pages.value.map((p, i) => ({ index: i, type: p.type, hasContent: !!p.content })),
    normalPageRefs: Object.keys(normalPageRefs.value)
  });
  
  // Delete the page
  pages.value.splice(pageIndex, 1);
  
  // Handle navigation and focus after deletion
  nextTick(() => {
    if (isLeftPageInSpread) {
      // If deleting left page in a spread, go back to previous spread
      console.log('Deleted left page in spread, navigating to previous spread');
      
      // Calculate the target page index BEFORE changing currentDoublePageIndex
      // We want the right page of the previous spread
      // Special case: When we're at spread 1 (pages 2-3) and deleting page 2 (left), 
      // we want to focus on page 1 (right of spread 0, which is the chapter page)
      const targetSpreadIndex = currentSpreadIndex - 1;
      
      // In spread 0, the right page is the chapter page (index 0)
      // In all other spreads, right page is (spreadIndex * 2) + 1
      let targetPageIndex;
      if (targetSpreadIndex === 0) {
        targetPageIndex = 1; // The right page of spread 0 is always index 1
      } else {
        targetPageIndex = targetSpreadIndex * 2 + 1; // Right page of target spread
      }
      
      console.log('Target page calculation:', {
        currentSpreadIndex,
        targetSpreadIndex,
        targetPageIndex,
        formula: `${targetSpreadIndex} * 2 + 1 = ${targetPageIndex}`
      });
      
      // Now update the current double page index
      currentDoublePageIndex.value = targetSpreadIndex;
      
      console.log('🔍 DEBUG - AFTER UPDATING currentDoublePageIndex:', {
        newCurrentDoublePageIndex: currentDoublePageIndex.value,
        newLeftPageIndex: leftPageIndex.value,
        newRightPageIndex: rightPageIndex.value,
        targetPageIndex,
        targetSpreadIndex,
        normalPageRefsKeys: Object.keys(normalPageRefs.value),
        hasTargetPageRef: !!normalPageRefs.value[targetPageIndex],
        hasChapterPageRef: !!chapterPageRef.value
      });
      
      // Use a longer timeout to ensure DOM is fully updated
      setTimeout(() => {
        console.log('🔍 DEBUG - FOCUSING on right page of previous spread:', {
          targetPageIndex,
          targetSpreadIndex,
          currentDoublePageIndex: currentDoublePageIndex.value,
          normalPageRefsAvailable: Object.keys(normalPageRefs.value),
          hasTargetPageRef: !!normalPageRefs.value[targetPageIndex]
        });
        
        // IMPORTANT: Check if we're trying to focus on page 1 (first normal page)
        if (targetPageIndex === 1) {
          console.log('🔍 DEBUG - Attempting to focus on page index 1 (first normal page)');
          console.log('🔍 DEBUG - normalPageRefs keys:', Object.keys(normalPageRefs.value));
          console.log('🔍 DEBUG - normalPageRefs[1] exists?', !!normalPageRefs.value[1]);
          
          // Try to get the page ref directly
          const pageOneRef = normalPageRefs.value[1];
          
          if (pageOneRef) {
            console.log('🔍 DEBUG - Found page 1 ref, focusing');
            pageOneRef.focusAtEnd();
          } else {
            console.log('🔍 DEBUG - Page 1 ref not found, checking if it might be the chapter page');
            // As a fallback, try the chapter page
            if (chapterPageRef.value) {
              console.log('🔍 DEBUG - Focusing on chapter page as fallback');
              chapterPageRef.value.focusContentAtEnd();
            } else {
              console.log('🔍 DEBUG - CRITICAL ERROR: Neither page 1 ref nor chapter page ref found');
            }
          }
        } else {
          // Focus on normal page
          const targetPageRef = normalPageRefs.value[targetPageIndex];
          console.log('🔍 DEBUG - Target page ref:', {
            hasTargetPageRef: !!targetPageRef,
            targetPageIndex,
            availableRefs: Object.keys(normalPageRefs.value)
          });
          
          if (targetPageRef) {
            console.log('🔍 DEBUG - Calling focusAtEnd on target page ref');
            targetPageRef.focusAtEnd();
          } else {
            console.log('🔍 DEBUG - CRITICAL ERROR: Target page ref not found!');
            console.log('🔍 DEBUG - Available refs:', Object.keys(normalPageRefs.value));
            console.log('🔍 DEBUG - Pages array length:', pages.value.length);
            console.log('🔍 DEBUG - All pages:', pages.value.map((p, i) => ({ index: i, type: p.type })));
          }
        }
      }, 100); // Give more time for DOM updates
    } else {
      // Original behavior for other cases (right pages, single page mode)
      const prevIndex = pageIndex - 1;
      
      // Use a longer timeout to ensure DOM is fully updated
      setTimeout(() => {
        if (prevIndex === 0) {
          // Focus on chapter page
          if (chapterPageRef.value) {
            chapterPageRef.value.focusContentAtEnd();
          }
        } else {
          // Focus on normal page
          const prevPageRef = normalPageRefs.value[prevIndex];
          if (prevPageRef) {
            prevPageRef.focusAtEnd();
          }
        }
      }, 100); // Give more time for DOM updates
    }
  });
};

const goToHome = () => {
  window.dispatchEvent(new CustomEvent('showPage', { detail: { page: 'home' } }));
};

onMounted(() => {
  triggerZoomChange();
});

const emit = defineEmits([
  'update:title',
  'update:content',
  'create-next-page',
  'push-overflow-to-next-page',
  'focus-next-page'
]);

const handleFocusNextPage = ({ pageIndex, nextPageIndex, cursorOffset }) => {
  console.log(`Focusing next page ${nextPageIndex} at offset ${cursorOffset}`);
  
  nextTick(() => {
    if (nextPageIndex === 0) {
      if (chapterPageRef.value) {
        chapterPageRef.value.focusAtPosition(cursorOffset);
      }
    } else {
      const nextPageRef = normalPageRefs.value[nextPageIndex];
      if (nextPageRef) {
        nextPageRef.focusAtPosition(cursorOffset);
      }
    }
  });
};
</script>

<style scoped>
/* Floating action button styles */
.fab {
  position: relative;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4a6bdf;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  font-size: 1.2rem;
}

.fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.fab:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.fab.saving {
  background: #757575;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.fab .icon-loading {
  animation: spin 1s linear infinite;
  font-size: 1.2rem;
  display: inline-block;
  width: 1em;
  height: 1em;
  line-height: 1;
}

/* Define the hourglass icon for the loading state */
.icon-loading::before {
  content: "⏳";
}

.fab-success {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  animation: fadeIn 0.3s ease;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.mode-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: #f0f0f0;
  color: #333;
  font-weight: 500;
}

.save-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s ease;
}

.save-btn:hover {
  background-color: #45a049;
}

.save-btn .icon-save {
  font-size: 16px;
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

/* ENHANCED: Editor Content with Better Paper Physics */
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

/* ENHANCED: Double Page Layout with Realistic Book Environment */
.editor-content.double-page {
  width: auto;
  min-width: 180vh;
  max-width: calc(100vw - 320px);
  min-height: auto;
  padding: 40px;
  background: linear-gradient(135deg, #2d1810 0%, #3a2a1d 50%, #2d1810 100%);
  border: none;
  box-shadow: none;
  position: relative;
}

/* Add subtle book texture */
.editor-content.double-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 50%),
    linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.01) 50%, transparent 51%);
  pointer-events: none;
  z-index: 0;
}

/* ENHANCED: Book Container with Perspective */
.book-container {
  position: relative;
  perspective: 2000px;
  perspective-origin: center center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ENHANCED: Book Spread with Realistic Physics */
.book-spread {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  width: 100%;
  min-height: 127.26vh;
  position: relative;
  padding: 0 15px;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
}

/* ENHANCED: Book Pages with Paper Texture */
.book-page {
  flex: 0 0 auto;
  width: 90vh;
  max-width: 45vw;
  height: 127.26vh; /* Fixed height */
  max-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  margin: 0;
  padding: 0;
  transform-style: preserve-3d;
  align-self: flex-start;
  overflow: hidden; /* Prevent content from spilling */
}

.book-page > * {
  margin: 0 !important;
  position: relative;
  top: 0;
}

/* ENHANCED: Page Wrapper for Complex Animations */
.page-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: all 0.1s ease;
}

/* FIXED: Completely isolate content from 3D transforms */
.page-front,
.page-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: flat; /* Change from preserve-3d to flat */
}

.page-front {
  z-index: 2;
  transform: none; /* Remove any transforms */
}

.page-back {
  z-index: 1;
  transform: rotateY(180deg); /* Remove scaleX(-1) */
}

/* CRITICAL FIX: Isolate all text content from parent transforms */
.page-front > *,
.page-back > *,
.page-wrapper > *,
.book-page > * {
  transform: none !important;
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: normal !important;
}

/* Ensure page components are not affected by 3D transforms */
.book-page .page,
.book-page .page-content,
.book-page .page-title,
.book-page [contenteditable] {
  transform: none !important;
  direction: ltr !important;
  writing-mode: horizontal-tb !important;
  text-orientation: mixed !important;
}

/* Fix placeholder text specifically */
.book-page .page-content:empty::before,
.book-page .page-content.empty::before,
.book-page .page-title:empty::before,
.book-page .page-title.empty::before {
  transform: none !important;
  direction: ltr !important;
  display: block !important;
  text-align: left !important;
}

/* Alternative approach: Use a content isolation wrapper */
.content-isolation-wrapper {
  transform: none !important;
  direction: ltr !important;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
}

/* Ensure turning animation only affects the page wrapper, not content */
.book-page.right-page.turning .page-wrapper {
  transform-origin: left center;
  animation: realisticPageTurnIsolated 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  z-index: 10;
  position: relative;
}

/* Updated animation that doesn't affect content */
@keyframes realisticPageTurnIsolated {
  0% {
    transform: rotateY(0deg) rotateX(0deg) translateZ(0px);
    filter: drop-shadow(0px 0 0px rgba(0,0,0,0));
  }
  
  15% {
    transform: rotateY(-12deg) rotateX(2deg) translateZ(8px);
    filter: drop-shadow(3px 0 8px rgba(0,0,0,0.15));
  }
  
  30% {
    transform: rotateY(-35deg) rotateX(5deg) translateZ(20px);
    filter: drop-shadow(8px 0 15px rgba(0,0,0,0.25));
  }
  
  50% {
    transform: rotateY(-90deg) rotateX(8deg) translateZ(30px);
    filter: drop-shadow(15px 0 25px rgba(0,0,0,0.4));
  }
  
  70% {
    transform: rotateY(-145deg) rotateX(5deg) translateZ(20px);
    filter: drop-shadow(8px 0 15px rgba(0,0,0,0.25));
  }
  
  85% {
    transform: rotateY(-168deg) rotateX(2deg) translateZ(8px);
    filter: drop-shadow(3px 0 8px rgba(0,0,0,0.15));
  }
  
  100% {
    transform: rotateY(-180deg) rotateX(0deg) translateZ(0px);
    filter: drop-shadow(0px 0 0px rgba(0,0,0,0));
    opacity: 0;
  }
}

/* Prevent any inherited transforms on content elements */
.book-page *[contenteditable],
.book-page .page-content,
.book-page .page-title {
  transform: none !important;
  direction: ltr !important;
  text-align: left !important;
  writing-mode: horizontal-tb !important;
  unicode-bidi: normal !important;
}

/* Force correct text direction on all text elements */
.book-page * {
  direction: ltr !important;
  unicode-bidi: normal !important;
}

/* ENHANCED: Realistic Page Turning Animation */
.book-page.right-page.turning .page-wrapper {
  transform-origin: left center;
  animation: realisticPageTurn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  z-index: 10;
  position: relative;
}

/* Ensure content inside turning pages maintains correct orientation */
.book-page.right-page.turning .page-wrapper > * {
  transform: none !important;
  direction: ltr !important;
}

/* ENHANCED: Multi-stage realistic page turn */
@keyframes realisticPageTurn {
  0% {
    transform: rotateY(0deg) rotateX(0deg) translateZ(0px);
    filter: drop-shadow(0px 0 0px rgba(0,0,0,0));
  }
  
  15% {
    transform: rotateY(-12deg) rotateX(2deg) translateZ(8px);
    filter: drop-shadow(3px 0 8px rgba(0,0,0,0.15));
  }
  
  30% {
    transform: rotateY(-35deg) rotateX(5deg) translateZ(20px);
    filter: drop-shadow(8px 0 15px rgba(0,0,0,0.25));
  }
  
  50% {
    transform: rotateY(-90deg) rotateX(8deg) translateZ(30px);
    filter: drop-shadow(15px 0 25px rgba(0,0,0,0.4));
  }
  
  70% {
    transform: rotateY(-145deg) rotateX(5deg) translateZ(20px);
    filter: drop-shadow(8px 0 15px rgba(0,0,0,0.25));
  }
  
  85% {
    transform: rotateY(-168deg) rotateX(2deg) translateZ(8px);
    filter: drop-shadow(3px 0 8px rgba(0,0,0,0.15));
  }
  
  100% {
    transform: rotateY(-180deg) rotateX(0deg) translateZ(0px);
    filter: drop-shadow(0px 0 0px rgba(0,0,0,0));
    opacity: 0;
  }
}

/* ENHANCED: Paper curl effect during turn */
.book-page.right-page.turning .page-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 30%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.15) 70%,
    rgba(0, 0, 0, 0.2) 100%
  );
  opacity: 0;
  animation: paperCurlShadow 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  z-index: 3;
  border-radius: 0 8px 8px 0;
}

@keyframes paperCurlShadow {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* ENHANCED: Page edge highlight during turn */
.book-page.right-page.turning .page-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.8) 100%
  );
  opacity: 0;
  animation: pageEdgeHighlight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 4;
}

@keyframes pageEdgeHighlight {
  0%, 100% {
    opacity: 0;
  }
  30%, 70% {
    opacity: 1;
  }
}

/* ENHANCED: Left and Right Page Styling */
.left-page {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  box-shadow: 
    -8px 0 20px rgba(0, 0, 0, 0.15),
    inset 3px 0 6px rgba(0, 0, 0, 0.05);
  margin: 0 !important;
  top: 0;
}

.right-page {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 
    8px 0 20px rgba(0, 0, 0, 0.15),
    inset -3px 0 6px rgba(0, 0, 0, 0.05);
  margin: 10px 0 0 0 !important;
  top: 0;
}

/* ENHANCED: Book Spine with Realistic Binding */
.book-spine {
  width: 24px;
  background: linear-gradient(to right, 
    rgba(0, 0, 0, 0.2) 0%, 
    rgba(0, 0, 0, 0.1) 20%,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.05) 60%,
    rgba(0, 0, 0, 0.1) 80%,
    rgba(0, 0, 0, 0.2) 100%
  );
  min-height: 127.26vh;
  flex-shrink: 0;
  position: relative;
  box-shadow: 
    inset 2px 0 4px rgba(0, 0, 0, 0.1),
    inset -2px 0 4px rgba(0, 0, 0, 0.1);
}

/* Add binding texture */
.book-spine::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 80%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(139, 69, 19, 0.3) 0px,
    rgba(139, 69, 19, 0.3) 2px,
    transparent 2px,
    transparent 8px
  );
}

/* ENHANCED: Empty Page with Paper Texture */
.empty-page {
  background: 
    linear-gradient(135deg, #fefefe 0%, #fdfdfd 50%, #fefefe 100%),
    radial-gradient(circle at 30% 30%, rgba(0,0,0,0.02) 0%, transparent 50%);
  width: 90vh;
  max-width: 100%;
  height: 127.26vh;
  padding: 6vh 8vh;
  box-sizing: border-box;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  top: 0;
}

.empty-page-content {
  color: #bbb;
  font-style: italic;
  font-size: 1.2rem;
  font-family: 'Caveat', cursive;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* ENHANCED: Disable interactions during page turn */
.book-spread.turning {
  pointer-events: none;
}

.book-spread.turning * {
  user-select: none;
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

.pagination-btn:hover:not(:disabled) {
  color: #E9184C;
  transform: none;
  background: transparent;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
@media (max-width: 1200px) {
  .editor-content {
    transform: scale(0.7);
  }
  
  .editor-content.double-page {
    transform: scale(0.6);
  }
  
  .book-page {
    width: 70vh;
  }
}

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
  
  .editor-content {
    width: 90vw;
    height: calc(90vw * 1.414);
    transform: none;
    padding: 4vh 5vw;
    margin: 2vh auto;
  }
  
  .editor-content.double-page {
    flex-direction: column;
    width: 90vw;
    transform: none;
  }
  
  .book-spread {
    flex-direction: column;
    gap: 20px;
    padding: 0 15px;
  }
  
  .book-spine {
    width: 100%;
    height: 20px;
    min-height: auto;
  }
  
  .book-page {
    width: 100%;
    max-width: none;
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
