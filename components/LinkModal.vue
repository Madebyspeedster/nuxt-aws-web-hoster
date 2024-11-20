<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <ConfettiExplosion
      style="position: absolute"
      :particleCount="200"
      :force="0.7"
      :duration="2500"
      :stageHeight="300"
      :stageWidth="800"
    />

    <div class="modal">
      <h2 class="modal-title">Your Link is ready 🚀</h2>
      <p class="modal-link">
        <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
      </p>
      <div class="modal-actions">
        <button @click="closeModal" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import ConfettiExplosion from "vue-confetti-explosion";

defineProps({
  link: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--animated-line-stroke);
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.modal-link {
  margin: 20px 0;
  word-break: break-all;
}

.modal-link a {
  color: blue;
  text-decoration: underline;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-close {
  background-color: var(--line-stroke);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.9;
}
</style>
