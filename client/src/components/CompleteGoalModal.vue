<template>
  <transition name="modal">
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>{{ goal.title }}</h2>
        <textarea
          :value="completionThoughts"
          @input="$emit('update:completion-thoughts', $event.target.value)"
          placeholder="Ваши мысли при выполнении..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button
            v-if="!goal.completed"
            @click="$emit('complete-goal')"
            :disabled="!completionThoughts"
            class="action-button"
          >
            Выполнить
          </button>
          <button @click="$emit('close')" class="cancel-button">
            {{ goal.completed ? "Закрыть" : "Отмена" }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  goal: {
    type: Object,
    required: true,
  },
  completionThoughts: {
    type: String,
    required: true,
  },
});

defineEmits(["update:completion-thoughts", "complete-goal", "close"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: linear-gradient(145deg, #252525, #1a1a1a);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

textarea {
  width: 90%;
  padding: 0.8rem;
  margin: 1rem 0;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
}

textarea:focus {
  outline: none;
  border-color: #ff9500;
  box-shadow: 0 0 8px rgba(255, 149, 0, 0.3);
}
</style>
