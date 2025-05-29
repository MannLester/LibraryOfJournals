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
          <button class="back-to-home">
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
            <!-- Placeholder for chapter items -->
            <div class="journal-item">
              <span class="journal-icon"></span>
              <div class="journal-details">
                <p class="journal-title">Morning Reflections</p>
                <p class="journal-meta">Today - 24 pages</p>
              </div>
            </div>
            <div class="journal-item">
              <span class="journal-icon"></span>
              <div class="journal-details">
                <p class="journal-title">Travel Memories: V...</p>
                <p class="journal-meta">Yesterday - 15 pages</p>
              </div>
            </div>
            <!-- Additional example items to demonstrate scrolling -->
            <div class="journal-item" v-for="i in 10" :key="'item-'+i">
              <span class="journal-icon"></span>
              <div class="journal-details">
                <p class="journal-title">Chapter {{ i + 2 }}</p>
                <p class="journal-meta">2 days ago - 10 pages</p>
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
            <div class="page">
              <div class="page-title" contenteditable="true">
                <h1>Untitled Chapter</h1>
              </div>
              <div class="page-content" contenteditable="true">
                <p>Start writing your thoughts here...</p>
              </div>
            </div>
            <div class="page" v-if="isDoublePage">
              <div class="page-content" contenteditable="true">
                <p>Continue writing here...</p>
              </div>
            </div>
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
            <span class="page-indicator">Page 1 of 1</span>
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


<style scoped>
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
  left: 280px; /* Match sidebar width */
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
  background: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
}

.zoom-controls {
  background: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
  gap: 0;
  margin-right: 15px; /* Add some spacing between controls */
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
  color: #6c757d; /* Dark gray text */
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.zoom-btn:hover {
  color: #E9184C; /* Red color on hover */
}

.zoom-percent {
  font-size: 0.9rem;
  color: #6c757d;
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.mode-toggle {
  background: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: 40px;
  gap: 0; /* Remove gap since we're using padding */
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
  color: #6c757d; /* Dark gray for inactive text */
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
  color: #6c757d; /* Dark gray for inactive text */
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
  margin-top: 60px; /* Account for fixed header */
  margin-left: 280px; /* Match sidebar width */
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
  padding: 5px 0;
  flex-grow: 1;
  overflow-y: auto;
}

.journal-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 6px;
  margin: 0 10px 5px;
}

.journal-item:hover {
  background-color: #f0f0f0;
}

.journal-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  color: #666;
}

.journal-details {
  flex-grow: 1;
  min-width: 0;
}

.journal-title {
  font-weight: 500;
  margin: 0 0 3px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.journal-meta {
  font-size: 0.75rem;
  color: #777;
  margin: 0;
}

.settings-btn {
  padding: 10px 12px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #444;
  transition: background-color 0.2s;
}

.settings-btn:hover {
  background-color: #f0f0f0;
}

.icon-settings {
  margin-right: 8px;
  font-size: 1.1rem;
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
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  width: 90vh; /* Default width for single page */
  min-height: 127.26vh; /* A4 height (90vh * 1.414) */
}

.editor-content.double-page {
  width: 180vh; /* Double the width for two pages */
  flex-direction: row;
  justify-content: center;
  gap: 40px;
  padding: 20px 0;
}

.editor-content .page {
  width: 100%;
  height: 100%;
  padding: 6vh 8vh;
  box-sizing: border-box;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 123.26vh; /* Slightly less to account for padding */
}

@media (max-width: 1200px) {
  .editor-content {
    transform: scale(0.7);
  }
}

@media (max-width: 768px) {
  .editor-content {
    width: 90vw;
    height: calc(90vw * 1.414); /* A4 aspect ratio */
    transform: none;
    padding: 4vh 5vw;
    margin: 2vh auto;
  }
}

/* Remove outline from editable elements when focused */
[contenteditable="true"]:focus {
  outline: none;
}

/* Set Caveat font for all editable content */
[contenteditable="true"] {
  font-family: 'Caveat', cursive;
}

.editor-content h1 {
  font-size: clamp(2rem, 3.5vw, 2.5rem);
  margin: 0 0 2vh 0;
  color: #333;
  font-weight: 600; /* Made bolder */
  border-bottom: 1px solid #eee;
  padding-bottom: 1vh;
  line-height: 1.2;
}

.editor-content p {
  font-size: clamp(1.6rem, 1.2vw, 1.6rem);
  line-height: 1.8;
  color: #333;
  margin: 0 0 1.5vh 0;
  text-align: justify;
  font-weight: 400;
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
  color: #6c757d; /* Dark gray text color */
  font-size: 0.9rem; /* Slightly smaller font */
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

.page-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-indicator {
  font-size: 0.95rem;
  color: #6c757d; /* Dark gray text color */
  font-weight: 500;
}

.pagination-btn {
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem; /* Smaller font size */
  font-weight: 500;
  color: #6c757d; /* Dark gray text color */
  display: flex;
  align-items: center;
  gap: 6px; /* Fixed gap instead of viewport-based */
  transition: color 0.2s ease;
  white-space: nowrap; /* Prevent text wrapping */
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

/* Right Toolbar */
.right-toolbar {
  width: 60px;
  background-color: #f7f7f7;
  border-left: 1px solid #e0e0e0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  position: fixed;
  right: 0;
  top: 60px;
  z-index: 5;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.toolbar-btn .icon-save,
.toolbar-btn .icon-mic,
.toolbar-btn .icon-clock,
.toolbar-btn .icon-undo {
  font-size: 1.2rem;
  color: #555;
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
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';

const zoomLevel = ref(90);
const zoomChanged = ref(false);
let zoomTimeout = null;

// View mode state
const isDoublePage = ref(false);

// Toggle view mode
const toggleViewMode = (mode) => {
  const wasDoublePage = isDoublePage.value;
  isDoublePage.value = mode === 'double';
  
  // Set zoom to 90% when switching to double page
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
  // Apply the zoom to the editor content
  const scale = zoomLevel.value / 100;
  const editor = document.querySelector('.editor-content');
  if (editor) {
    editor.style.transform = `scale(${scale})`;
    editor.style.transformOrigin = 'top center';
  }
  
  // Trigger the animation
  zoomChanged.value = true;
  if (zoomTimeout) clearTimeout(zoomTimeout);
  zoomTimeout = setTimeout(() => {
    zoomChanged.value = false;
  }, 600);
};

// Initialize zoom when component is mounted
onMounted(() => {
  triggerZoomChange();
});
</script>