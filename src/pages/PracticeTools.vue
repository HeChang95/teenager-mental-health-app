<template>
  <div class="container py-4">
    <h1 class="mb-3">Practice Tools</h1>
    <p class="text-muted">
      Quick access to anxiety management tools. Use these exercises regularly to build healthy
      habits.
    </p>

    <!-- Latest wellness summary -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title mb-3">Latest Wellness Check</h5>

            <div v-if="latestEntry">
              <p class="mb-1"><strong>Date:</strong> {{ formatDate(latestEntry.date) }}</p>
              <p class="mb-1"><strong>Mood:</strong> {{ latestEntry.mood }}</p>
              <p class="mb-1"><strong>Stress:</strong> {{ latestEntry.stress }}</p>
              <p class="mb-1"><strong>Sleep:</strong> {{ latestEntry.sleep }} h</p>
              <p class="mb-0"><strong>Score:</strong> {{ latestEntry.score }}</p>

              <RouterLink
                class="btn btn-outline-primary btn-sm mt-3"
                :to="{ name: 'WellnessCheck' }"
              >
                Do a new check
              </RouterLink>
            </div>

            <div v-else class="text-muted">
              No wellness check yet.
              <RouterLink class="btn btn-primary btn-sm ms-2" :to="{ name: 'WellnessCheck' }">
                Start now
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- tiny quick tool (optional) -->
      <div class="col-12 col-lg-5">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-3">60s Breathing Exercise</h5>
            <p class="text-muted">
              Breathe in for 4s, hold 4s, out for 4s. Repeat slowly for one minute.
            </p>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-secondary" @click="startBreathing" :disabled="running">
                {{ running ? 'Running...' : 'Start 60s' }}
              </button>
              <span class="fw-semibold">{{ secondsLeft }}s</span>
            </div>
            <div class="progress mt-3" role="progressbar" aria-label="timer">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <small class="text-muted mt-2">
              This is a simple, local-only timer to help you begin.
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Tool cards -->
    <h2 class="h5 mb-3">Tools</h2>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <!-- Wellness Check -->
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Wellness Check</h5>
            <p class="card-text flex-grow-1">
              Track your mood, stress and sleep. Results are saved locally and appear in My Account.
            </p>
            <RouterLink class="btn btn-primary" :to="{ name: 'WellnessCheck' }">Open</RouterLink>
          </div>
        </div>
      </div>

      <!-- Breathing Exercise (placeholder page) -->
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Breathing Exercise</h5>
            <p class="card-text flex-grow-1">
              Follow guided breathing patterns to calm anxiety and refocus.
            </p>
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'BreathingExercise' }">
              Open
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Muscle Relaxation (placeholder page) -->
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Muscle Relaxation</h5>
            <p class="card-text flex-grow-1">
              Progressive muscle relaxation steps to reduce physical tension.
            </p>
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'MuscleRelaxation' }">
              Open
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Mindfulness Timer (placeholder page) -->
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Mindfulness Timer</h5>
            <p class="card-text flex-grow-1">
              Set a short timer and practice being present with your breath and body.
            </p>
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'MindfulnessTimer' }">
              Open
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Personal Toolkit (placeholder page) -->
      <div class="col">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Personal Toolkit</h5>
            <p class="card-text flex-grow-1">
              Save your favourite tools or notes for quick access (future feature).
            </p>
            <RouterLink class="btn btn-outline-secondary" :to="{ name: 'PersonalToolkit' }">
              Open
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onUnmounted } from 'vue'
import { useWellness } from '@/stores/wellness'

const { latest } = useWellness()
const latestEntry = latest()

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

/* mini breathing timer */
const totalSeconds = 60
const secondsLeft = ref(totalSeconds)
const running = ref(false)
let timer = null

const progress = computed(() => {
  const finished = totalSeconds - secondsLeft.value
  return (finished / totalSeconds) * 100
})

function startBreathing() {
  if (running.value) return
  running.value = true
  secondsLeft.value = totalSeconds
  timer = setInterval(() => {
    secondsLeft.value -= 1
    if (secondsLeft.value <= 0) {
      clearInterval(timer)
      running.value = false
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* optional styles */
</style>
