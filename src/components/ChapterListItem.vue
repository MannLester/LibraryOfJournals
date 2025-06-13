<template>
  <div class="chapter-item" :class="{ active: isActive }">
    <span class="chapter-icon">📄</span>
    <div class="chapter-details">
      <p class="chapter-title">{{ title }}</p>
      <p class="chapter-meta">Click to edit</p>
    </div>
    <button v-if="!isFirstChapter" class="delete-btn" @click.stop="$emit('delete')" title="Delete chapter">
      <span class="trash-icon">🗑️</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isFirstChapter: {
    type: Boolean,
    default: false
  }
});

defineEmits(['delete']);
</script>

<style scoped>
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

.delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(233, 24, 76, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;
  flex-shrink: 0;
}

.chapter-item:hover .delete-btn {
  background: rgba(233, 24, 76, 0.2);
}

.delete-btn:hover {
  background: rgba(233, 24, 76, 0.2);
}

.trash-icon {
  color: #E9184C;
  font-size: 1rem;
}
</style>