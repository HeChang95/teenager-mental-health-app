<!-- Rating Component-->
<template>
  <div>
    <h5>Rate this tool</h5>
    <select v-model="rating" class="form-select w-auto">
      <option disabled value="">Select rating</option>
      <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
    </select>
    <button class="btn btn-sm btn-primary ms-2" @click="submit">Submit</button>
    <p class="mt-2">Average score: {{ average.toFixed(1) }} ({{ ratings.length }} votes)</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const key = 'ratings:practice-tools'
const ratings = ref(JSON.parse(localStorage.getItem(key) || '[]'))
const rating = ref('')

function submit() {
  if (!rating.value) return
  ratings.value.push(Number(rating.value))
  localStorage.setItem(key, JSON.stringify(ratings.value))
  rating.value = ''
}
const average = computed(() =>
  ratings.value.length ? ratings.value.reduce((a, b) => a + b, 0) / ratings.value.length : 0,
)
</script>
