<template>
  <div class="container mt-4">
    <h2 class="mb-3">My Account</h2>

    <div v-if="loggedIn">
      <p><strong>Welcome:</strong> {{ user.displayName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ showRole(user.role) }}</p>

      <button class="btn btn-outline-danger btn-sm" @click="logout">Log out</button>
    </div>

    <div v-else class="alert alert-warning">
      You are not logged in.
      <router-link class="ms-2" :to="{ name: 'Login' }">Go to login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const loggedIn = ref(false)
const user = ref({ email: '', displayName: '', role: '' })

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
  loggedIn.value = false
  router.push({ name: 'Home' })
}

// Uppercase role
function showRole(role) {
  if (!role) return ''
  const first = role.charAt(0).toUpperCase()
  const rest = role.slice(1)
  return first + rest
}
</script>
