<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Contribute to the Community</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-4">
        <textarea
          v-model="content"
          class="w-full border rounded p-2 h-32"
          placeholder="Write a tip to overcome writer's block..."
        ></textarea>
        <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          @click="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="isSubmitting || !content.trim()"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase/config';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'submitted']);

const content = ref('');
const isSubmitting = ref(false);
const error = ref('');

const submit = async () => {
  if (!content.value.trim()) return;
  
  isSubmitting.value = true;
  error.value = '';

  try {
    await addDoc(collection(db, 'tips'), {
      content: content.value.trim(),
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    });
    
    content.value = '';
    emit('submitted');
    emit('close');
  } catch (err) {
    console.error('Error submitting tip:', err);
    error.value = 'Failed to submit tip. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
