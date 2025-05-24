<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <div class="border-b border-gray-200 p-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// State
const layout = ref('single')
const zoom = ref(1)
const mode = ref('write')
const content = ref('')
const contentRight = ref('')

// Zoom controls
const decreaseZoom = () => {
  if (zoom.value > 0.5) zoom.value -= 0.1
}

const increaseZoom = () => {
  if (zoom.value < 2) zoom.value += 0.1
}
</script>

<style scoped>
textarea {
  background: linear-gradient(to bottom, transparent 0%, transparent 97%, #e5e7eb 97%, #e5e7eb 100%);
  background-size: 100% 1.75rem;
  line-height: 1.75rem;
}
</style>