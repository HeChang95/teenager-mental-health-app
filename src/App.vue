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
            <router-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'MyAccount' }">
              My Account
            </router-link>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  const raw = localStorage.getItem('currentUser')
  if (raw) {
    const obj = JSON.parse(raw)
    if (obj && obj.email) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
      localStorage.removeItem('currentUser')
    }
  } else {
    isLoggedIn.value = false
  }
})

function logout() {
  localStorage.removeItem('currentUser')
  isLoggedIn.value = false
  router.push({ name: 'Home' })
}
</script>

<style>
body {
  background: #f8fafc;
}
</style>
