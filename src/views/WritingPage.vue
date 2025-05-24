<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Sidebar: Chapter Navigation -->
    <div class="w-64 border-r border-gray-200 h-screen overflow-y-auto bg-white p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-serif text-lg">Chapters</h2>
        <button @click="addNewChapter" class="text-blue-600 hover:text-blue-700">
          <span class="text-xl">+</span>
        </button>
      </div>
      
      <!-- Chapter Search -->
      <div class="mb-4">
        <input 
          type="text"
          v-model="chapterSearch"
          placeholder="Search chapters..."
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <!-- Chapter List -->
      <div class="space-y-2">
        <div 
          v-for="chapter in filteredChapters" 
          :key="chapter.id"
          @click="selectChapter(chapter)"
          class="p-2 hover:bg-gray-100 rounded cursor-pointer"
          :class="{'bg-blue-50': currentChapter?.id === chapter.id}"
        >
          {{ chapter.title }}
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1">      <!-- Top Navigation Bar -->
      <div class="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <!-- Left: Page Layout Controls -->
          <div class="flex space-x-4">
            <button 
              @click="layout = 'single'"
              :class="{'text-blue-600': layout === 'single'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Single Page
            </button>
            <button 
              @click="layout = 'double'"
              :class="{'text-blue-600': layout === 'double'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Double Page
            </button>
          </div>

          <!-- Right: Zoom and Mode Controls -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <button @click="decreaseZoom" class="p-2 hover:bg-gray-100 rounded">
                <span class="text-xl">-</span>
              </button>
              <span>{{ Math.round(zoom * 100) }}%</span>
              <button @click="increaseZoom" class="p-2 hover:bg-gray-100 rounded">
                <span class="text-xl">+</span>
              </button>
            </div>
            
            <div class="border-l border-gray-200 pl-4 flex space-x-2">
              <button 
                :class="{'bg-blue-100': mode === 'write'}"
                class="px-4 py-2 rounded-lg hover:bg-gray-100"
                @click="mode = 'write'"
              >
                Write Mode
              </button>
              <button 
                :class="{'bg-blue-100': mode === 'present'}"
                class="px-4 py-2 rounded-lg hover:bg-gray-100"
                @click="mode = 'present'"
              >
                Present Mode
              </button>
            </div>
          </div>
        </div>
      </div>      <!-- Writing Tools Bar -->      
      <div class="sticky top-16 z-30 bg-white border-b border-gray-200 p-2">
        <div class="flex flex-wrap items-center gap-2 max-w-7xl mx-auto">
          <!-- Font Controls Group -->
          <div class="flex items-center gap-2 min-w-[200px]">
          <select v-model="settings.fontFamily" class="border rounded px-2 py-1">
            <option value="serif">Serif</option>
            <option value="sans">Sans</option>
            <option value="mono">Mono</option>
          </select>

          <input 
            type="number" 
            v-model="settings.fontSize" 
            min="12" 
            max="24" 
            class="w-16 border rounded px-2 py-1"
          />          <!-- Text Formatting -->
          <div class="flex items-center gap-2 border-l border-gray-200 pl-4 flex-wrap">
            <button 
              @click="toggleBold"
              :class="{'bg-blue-100': settings.isBold}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100 font-bold"
              title="Bold"
            >
              B
            </button>
            <button 
              @click="toggleItalic"
              :class="{'bg-blue-100': settings.isItalic}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100 italic"
              title="Italic"
            >
              I
            </button>
            <button 
              @click="toggleUnderline"
              :class="{'bg-blue-100': settings.isUnderline}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100 underline"
              title="Underline"
            >
              U
            </button>
          </div>          <!-- Color Controls -->
          <div class="flex items-center gap-2 border-l border-gray-200 pl-4 shrink-0">
            <input 
              type="color" 
              v-model="settings.pageColor" 
              class="w-8 h-8 rounded cursor-pointer"
              title="Page Color"
            />
            <input 
              type="color" 
              v-model="settings.textColor" 
              class="w-8 h-8 rounded cursor-pointer"
              title="Text Color"
            />
          </div>          <!-- Text Alignment -->
          <div class="flex flex-wrap gap-2">
            <button 
              @click="changeAlignment('left')"
              :class="{'bg-blue-100': settings.textAlign === 'left'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Left
            </button>
            <button 
              @click="changeAlignment('center')"
              :class="{'bg-blue-100': settings.textAlign === 'center'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Center
            </button>
            <button 
              @click="changeAlignment('right')"
              :class="{'bg-blue-100': settings.textAlign === 'right'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Right
            </button>
            <button 
              @click="changeAlignment('justify')"
              :class="{'bg-blue-100': settings.textAlign === 'justify'}"
              class="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Justify
            </button>
          </div>          <!-- Line Spacing -->
          <div class="flex items-center gap-2 flex-wrap">
            <span>Line Spacing:</span>
            <button 
              @click="changeLineSpacing(1)"
              :class="{'bg-blue-100': settings.lineSpacing === 1}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              1
            </button>
            <button 
              @click="changeLineSpacing(1.15)"
              :class="{'bg-blue-100': settings.lineSpacing === 1.15}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              1.15
            </button>
            <button 
              @click="changeLineSpacing(1.5)"
              :class="{'bg-blue-100': settings.lineSpacing === 1.5}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              1.5
            </button>
            <button 
              @click="changeLineSpacing(2)"
              :class="{'bg-blue-100': settings.lineSpacing === 2}"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
            >
              2
            </button>
          </div>

          <!-- Indentation Controls -->
          <div class="flex items-center space-x-2">
            <button 
              @click="adjustIndent('increase')"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
              title="Increase Indent"
            >
              <span class="text-xl">▶️</span>
            </button>
            <button 
              @click="adjustIndent('decrease')"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
              title="Decrease Indent"
            >
              <span class="text-xl">◀️</span>
            </button>
          </div>

          <!-- List Controls -->
          <div class="flex items-center space-x-2">
            <button 
              @click="insertList('bullet')"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
              title="Insert Bullet List"
            >
              •
            </button>
            <button 
              @click="insertList('number')"
              class="px-2 py-1 rounded-lg hover:bg-gray-100"
              title="Insert Numbered List"
            >
              1.
            </button>
          </div>          <!-- Image Upload -->
          <button 
            @click="triggerImageUpload" 
            class="p-2 hover:bg-gray-100 rounded"
            title="Insert Image"
          >
            <span class="text-xl">📷</span>
          </button>
          <input 
            type="file" 
            ref="imageInput" 
            @change="handleImageUpload" 
            accept="image/*" 
            class="hidden"
          />
        </div>
      </div>

      <!-- Main Writing Area -->
      <div class="max-w-7xl mx-auto p-8">
        <div 
          :class="{
            'grid grid-cols-2 gap-8': layout === 'double',
            'max-w-3xl mx-auto': layout === 'single'
          }"
          :style="{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center'
          }"
        >
          <!-- Page(s) -->
          <div 
            class="bg-white rounded-lg shadow-lg p-8 min-h-[842px] w-full"
            :class="{'aspect-[1/1.414]': true}"
          >
            <textarea
              v-model="content"
              class="w-full h-full resize-none border-none focus:ring-0 font-serif text-lg"
              placeholder="Start writing your story..."
            ></textarea>
          </div>

          <!-- Second page (only shows in double layout) -->
          <div 
            v-if="layout === 'double'"
            class="bg-white rounded-lg shadow-lg p-8 min-h-[842px] w-full aspect-[1/1.414]"
          >
            <textarea
              v-model="contentRight"
              class="w-full h-full resize-none border-none focus:ring-0 font-serif text-lg"
              placeholder="Continue your story..."
            ></textarea>
          </div>
        </div>
      </div>      <!-- Floating Action Buttons -->
      <div class="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        <button 
          @click="saveContent"
          class="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          title="Save"
        >
          <span class="text-xl">💾</span>
        </button>
        <button 
          @click="toggleVoiceInput"
          class="w-12 h-12 rounded-full bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          :class="{'bg-red-100': isRecording}"
          title="Voice Input"
        >
          <span class="text-xl">🎤</span>
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
const layout = ref('single')
const zoom = ref(1)
const mode = ref('write')
const content = ref('')
const contentRight = ref('')

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

// Methods
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

<style scoped>
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