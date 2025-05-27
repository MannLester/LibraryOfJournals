<template>
  <div class="writing-page-container">
    <!-- Top Navigation Bar -->
    <div class="top-nav-bar">
      <button class="back-to-home">
        <span class="icon-home"></span> Back to Home
      </button>
      <div class="view-options">
        <button class="view-toggle-btn active">Single Page</button>
        <button class="view-toggle-btn">Double Page</button>
      </div>
      <div class="zoom-controls">
        <button class="zoom-btn">-</button>
        <span>90%</span>
        <button class="zoom-btn">+</button>
      </div>
      <div class="mode-toggle">
        <button class="mode-btn active">Write Mode</button>
        <button class="mode-btn">Present Mode</button>
      </div>
    </div>

    <div class="main-content-area">
      <!-- Left Sidebar -->
      <div class="left-sidebar">
        <div class="search-bar">
          <input type="text" placeholder="Search journals..." />
        </div>
        <button class="new-journal-btn">
          <span class="icon-plus"></span> New Journal
        </button>
        <div class="journal-filters">
          <button class="filter-tab active">All</button>
          <button class="filter-tab">Recent</button>
          <button class="filter-tab">Starred</button>
        </div>
        <div class="journal-list">
          <!-- Placeholder for journal items -->
          <div class="journal-item">
            <span class="journal-icon"></span>
            <div class="journal-details">
              <p class="journal-title">Morning Reflections</p>
              <p class="journal-meta">Today - 24 chapters</p>
            </div>
          </div>
          <div class="journal-item">
            <span class="journal-icon"></span>
            <div class="journal-details">
              <p class="journal-title">Travel Memories: V...</p>
              <p class="journal-meta">Yesterday - 15 chapters</p>
            </div>
          </div>
          <!-- ... more journal items -->
        </div>
        <button class="settings-btn">
          <span class="icon-settings"></span> Settings
        </button>
      </div>

      <!-- Editor Area -->
      <div class="editor-area">
        <div class="editor-content">
          <h1>Untitled Journal</h1>
          <p>Start writing your thoughts here...</p>
          <!-- This is where the actual text editor would go -->
        </div>
        <div class="bottom-pagination">
          <button class="pagination-btn">&lt; Previous</button>
          <span>Page 1 of 1</span>
          <button class="pagination-btn">Next &gt;</button>
        </div>
      </div>

      <!-- Right Toolbar -->
      <div class="right-toolbar">
        <button class="toolbar-btn"><span class="icon-save"></span></button>
        <button class="toolbar-btn"><span class="icon-mic"></span></button>
        <button class="toolbar-btn"><span class="icon-clock"></span></button>
        <button class="toolbar-btn"><span class="icon-undo"></span></button>
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
  overflow: hidden; /* Prevent scrollbars on the main container */
  background-color: #f0f0f0; /* Light grey background for the page */
}

.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  height: 60px; /* Fixed height for top nav */
  box-sizing: border-box;
}

.back-to-home {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.icon-home { /* Placeholder for an icon */
  margin-right: 5px;
}

.view-options, .zoom-controls, .mode-toggle {
  display: flex;
  align-items: center;
}

.view-options button, .zoom-controls button, .mode-toggle button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
}

.view-options button.active, .mode-toggle button.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.zoom-controls span {
  padding: 0 10px;
  font-size: 0.9rem;
}

.main-content-area {
  display: flex;
  flex-grow: 1; /* Takes remaining height */
  overflow: hidden; /* Important for nested scrolling */
}

.left-sidebar {
  width: 280px; /* Fixed width for sidebar */
  background-color: #f7f7f7;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow sidebar to scroll if content overflows */
  height: calc(100vh - 60px); /* Full height minus top-nav */
  box-sizing: border-box;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.new-journal-btn {
  width: 100%;
  padding: 12px;
  background-color: #E9184C; /* Primary color from image */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-plus { /* Placeholder */
  margin-right: 8px;
}

.journal-filters {
  display: flex;
  margin-bottom: 15px;
}

.journal-filters .filter-tab {
  flex-grow: 1;
  padding: 8px;
  text-align: center;
  background: none;
  border: 1px solid #ccc;
  cursor: pointer;
  border-right-width: 0;
}
.journal-filters .filter-tab:last-child {
  border-right-width: 1px;
}
.journal-filters .filter-tab.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.journal-list {
  flex-grow: 1; /* Takes available space */
  overflow-y: auto; /* Scroll for journal items */
}

.journal-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.journal-item:last-child {
  border-bottom: none;
}
.journal-icon { /* Placeholder */
  width: 24px;
  height: 24px;
  background-color: #ddd; /* Placeholder color */
  margin-right: 10px;
  border-radius: 3px;
}
.journal-details .journal-title {
  font-weight: bold;
  margin: 0 0 3px 0;
}
.journal-details .journal-meta {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.settings-btn {
  margin-top: auto; /* Pushes to the bottom */
  padding: 10px;
  background: none;
  border: 1px solid #ccc;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.icon-settings { /* Placeholder */
  margin-right: 5px;
}

.editor-area {
  flex-grow: 1; /* Takes up remaining space */
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 20px;
  overflow-y: auto; /* Allow editor content to scroll */
  height: calc(100vh - 60px); /* Full height minus top-nav */
  box-sizing: border-box;
}

.editor-content {
  flex-grow: 1;
  background-color: #fffaf0; /* Creamy background for paper */
  padding: 40px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.editor-content h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  margin-top: 0;
}

.editor-content p {
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: #555;
}

.bottom-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.pagination-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
}

.right-toolbar {
  width: 60px; /* Fixed width for right toolbar */
  background-color: #f7f7f7;
  border-left: 1px solid #e0e0e0;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 60px); /* Full height minus top-nav */
  box-sizing: border-box;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 50%; /* Circular buttons */
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toolbar-btn .icon-save, /* Placeholders */
.toolbar-btn .icon-mic,
.toolbar-btn .icon-clock,
.toolbar-btn .icon-undo {
  font-size: 1.2rem; /* Adjust as needed for actual icons */
}

/* Basic icon placeholders - replace with actual icons or SVGs */
.icon-home::before { content: "🏠"; }
.icon-plus::before { content: "+"; }
.icon-settings::before { content: "⚙️"; }
.icon-save::before { content: "💾"; } /* Example, from image it's a floppy disk like icon */
.icon-mic::before { content: "🎤"; }
.icon-clock::before { content: "🕒"; }
.icon-undo::before { content: "↩️"; } /* Or a redo icon, image is a bit blurry */
.journal-icon::before { content: "📖"; } /* Generic book icon for journal items */
</style>