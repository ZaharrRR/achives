<template>
  <div class="app-container">
    <GoalsList :goals="goals" @goal-clicked="openGoalModal" />

    <button class="add-button" @click="openAddModal">+</button>

    <AddGoalModal
      v-if="showAddModal"
      :new-goal-title="newGoalTitle"
      @update:new-goal-title="(val) => (newGoalTitle = val)"
      @add-goal="addGoal"
      @close="closeAddModal"
    />

    <CompleteGoalModal
      v-if="selectedGoal"
      :goal="selectedGoal"
      :completion-thoughts="completionThoughts"
      @update:completion-thoughts="(val) => (completionThoughts = val)"
      @complete-goal="completeGoal"
      @close="closeCompletionModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import GoalsList from "./components/GoalsList.vue";
import AddGoalModal from "./components/AddGoalModal.vue";
import CompleteGoalModal from "./components/CompleteGoalModal.vue";
import { format } from "date-fns";

const goals = ref([]);
const newGoalTitle = ref("");
const showAddModal = ref(false);
const selectedGoal = ref(null);
const completionThoughts = ref("");

onMounted(async () => {
  try {
    const response = await fetch("http://localhost:3001/goals");
    if (!response.ok) throw new Error("Ошибка загрузки целей");
    goals.value = await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось загрузить цели");
  }
});

const openAddModal = () => {
  showAddModal.value = true;
};
const closeAddModal = () => {
  showAddModal.value = false;
  newGoalTitle.value = "";
};

const addGoal = async () => {
  if (!newGoalTitle.value.trim()) return;
  try {
    const response = await fetch("http://localhost:3001/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newGoalTitle.value.trim() }),
    });
    if (!response.ok) throw new Error("Ошибка создания цели");
    const newGoal = await response.json();
    goals.value.push(newGoal);
    closeAddModal();
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось создать цель");
  }
};

const openGoalModal = (goal) => {
  selectedGoal.value = goal;
  completionThoughts.value = goal.completed ? goal.thoughts : "";
};

const completeGoal = async () => {
  if (!completionThoughts.value.trim()) return;
  try {
    const response = await fetch(
      `http://localhost:3001/goals/${selectedGoal.value.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: true,
          thoughts: completionThoughts.value.trim(),
          dateCompleted: new Date(),
        }),
      }
    );
    if (!response.ok) throw new Error("Ошибка обновления цели");
    const updatedGoal = await response.json();
    const index = goals.value.findIndex((g) => g.id === updatedGoal.id);
    goals.value[index] = updatedGoal;
    closeCompletionModal();
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось завершить цель");
  }
};

const closeCompletionModal = () => {
  selectedGoal.value = null;
  completionThoughts.value = "";
};

const formatDate = (date) => {
  return date ? format(new Date(date), "dd.MM.yyyy HH:mm") : "";
};
</script>

<style>
/* Global styles remain here */
body {
  background: #0a0a0a;
  color: #fff;
  font-family: "Segoe UI", sans-serif;
  margin: 0;
  min-height: 100vh;
}

.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.8rem;
  background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
  color: #555;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.add-button:hover {
  background: linear-gradient(145deg, #ff9500, #ffaa00);
  color: #fff;
  transform: scale(1.1) rotate(180deg);
  box-shadow: 0 0 25px rgba(255, 149, 0, 0.4);
}

/* Анимации */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-button {
  background: linear-gradient(145deg, #ff9500, #da6d00);
  color: white;
}

.cancel-button {
  background: linear-gradient(145deg, #404040, #2d2d2d);
  color: #999;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
