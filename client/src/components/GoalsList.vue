<template>
  <transition-group name="list" tag="div" class="goals-list">
    <GoalItem
      v-for="goal in goals"
      :key="goal.id"
      :goal="goal"
      @click="$emit('goal-clicked', goal)"
    />
  </transition-group>
</template>

<script setup>
import GoalItem from "./GoalItem.vue";

defineProps({
  goals: {
    type: Array,
    required: true,
  },
});

defineEmits(["goal-clicked"]);
</script>

<style scoped>
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  margin-top: 10rem;
}
</style>
