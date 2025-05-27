<template>
  <div class="writing-page-container">
    <!-- Top Navigation Bar -->
    <div class="top-nav-bar">
      <div class="top-nav-content">
        <div class="nav-section">
          <div class="view-options">
            <button class="view-toggle-btn active">Single Page</button>
            <button class="view-toggle-btn">Double Page</button>
          </div>
        </div>
        
        <div class="nav-section">
          <div class="zoom-controls">
            <button class="zoom-btn">-</button>
            <span>90%</span>
            <button class="zoom-btn">+</button>
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
            <span class="icon-home"></span> Back to Home
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
            <span class="icon-settings"></span> Settings
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Editor Area -->
        <div class="editor-area">
          <div class="editor-content">
            <h1>Untitled Chapter</h1>
            <p>Start writing your thoughts here...</p>
            <!-- This is where the actual text editor would go -->
          </div>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav-bar">
          <div class="nav-section">
            <button class="view-toggle-btn">Single Page</button>
            <button class="view-toggle-btn">Double Page</button>
          </div>
          <div class="nav-section">
            <div class="page-controls">
              <button class="pagination-btn" title="Previous page">
                <span class="icon-arrow-left"></span> Previous
              </button>
              <span class="page-indicator">Page 1 of 1</span>
              <button class="pagination-btn" title="Next page">
                Next <span class="icon-arrow-right"></span>
              </button>
            </div>
          </div>
          <div class="nav-section">
            <div class="zoom-controls">
              <button class="zoom-btn">-</button>
              <span>100%</span>
              <button class="zoom-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Toolbar -->
      <div class="right-toolbar">
        <button class="toolbar-btn">
          <span class="icon-save"></span>
        </button>
        <button class="toolbar-btn">
          <span class="icon-mic"></span>
        </button>
        <button class="toolbar-btn">
          <span class="icon-clock"></span>
        </button>
        <button class="toolbar-btn">
          <span class="icon-undo"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script setup area for future logic
</script>

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

.view-options, .mode-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 100%;
}

.view-toggle-btn, .mode-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
  color: #555;
}

.view-toggle-btn.active, .mode-btn.active {
  background-color: #e0e0e0;
  font-weight: bold;
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
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: #333;
  text-decoration: none;
  width: 100%;
}

.back-to-home:hover {
  background-color: #e9ecef;
}

.icon-home {
  margin-right: 8px;
  font-size: 1.1rem;
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
  padding: 60px 80px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 210mm; /* A4 width */
  min-height: 297mm; /* A4 height */
  margin: 30px auto;
  box-sizing: border-box;
  position: relative;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: scale(0.8); /* Scale down to fit */
  transform-origin: top center;
  margin-bottom: 30px;
}

.editor-content h1 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.editor-content p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #333;
  margin: 0 0 1rem 0;
  text-align: justify;
}

/* Bottom Navigation */
.bottom-nav-bar {
  height: 60px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}

.bottom-nav-bar .nav-section {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.bottom-nav-bar .nav-section:first-child {
  justify-content: flex-start;
}

.bottom-nav-bar .nav-section:nth-child(2) {
  justify-content: center;
}

.bottom-nav-bar .nav-section:last-child {
  justify-content: flex-end;
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-indicator {
  font-size: 0.9rem;
  color: #555;
  margin: 0 10px;
}

.pagination-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.pagination-btn:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.icon-arrow-left,
.icon-arrow-right {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.icon-arrow-left {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 19l-7-7 7-7' /%3E%3C/svg%3E");
}

.icon-arrow-right {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5l7 7-7 7' /%3E%3C/svg%3E");
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