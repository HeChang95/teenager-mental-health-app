<template>
  <div>
    <!-- Top navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold" :to="{ name: 'Home' }">Teen Health</router-link>

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'ForStudents' }">For Students</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'ForParents' }">For Parents</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'ForEducators' }">For Educators</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'NewsUpdates' }">News & Updates</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Resources' }">Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'AboutUs' }">About Us</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'ResourcesTable' }"
              >Resource Table</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'StudyTasks' }">My Tasks</router-link>
          </li>
        </ul>

        <!-- Right side account -->
        <div class="d-flex gap-2">
          <template v-if="isLoggedIn">
            <span class="badge bg-primary align-self-center me-2"> My TODOs: {{ myTodo }} </span>

            <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'MyAccount' }"
              >My Account</router-link
            >
            <button class="btn btn-outline-danger btn-sm" @click="logout" :disabled="loggingOut">
              Log out
            </button>
          </template>
          <template v-else>
            <router-link class="btn btn-outline-primary btn-sm" :to="{ name: 'Login' }"
              >Log in</router-link
            >
            <router-link class="btn btn-primary btn-sm" :to="{ name: 'SignUp' }"
              >Sign up</router-link
            >
          </template>
        </div>
      </div>
    </nav>

    <!-- routed content -->
    <main class="container my-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()

//  Auth state
const isLoggedIn = ref(false)
const userName = ref('')
const role = ref(localStorage.getItem('userRole') || '') // student, parent, educator
const loggingOut = ref(false)
//My TODOs count (localStorage + events)
const myTodo = ref(0)

function readTodos() {
  try {
    const raw = localStorage.getItem('todos')
    const list = raw ? JSON.parse(raw) : []
    myTodo.value = Array.isArray(list) ? list.length : 0
  } catch {
    myTodo.value = 0
  }
}

const onTodosChanged = () => readTodos()

// read user & todos from localStorage
function readUserFromStorage() {
  const raw = localStorage.getItem('currentUser')
  if (!raw) {
    isLoggedIn.value = false
    userName.value = ''
    return
  }
  try {
    const u = JSON.parse(raw)
    isLoggedIn.value = !!u?.email
    userName.value = u.displayName || (u.email ? u.email.split('@')[0] : 'User')
  } catch {
    isLoggedIn.value = false
    userName.value = ''
  }
}

const onAuthChanged = () => {
  readUserFromStorage()
  role.value = localStorage.getItem('userRole') || ''
  readTodos()
}

//  Synchronize user state to local storage and reactive variables
function syncUser(u) {
  if (u) {
    const lite = { uid: u.uid, email: u.email, displayName: u.displayName || '' }
    localStorage.setItem('currentUser', JSON.stringify(lite))
    localStorage.setItem('__cached_auth_user__', JSON.stringify(lite))
    isLoggedIn.value = true
    userName.value = lite.displayName || (lite.email ? lite.email.split('@')[0] : 'User')
  } else {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('__cached_auth_user__')
    isLoggedIn.value = false
    userName.value = ''
  }
  window.dispatchEvent(new Event('auth-changed'))
}

// Listen to storage events to update role across tabs
function onStorage(e) {
  if (e.key === 'userRole') {
    role.value = localStorage.getItem('userRole') || ''
  }
  if (e.key === 'currentUser') {
    readUserFromStorage()
  }
  if (e.key === 'todos' || e.key === null) {
    readTodos()
  }
}

let un // unsubscribe function

onMounted(() => {
  // Firebase auth listener
  un = onAuthStateChanged(auth, (u) => {
    try {
      syncUser(u)
    } catch (err) {
      console.error('Error syncing auth state:', err)
    }
  })

  readUserFromStorage()
  role.value = localStorage.getItem('userRole') || ''
  readTodos()

  window.addEventListener('auth-changed', onAuthChanged)
  window.addEventListener('todos-changed', onTodosChanged)

  //  Listen to storage events to update role across tabs
  window.addEventListener('storage', onStorage)

  // 5) On each route change, read user & role from localStorage
  router.afterEach(() => {
    readUserFromStorage()
    role.value = localStorage.getItem('userRole') || ''
    readTodos()
  })
})

onBeforeUnmount(() => {
  if (un) un()
  window.removeEventListener('auth-changed', onAuthChanged)
  window.removeEventListener('todos-changed', onTodosChanged)
  window.removeEventListener('storage', onStorage)
})

// Log out function
async function logout() {
  loggingOut.value = true
  try {
    await signOut(auth)
  } catch (e) {
    console.error('Error logging out:', e)
  } finally {
    loggingOut.value = false
    router.push({ name: 'Home' })
  }
}
</script>

<style>
body {
  background: #f8fafc;
}
</style>
