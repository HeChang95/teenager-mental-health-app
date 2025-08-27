// simple reactive store synced with localStorage
import { ref, watch } from 'vue'

const STORAGE_KEY = 'wellness:entries'

const entries = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

watch(entries, (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)), { deep: true })

function addEntry(entry) {
  entries.value.unshift(entry)
}

function clearAll() {
  entries.value = []
}

function latest() {
  return entries.value[0] || null
}

export function useWellness() {
  return { entries, addEntry, clearAll, latest }
}
