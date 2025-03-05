<template>
  <div class="app-container">
    <!-- Список целей -->
    <transition-group name="list" tag="div" class="goals-list">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="goal-item"
        :class="{ completed: goal.completed }"
        @click="openGoalModal(goal)"
      >
        <div class="goal-content">
          <h3>{{ goal.title }}</h3>
          <span v-if="goal.completed" class="completion-date">
            {{ formatDate(goal.dateCompleted) }}
          </span>
        </div>
        <div class="glow"></div>
      </div>
    </transition-group>

    <!-- Кнопка добавления -->
    <button class="add-button" @click="openAddModal">+</button>

    <!-- Модальное окно добавления -->
    <transition name="modal">
      <div v-if="showAddModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Новая цель</h2>
          <input
            v-model="newGoalTitle"
            placeholder="Введите цель"
            @keyup.enter="addGoal"
          />
          <div class="modal-actions">
            <button
              @click="addGoal"
              :disabled="!newGoalTitle"
              class="action-button"
            >
              Добавить
            </button>
            <button @click="closeAddModal" class="cancel-button">Отмена</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Модальное окно выполнения -->
    <transition name="modal">
      <div v-if="selectedGoal" class="modal-overlay">
        <div class="modal-content">
          <h2>{{ selectedGoal.title }}</h2>
          <textarea
            v-model="completionThoughts"
            placeholder="Ваши мысли при выполнении..."
            rows="4"
          ></textarea>
          <div class="modal-actions">
            <button
              v-if="!selectedGoal.completed"
              @click="completeGoal"
              :disabled="!completionThoughts"
              class="action-button"
            >
              Выполнить
            </button>
            <button @click="closeCompletionModal" class="cancel-button">
              {{ selectedGoal.completed ? "Закрыть" : "Отмена" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";

const goals = ref([]);
const newGoalTitle = ref("");
const showAddModal = ref(false);
const selectedGoal = ref(null);
const completionThoughts = ref("");

// Загрузка целей при загрузке компонента
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newGoalTitle.value.trim(),
      }),
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
        headers: {
          "Content-Type": "application/json",
        },
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

/* Стили кнопки добавления */
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

/* Стили карточек целей */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  margin-top: 10rem;
}

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

/* Модальные окна */
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

/* Общие стили элементов */
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

input,
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

input:focus,
textarea:focus {
  outline: none;
  border-color: #ff9500;
  box-shadow: 0 0 8px rgba(255, 149, 0, 0.3);
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
</style>
