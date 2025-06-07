<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Contribute to the Community</h3>
            <button @click="$emit('close')" class="close-button">&times;</button>
          </div>
          
          <div class="modal-body">
            <textarea
              v-model="tipContent"
              placeholder="Write a tip to overcome writer's block..."
              class="tip-textarea"
            ></textarea>
            <p v-if="error" class="error-message">{{ error }}</p>
          </div>
          
          <div class="modal-footer">
            <button @click="$emit('close')" class="cancel-button">Cancel</button>
            <button 
              @click="submitTip" 
              :disabled="!tipContent.trim() || isSubmitting"
              class="submit-button"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import useAuth from '../composables/useAuth';

export default {
  name: 'TipModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close', 'submitted'],
  setup(props, { emit }) {
    const { account } = useAuth();
    const tipContent = ref('');
    const isSubmitting = ref(false);
    const error = ref('');

    const submitTip = async () => {
      if (!tipContent.value.trim()) return;
      
      isSubmitting.value = true;
      error.value = '';

      try {
        await addDoc(collection(db, 'tips'), {
          tipContent: tipContent.value.trim(),
          tipWriter: account.value?.username || 'Anonymous',
          createdAt: serverTimestamp()
        });
        
        tipContent.value = '';
        emit('submitted');
        emit('close');
      } catch (err) {
        console.error('Error submitting tip:', err);
        error.value = 'Failed to submit tip. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      tipContent,
      isSubmitting,
      error,
      submitTip
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  color: #E9184C;
  font-size: 1.5rem;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.tip-textarea {
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button,
.submit-button {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background: #f0f0f0;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.submit-button {
  background: #E9184C;
  color: white;
  border: none;
}

.submit-button:disabled {
  background: #f8a5c2;
  cursor: not-allowed;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
