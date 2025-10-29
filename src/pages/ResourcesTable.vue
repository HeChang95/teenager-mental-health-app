<template>
  <div>
    <h2 class="mb-3">Resources</h2>
    <p class="text-muted">Searchable resource library by topic / audience / type.</p>

    <div class="mb-3">
      <span class="badge bg-secondary me-2">Total (by topic): {{ totalCount }}</span>

      <label class="me-2">Topic</label>
      <select
        class="form-select d-inline-block w-auto"
        v-model="topicFilter"
        @change="refreshCount"
      >
        <option value="">All</option>
        <option value="anxiety">anxiety</option>
        <option value="stress">stress</option>
        <option value="sleep">sleep</option>
      </select>
    </div>

    <div class="table-responsive">
      <table id="resTable" class="table table-striped" style="width: 100%">
        <thead>
          <tr>
            <th>
              Title<br /><input class="form-control form-control-sm" placeholder="Search title" />
            </th>
            <th>
              Topic<br /><input class="form-control form-control-sm" placeholder="Search topic" />
            </th>
            <th>
              Audience<br /><input
                class="form-control form-control-sm"
                placeholder="Search audience"
              />
            </th>
            <th>
              Type<br /><input class="form-control form-control-sm" placeholder="Search type" />
            </th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.title }}</td>
            <td>{{ r.topic }}</td>
            <td>{{ r.audience }}</td>
            <td>{{ r.type }}</td>
            <td><a :href="r.url" target="_blank" rel="noopener">Open</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
// Vue page showing a Firestore-backed resource library with DataTables.
import { ref, onMounted, nextTick, watch } from 'vue'
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import axios from 'axios'

const db = getFirestore()
const rows = ref([])
const topicFilter = ref('')
const totalCount = ref(0)
const error = ref('')
let dt = null

function functionsBase() {
  // Return Cloud Functions base URL for dev/prod.
  const dev = import.meta.env.DEV
  return dev
    ? 'http://127.0.0.1:5001/teenager-mental-health-app/us-central1'
    : 'https://us-central1-teenager-mental-health-app.cloudfunctions.net'
}

async function refreshCount() {
  // Call countResources to update the badge total by topic
  try {
    const url = `${functionsBase()}/countResources`
    const { data } = await axios.get(url, { params: { topic: topicFilter.value || '' } })
    totalCount.value = data.count ?? 0
  } catch (e) {
    console.error('Error counting resources:', e)
  }
}

async function loadData() {
  //EN: Load up to 200 newest resources from Firestore
  error.value = ''
  rows.value = []
  try {
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(200))
    const snap = await getDocs(q)
    rows.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    await nextTick()
    initDataTable()
  } catch (e) {
    console.error('Error loading resources:', e)
    error.value = 'Failed to load resources.'
  }
}

function initDataTable() {
  // Initialize DataTables and wire column-wise search
  if (dt && dt.destroy) dt.destroy()
  // eslint-disable-next-line no-undef
  dt = new DataTable('#resTable', {
    pageLength: 10,
    order: [], // no default ordering
  })
  const header = document.querySelectorAll('#resTable thead th')
  header.forEach((th, idx) => {
    const input = th.querySelector('input')
    if (!input) return
    input.addEventListener('keyup', () => dt.column(idx).search(input.value).draw())
  })
}

onMounted(async () => {
  await loadData()
  await refreshCount()
})

watch(topicFilter, refreshCount)
</script>
