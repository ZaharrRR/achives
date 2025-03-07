<template>
  <div
    class="goal-item"
    :class="{ completed: goal.completed }"
    @click="$emit('click')"
  >
    <div class="goal-content">
      <h3>{{ goal.title }}</h3>
      <span v-if="goal.completed" class="completion-date">
        {{ formatDate(goal.dateCompleted) }}
      </span>
    </div>
    <div class="glow"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { format } from "date-fns";

defineProps({
  goal: {
    type: Object,
    required: true,
  },
});

const formatDate = (date) => {
  return date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "";
};
</script>

<style scoped>
.goal-item {
  position: relative;
  width: 200px;
  margin: 0 auto;
  background: linear-gradient(145deg, #252525, #1a1a1a);
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.goal-item.completed {
  background: linear-gradient(145deg, #ff8a00, #da6d00);
  box-shadow: 0 0 15px rgba(255, 138, 0, 0.3);
  animation: pulse-glow 2s infinite;
}

.glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.goal-item:hover .glow {
  left: 100%;
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 10px rgba(255, 138, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 138, 0, 0.6);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 138, 0, 0.3);
  }
}

.completion-date {
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
