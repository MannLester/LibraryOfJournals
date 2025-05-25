<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-blue-600">Library of Journals</span>
          <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <button @click="decreaseZoom" class="p-1 hover:bg-gray-100 rounded">-</button>
            <span class="text-sm">{{ Math.round(zoom * 100) }}%</span>
            <button @click="increaseZoom" class="p-1 hover:bg-gray-100 rounded">+</button>
          </div>
          <button @click="saveContent" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Save
          </button>
        </div>
      </div>
      
      <!-- Formatting Toolbar -->
      <div class="border-t border-gray-200 px-4 py-1 flex items-center space-x-2 overflow-x-auto">
        <select v-model="settings.fontFamily" class="text-sm border rounded px-2 py-1">
          <option value="sans">Arial</option>
          <option value="serif">Times New Roman</option>
          <option value="mono">Courier New</option>
        </select>
        
        <select v-model="settings.fontSize" class="text-sm border rounded px-2 py-1 w-16">
          <option v-for="size in [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]" :value="size">
            {{ size }}
          </option>
        </select>
        
        <div class="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button @click="toggleBold" :class="{'bg-gray-200': settings.isBold}" class="p-1 rounded hover:bg-gray-100">
          <span class="font-bold">B</span>
        </button>
        <button @click="toggleItalic" :class="{'bg-gray-200': settings.isItalic}" class="p-1 rounded hover:bg-gray-100">
          <em>I</em>
        </button>
        <button @click="toggleUnderline" :class="{'bg-gray-200': settings.isUnderline}" class="p-1 rounded hover:bg-gray-100">
          <u>U</u>
        </button>
        
        <div class="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button @click="changeAlignment('left')" :class="{'bg-gray-200': settings.textAlign === 'left'}" class="p-1 rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="changeAlignment('center')" :class="{'bg-gray-200': settings.textAlign === 'center'}" class="p-1 rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm2 5a1 1 0 100 2h8a1 1 0 100-2H6zm-1 5a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="changeAlignment('right')" :class="{'bg-gray-200': settings.textAlign === 'right'}" class="p-1 rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 5a1 1 0 100 2h8a1 1 0 100-2H7zm-4 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div class="h-6 w-px bg-gray-300 mx-1"></div>
        
        <input type="color" v-model="settings.textColor" class="w-6 h-6 p-0 border-0 rounded overflow-hidden cursor-pointer" title="Text color">
        <button class="p-1 rounded hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v5a1 1 0 11-2 0V6.414l-4.293 4.293a1 1 0 01-1.414 0L6 6.414V8a1 1 0 11-2 0V3z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M4 13a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
    
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside :class="{'w-64': isSidebarOpen, 'w-0': !isSidebarOpen}" class="h-full bg-white border-r border-gray-200 transition-all duration-200 overflow-hidden">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Document</h2>
            <button @click="addNewChapter" class="text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <input 
            type="text" 
            v-model="chapterSearch" 
            placeholder="Search in document" 
            class="w-full px-3 py-2 border rounded-lg text-sm mb-4"
          >
          
          <div class="space-y-1">
            <div 
              v-for="chapter in filteredChapters" 
              :key="chapter.id"
              @click="selectChapter(chapter)"
              class="px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer"
              :class="{'bg-blue-50 text-blue-700': currentChapter?.id === chapter.id}"
            >
              {{ chapter.title }}
            </div>
          </div>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div class="flex-1 overflow-auto p-8">
          <div class="relative mx-auto bg-white shadow-lg rounded-sm" :style="{
            width: `${8.5 * zoom}in`,
            minHeight: `${11 * zoom}in`,
            padding: `${1 * zoom}in`,
            boxSizing: 'border-box',
            margin: '0 auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }">
            <textarea
              v-model="content"
              class="w-full h-full p-8 outline-none resize-none bg-white"
              :style="{
                fontSize: `${settings.fontSize}px`,
                fontFamily: settings.fontFamily === 'sans' ? 'Arial, sans-serif' : settings.fontFamily === 'serif' ? 'Times New Roman, serif' : 'Courier New, monospace',
                color: settings.textColor,
                textAlign: settings.textAlign,
                lineHeight: '1.5',
                fontWeight: settings.isBold ? 'bold' : 'normal',
                fontStyle: settings.isItalic ? 'italic' : 'normal',
                textDecoration: settings.isUnderline ? 'underline' : 'none',
                direction: 'ltr',
                minHeight: '100%',
                boxSizing: 'border-box',
                border: 'none',
                backgroundImage: 'none',
                overflow: 'hidden',
                fontVariantLigatures: 'none',
                lineBreak: 'normal',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                WebkitTextFillColor: settings.textColor
              }"
              placeholder="Start typing here..."
              @input="handleTextInput"
              @keydown.delete="handleDelete"
              ref="editor"
            ></textarea>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Status Bar -->
    <footer class="border-t border-gray-200 px-4 py-1 text-xs text-gray-500 flex justify-between items-center">
      <div>Words: {{ wordCount }}</div>
      <div>
        <button @click="toggleVoiceInput" class="p-1 rounded-full hover:bg-gray-100" :class="{'text-red-500': isRecording}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Chapter {
  id: string
  title: string
  content: string
  dateCreated: Date
  lastModified: Date
}

