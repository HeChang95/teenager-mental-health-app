<template>
  <div>
    <h2 class="mb-3">Study Tasks</h2>
    <p class="text-muted">
      Supports searching by subject/grade/status, with pagination of 10 rows.
    </p>

    <div class="mb-3">
      <span class="badge bg-secondary me-2">My TODOs: {{ myTodoCount }}</span>
      <select
        class="form-select d-inline-block w-auto me-2"
        v-model="statusFilter"
        @change="refreshMyTodo"
      >
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>
    </div>

    <div class="table-responsive">
      <table id="taskTable" class="table table-striped" style="width: 100%">
        <thead>
          <tr>
            <th>
              Subject<br /><input
                class="form-control form-control-sm"
                placeholder="Search subject"
              />
            </th>
            <th>
              Grade<br /><input class="form-control form-control-sm" placeholder="Search grade" />
            </th>
            <th>
              Title<br /><input class="form-control form-control-sm" placeholder="Search title" />
            </th>
            <th>
              Due<br /><input class="form-control form-control-sm" placeholder="YYYY-MM-DD" />
            </th>
            <th>
              Status<br /><input
                class="form-control form-control-sm"
                placeholder="todo/doing/done"
              />
            </th>
            <th>Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="t.id">
            <td>{{ t.subject }}</td>
            <td>{{ t.grade }}</td>
            <td>{{ t.title }}</td>
            <td>{{ fmtDate(t.dueDate) }}</td>
            <td>
              <span class="badge" :class="badge(t.status)">{{ t.status }}</span>
            </td>
            <td>{{ t.estimateMin }} min</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { getFirestore, collection, query, orderBy, where, limit, getDocs } from 'firebase/firestore'
import axios from 'axios'

const db = getFirestore()
const rows = ref([])
const error = ref('')
const statusFilter = ref('todo')
const myTodoCount = ref(0)
let dt = null

function currentUid() {
  try {
    const raw = localStorage.getItem('currentUser')
    const u = raw ? JSON.parse(raw) : null
    return u?.uid || ''
  } catch {
    return ''
  }
}

function functionsBase() {
  const dev = import.meta.env.DEV
  return dev
    ? 'http://127.0.0.1:5001/teenager-mental-health-app/us-central1'
    : 'https://us-central1-teenager-mental-health-app.cloudfunctions.net'
}

async function refreshMyTodo() {
  try {
    const url = `${functionsBase()}/countTasks`
    const { data } = await axios.get(url, {
      params: { status: statusFilter.value, owner: currentUid() },
    })
    myTodoCount.value = data.count ?? 0
  } catch (e) {
    console.error('Error counting tasks:', e)
  }
}

async function loadData() {
  error.value = ''
  rows.value = []
  try {
    const base = collection(db, 'study_tasks')
    const q = query(
      base,
      where('ownerUid', '==', currentUid()),
      orderBy('dueDate', 'desc'),
      limit(200),
    )
    const snap = await getDocs(q)
    rows.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    await nextTick()
    initDataTable()
  } catch (e) {
    console.error('Error loading tasks:', e)
    error.value = 'Failed to load tasks.'
  }
}

function initDataTable() {
  if (dt && dt.destroy) dt.destroy()
  // eslint-disable-next-line no-undef
  dt = new DataTable('#taskTable', {
    pageLength: 10,
    order: [],
  })
  // Wire column-wise search
  const header = document.querySelectorAll('#taskTable thead th')
  header.forEach((th, idx) => {
    const input = th.querySelector('input')
    if (!input) return
    input.addEventListener('keyup', () => dt.column(idx).search(input.value).draw())
  })
}

function fmtDate(ts) {
  if (!ts) return ''
  try {
    const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

function badge(s) {
  return s === 'done' ? 'bg-success' : s === 'doing' ? 'bg-warning text-dark' : 'bg-secondary'
}

onMounted(async () => {
  await loadData()
  await refreshMyTodo()
})
</script>
