<template>
  <div class="container py-4">
    <h1 class="mb-3">Wellness Check</h1>

    <!-- form -->
    <form @submit.prevent="submit">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Mood (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            class="form-control"
            v-model.number="form.mood"
            @blur="validate('mood')"
          />
          <div v-if="errors.mood" class="text-danger mt-1">{{ errors.mood }}</div>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Stress (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            class="form-control"
            v-model.number="form.stress"
            @blur="validate('stress')"
          />
          <div v-if="errors.stress" class="text-danger mt-1">{{ errors.stress }}</div>
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Sleep Hours (0–14)</label>
          <input
            type="number"
            min="0"
            max="14"
            step="0.5"
            class="form-control"
            v-model.number="form.sleep"
            @blur="validate('sleep')"
          />
          <div v-if="errors.sleep" class="text-danger mt-1">{{ errors.sleep }}</div>
        </div>

        <div class="col-12">
          <label class="form-label">Notes (optional)</label>
          <textarea
            class="form-control"
            rows="3"
            v-model.trim="form.notes"
            @input="validate('notes')"
          ></textarea>
          <div v-if="errors.notes" class="text-danger mt-1">{{ errors.notes }}</div>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary me-2" type="submit">Save Check</button>
        <button class="btn btn-secondary" type="button" @click="reset">Clear</button>
      </div>
    </form>

    <!-- history table -->
    <div class="mt-5" v-if="entries.length">
      <h2 class="h5 mb-3">History</h2>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Mood</th>
              <th>Stress</th>
              <th>Sleep</th>
              <th>Score</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, i) in entries" :key="i">
              <td>{{ formatDate(e.date) }}</td>
              <td>{{ e.mood }}</td>
              <td>{{ e.stress }}</td>
              <td>{{ e.sleep }}</td>
              <td>{{ e.score }}</td>
              <td>{{ e.notes || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-outline-danger btn-sm" @click="clearAll()">Clear All</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useWellness } from '@/stores/wellness'

const { entries, addEntry, clearAll } = useWellness()

const form = reactive({
  mood: null,
  stress: null,
  sleep: null,
  notes: '',
})

const errors = reactive({
  mood: null,
  stress: null,
  sleep: null,
  notes: null,
})

function validate(field) {
  if (field === 'mood') {
    errors.mood = form.mood >= 1 && form.mood <= 5 ? null : 'Mood must be 1–5'
  }
  if (field === 'stress') {
    errors.stress = form.stress >= 1 && form.stress <= 10 ? null : 'Stress must be 1–10'
  }
  if (field === 'sleep') {
    errors.sleep = form.sleep >= 0 && form.sleep <= 14 ? null : 'Sleep must be 0–14 hours'
  }
  if (field === 'notes') {
    errors.notes = form.notes.length > 280 ? 'Notes up to 280 chars' : null
  }
}

function allValid() {
  ;['mood', 'stress', 'sleep', 'notes'].forEach(validate)
  return !errors.mood && !errors.stress && !errors.sleep && !errors.notes
}

function computeScore() {
  // simple score: higher mood, lower stress, adequate sleep
  const moodPart = form.mood * 10 // 10–50
  const stressPart = (10 - form.stress) * 5 // 0–45
  const sleepDiff = Math.abs(form.sleep - 8)
  const sleepPart = Math.max(0, 30 - sleepDiff * 6) // 0–30
  return moodPart + stressPart + sleepPart // 0–125
}

function submit() {
  if (!allValid()) return

  addEntry({
    date: new Date().toISOString(),
    mood: form.mood,
    stress: form.stress,
    sleep: form.sleep,
    notes: form.notes,
    score: computeScore(),
  })

  reset()
}

function reset() {
  form.mood = null
  form.stress = null
  form.sleep = null
  form.notes = ''
}

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}
</script>
