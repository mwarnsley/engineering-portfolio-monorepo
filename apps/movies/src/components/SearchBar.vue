<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <label class="search-bar__label" for="movie-search">Search movies</label>
    <div class="search-bar__controls">
      <input
        id="movie-search"
        v-model="query"
        class="search-bar__input"
        type="search"
        name="movie-search"
        placeholder="Search by title, franchise, or mood"
      />
      <button class="search-bar__button" type="submit">
        Search
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['search']);

const query = ref(props.modelValue);

watch(
  () => props.modelValue,
  value => {
    query.value = value;
  }
);

function handleSubmit() {
  emit('search', query.value);
}
</script>

<style scoped>
.search-bar {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
}

.search-bar__label {
  font-size: 0.95rem;
  color: var(--text-soft);
}

.search-bar__controls {
  display: flex;
  gap: 12px;
}

.search-bar__input {
  flex: 1;
  min-width: 0;
  min-height: 52px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(5, 10, 19, 0.7);
  color: #fff;
}

.search-bar__input:focus {
  outline: 1px solid rgba(255, 177, 92, 0.6);
}

.search-bar__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent) 0%, #f4c15a 100%);
  color: #0c1423;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.search-bar__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(255, 138, 61, 0.25);
}

@media (max-width: 720px) {
  .search-bar {
    border-radius: 24px;
  }

  .search-bar__controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
