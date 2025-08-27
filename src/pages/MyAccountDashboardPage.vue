<template>
  <div class="container py-4">
    <h1>My Dashboard</h1>

    <div v-if="latestEntry">
      <h5 class="mt-4">Latest Wellness Check</h5>
      <p><strong>Date:</strong> {{ formatDate(latestEntry.date) }}</p>
      <p><strong>Mood:</strong> {{ latestEntry.mood }}</p>
      <p><strong>Stress:</strong> {{ latestEntry.stress }}</p>
      <p><strong>Sleep:</strong> {{ latestEntry.sleep }} h</p>
      <p><strong>Score:</strong> {{ latestEntry.score }}</p>
    </div>

    <div v-else class="text-muted">No wellness check yet.</div>
  </div>
</template>

<script setup>
import { useWellness } from '@/stores/wellness'

const { latest } = useWellness()
const latestEntry = latest()

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}
</script>
