<template>
  <section class="card mb-4">
    <div class="card-body">
      <h5 class="card-title">Today’s Weather & Study Tips</h5>
      <p class="text-muted">Study / exam / health tips generated from local weather.</p>

      <div class="d-flex gap-2 align-items-end mb-3">
        <div>
          <label class="form-label">City</label>
          <input
            v-model="city"
            type="text"
            class="form-control"
            placeholder="Enter city, e.g., Melbourne"
          />
        </div>

        <button class="btn btn-primary" @click="fetchBrief" :disabled="loading">
          {{ loading ? 'Checking...' : 'Check' }}
        </button>

        <button v-if="savedCity" class="btn btn-outline-secondary" @click="useSavedCity">
          Use my saved city
        </button>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="brief" class="row">
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li><strong>City:</strong> {{ brief.city || city }}</li>
            <li><strong>Desc:</strong> {{ brief.desc }}</li>
            <li><strong>Temp:</strong> {{ brief.temp }} °C</li>
            <li><strong>Wind:</strong> {{ brief.wind }} m/s</li>
            <li v-if="brief.humidity !== null"><strong>Humidity:</strong> {{ brief.humidity }}%</li>
          </ul>
        </div>

        <div class="col-md-6">
          <div class="mb-2">
            <strong>Risks:</strong>
            <span v-if="!brief.risks || !brief.risks.length" class="text-muted">None</span>
            <span v-for="r in brief.risks" :key="r" class="badge bg-warning text-dark me-2">{{
              r
            }}</span>
          </div>

          <div>
            <strong>Advice:</strong>
            <ul class="mb-0">
              <li v-for="(a, i) in brief.advice" :key="i">{{ a }}</li>
              <li v-if="!brief.advice || !brief.advice.length" class="text-muted">
                No special advice today.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// city input & saved city
const city = ref('Melbourne')
const savedCity = ref(localStorage.getItem('preferredCity') || '')

const loading = ref(false)
const error = ref('')
const brief = ref(null)

// Cloud Functions endpoint
function endpoint() {
  return `${window.FUNCTIONS_BASE_URL}/weatherBrief`
}

async function fetchBrief() {
  loading.value = true
  error.value = ''
  brief.value = null
  try {
    const { data } = await axios.get(endpoint(), {
      params: { city: city.value.trim() },
    })
    brief.value = data
  } catch (e) {
    console.error('Error fetching weather brief:', e)
    error.value = 'Failed to fetch weather advice.'
  } finally {
    loading.value = false
  }
}

function useSavedCity() {
  if (savedCity.value) {
    city.value = savedCity.value
    fetchBrief()
  }
}

onMounted(() => {
  if (savedCity.value) {
    city.value = savedCity.value
    fetchBrief()
  }
})
</script>