interface WritingSettings {
  fontFamily: string
  fontSize: number
  pageColor: string
  textColor: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  lineSpacing: 1 | 1.15 | 1.5 | 2
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  indentLevel: number
}

// State
const zoom = ref(1)
const mode = ref('write')
const content = ref('') // This holds the text content of the editor
const isSidebarOpen = ref(true)
const isScrolled = ref(false)

// Computed values for numeric properties
const lineHeightValue = computed(() => `${settings.value.lineSpacing * 1.75}rem`)
const indentValue = computed(() => `${1 + settings.value.indentLevel * 0.5}rem`)
const fontSizeValue = computed(() => `${settings.value.fontSize}px`)

// Chapter Management
const chapters = ref<Chapter[]>([])
const currentChapter = ref<Chapter | null>(null)
const chapterSearch = ref('')
const filteredChapters = computed(() => {
  return chapters.value.filter(chapter => 
    chapter.title.toLowerCase().includes(chapterSearch.value.toLowerCase())
  )
})

// Settings
const settings = ref<WritingSettings>({
  fontFamily: 'serif',
  fontSize: 16,
  pageColor: '#ffffff',
  textColor: '#000000',
  textAlign: 'left',
  lineSpacing: 1.15,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  indentLevel: 0
})

// Voice Input
const isRecording = ref(false)
const recognition = ref<any>(null)

// Image Upload
const imageInput = ref<HTMLInputElement | null>(null)

// Computed
const wordCount = computed(() => {
  return content.value.trim() ? content.value.trim().split(/\s+/).length : 0
})

// Refs
const editor = ref<HTMLTextAreaElement | null>(null)

// Methods
const handleTextInput = (e: Event) => {
  // This will be handled by v-model
}

const handleDelete = (e: KeyboardEvent) => {
  // Let the default delete behavior happen
}

const addNewChapter = () => {
  const newChapter: Chapter = {
    id: Date.now().toString(),
    title: 'New Chapter',
    content: '',
    dateCreated: new Date(),
    lastModified: new Date()
  }
  chapters.value.push(newChapter)
}

const selectChapter = (chapter: Chapter) => {
  currentChapter.value = chapter
  content.value = chapter.content
}

const saveContent = () => {
  if (currentChapter.value) {
    currentChapter.value.content = content.value
    currentChapter.value.lastModified = new Date()
    console.log('Content saved:', currentChapter.value)
    // Here you would typically make an API call to save the content
  } else {
    console.log('No chapter selected')
  }
}

const toggleVoiceInput = () => {
  if (!recognition.value) {
    recognition.value = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
    recognition.value.continuous = true
    recognition.value.interimResults = true
    
    recognition.value.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      
      content.value += transcript
    }
  }

  if (!isRecording.value) {
    recognition.value.start()
  } else {
    recognition.value.stop()
  }
  isRecording.value = !isRecording.value
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = `\n![${file.name}](${e.target?.result})\n`
      content.value += img
    }
    reader.readAsDataURL(file)
  }
}

// Zoom controls
const decreaseZoom = () => {
  if (zoom.value > 0.5) zoom.value -= 0.1
}

const increaseZoom = () => {
  if (zoom.value < 2) zoom.value += 0.1
}

// Formatting Methods
const toggleBold = () => {
  settings.value.isBold = !settings.value.isBold
}

const toggleItalic = () => {
  settings.value.isItalic = !settings.value.isItalic
}

const toggleUnderline = () => {
  settings.value.isUnderline = !settings.value.isUnderline
}

const changeAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
  settings.value.textAlign = align
}

const changeLineSpacing = (spacing: 1 | 1.15 | 1.5 | 2) => {
  settings.value.lineSpacing = spacing
}

const adjustIndent = (direction: 'increase' | 'decrease') => {
  if (direction === 'increase' && settings.value.indentLevel < 4) {
    settings.value.indentLevel++
  } else if (direction === 'decrease' && settings.value.indentLevel > 0) {
    settings.value.indentLevel--
  }
}

const insertList = (type: 'bullet' | 'number') => {
  const prefix = type === 'bullet' ? '• ' : '1. '
  content.value += `\n${prefix}`
}
</script>

<style>
* {
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

textarea {
  background: linear-gradient(to bottom, transparent 0%, transparent 97%, #e5e7eb 97%, #e5e7eb 100%);
  background-size: 100% 1.75rem;
  line-height: v-bind('lineHeightValue');
  font-family: v-bind('settings.fontFamily');
  font-size: v-bind('fontSizeValue');
  color: v-bind('settings.textColor');
  text-align: v-bind('settings.textAlign');
  padding-left: v-bind('indentValue');
}

.writing-page {
  background-color: v-bind('settings.pageColor');
}

.bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}

.underline {
  text-decoration: underline;
}

.indent-1 {
  padding-left: 1rem;
}

.indent-2 {
  padding-left: 2rem;
}

.indent-3 {
  padding-left: 3rem;
}

.indent-4 {
  padding-left: 4rem;
}
</style>