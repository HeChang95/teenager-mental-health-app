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
            <span class="badge bg-secondary align-self-center me-2"
              >Role: {{ role || 'unknown' }}</span
            >
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
const role = ref(localStorage.getItem('userRole') || '') // 角色仍按你的实现从本地存储读取
const loggingOut = ref(false)

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
}

let un // unsubscribe function
onMounted(() => {
  un = onAuthStateChanged(auth, (u) => {
    try {
      syncUser(u)
    } catch (err) {
      console.error('Error syncing auth state:', err)
    }
  })
  window.addEventListener('storage', onStorage)
})

onBeforeUnmount(() => {
  if (un) un()
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
