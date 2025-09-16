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
        </ul>

        <!-- Right side account -->
        <div class="d-flex gap-2">
          <template v-if="isLoggedIn">
            <span class="badge bg-secondary align-self-center me-2"
              >Role: {{ role || 'unknown' }}</span
            >
            <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'MyAccount' }"
              >My Account</router-link
            >
            <button class="btn btn-outline-danger btn-sm" @click="logout">Log out</button>
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

const router = useRouter()

const isLoggedIn = ref(false)
const userName = ref('')

const role = ref(localStorage.getItem('userRole') || '')
window.addEventListener('auth-changed', () => {
  isLoggedIn.value = !!localStorage.getItem('currentUser')
  role.value = localStorage.getItem('userRole') || ''
})

function readUser() {
  const raw = localStorage.getItem('currentUser')
  if (!raw) {
    isLoggedIn.value = false
    userName.value = ''
    return
  }
  try {
    const u = JSON.parse(raw)
    isLoggedIn.value = !!u?.email
    userName.value = u.displayName || u.email?.split('@')[0] || 'User'
  } catch {
    isLoggedIn.value = false
    userName.value = ''
  }
}

function logout() {
  localStorage.removeItem('currentUser')
  // tell others to refresh
  window.dispatchEvent(new Event('auth-changed'))
  readUser()
  router.push({ name: 'Home' })
}

const onAuthChanged = () => readUser()

onMounted(() => {
  readUser()
  // Receive custom events when logging in/out on the same page
  window.addEventListener('auth-changed', onAuthChanged)
  // Sync across tabs
  window.addEventListener('storage', onAuthChanged)
  // Refresh once when the route is switched
  // to prevent some navigation paths from not receiving events
  router.afterEach(() => readUser())
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', onAuthChanged)
  window.removeEventListener('storage', onAuthChanged)
})
</script>

<style>
body {
  background: #f8fafc;
}
</style>
