<template>
  <div class="writing-page-container">
    <!-- Top Navigation Bar -->
    <div class="top-nav-bar">
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

      <!-- Editor Area -->
      <div class="editor-area">
        <div class="editor-content">
          <h1>Untitled Chapter</h1>
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
  overflow: hidden;
  background-color: #f0f0f0;
  position: relative;
}

.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  box-sizing: border-box;
  position: relative;
  z-index: 5;
}

.view-options, .zoom-controls, .mode-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 5px;
}

.view-toggle-btn, .mode-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 0.9rem;
}

.view-toggle-btn.active, .mode-btn.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.zoom-controls {
  margin: 0 15px;
}

.zoom-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.zoom-controls span {
  margin: 0 10px;
  min-width: 40px;
  text-align: center;
  display: inline-block;
}

.main-content-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
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
  padding: 20px 0 0 0;
}

.sidebar-top {
  padding: 0 20px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px 20px;
}

.sidebar-bottom {
  padding: 15px 20px 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
  background: #f7f7f7;
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
}

.journal-item {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
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

/* Editor Area */
.editor-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  margin-left: 280px; /* Match sidebar width */
  height: calc(100vh - 60px);
  overflow-y: auto;
  box-sizing: border-box;
}

.editor-content {
  flex-grow: 1;
  background-color: #fffaf0;
  padding: 40px;
  border: 1px solid #e8e4d9;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 30px auto;
  min-height: calc(100% - 40px);
  box-sizing: border-box;
  position: relative;
}

.editor-content h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.editor-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
}

.bottom-pagination {
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.pagination-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.pagination-btn:hover {
  background: #e0e0e0;
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