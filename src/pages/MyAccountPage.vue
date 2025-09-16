<template>
  <div class="container mt-4">
    <h2 class="mb-3">My Account</h2>

    <div v-if="loggedIn">
      <p><strong>Welcome:</strong> {{ user.displayName || '(no name)' }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>

      <button class="btn btn-outline-danger btn-sm" @click="logout">Log out</button>
    </div>

    <div v-else class="alert alert-warning">
      You are not logged in.
      <router-link class="ms-2" :to="{ name: 'Login' }">Go to login</router-link>
    </div>

    <!-- If the route has denied=1, a prompt will be given -->
    <div v-if="$route.query.denied" class="alert alert-danger mt-3">
      You don’t have permission to view that page.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loggedIn = ref(false)
const user = ref({ email: '', displayName: '' })

onMounted(() => {
  const raw = localStorage.getItem('currentUser')
  if (raw) {
    const obj = JSON.parse(raw)
    if (obj && obj.email) {
      loggedIn.value = true
      user.value = obj
    }
  }
})

function logout() {
  localStorage.removeItem('currentUser')
  window.dispatchEvent(new Event('auth-changed'))

  router.push({ name: 'Home' })
}
</script>
