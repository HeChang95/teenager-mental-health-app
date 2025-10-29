<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-3">Log in</h2>
      <p class="text-muted">Welcome back!</p>

      <div v-if="$route.query.denied" class="alert alert-warning mb-3">
        Please log in to continue.
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="lemail" class="form-label">Email *</label>
          <input
            id="lemail"
            type="email"
            class="form-control"
            v-model="email"
            @blur="validateEmail(true)"
            @input="validateEmail(false)"
            required
          />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
        </div>

        <div class="mb-3">
          <label for="lpwd" class="form-label">Password *</label>
          <input
            id="lpwd"
            type="password"
            class="form-control"
            v-model="password"
            @blur="validatePassword(true)"
            @input="validatePassword(false)"
            required
          />
          <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Checking...' : 'Log in' }}
          </button>
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="clearForm"
            :disabled="loading"
          >
            Clear
          </button>
        </div>

        <div v-if="msg" class="alert mt-3" :class="ok ? 'alert-success' : 'alert-danger'">
          {{ msg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const msg = ref('')
const ok = ref(false)
const errors = ref({ email: null, password: null })

function validateEmail(blurOnly) {
  if (!email.value) {
    errors.value.email = blurOnly ? 'Email is required.' : null
    return
  }
  if (email.value.indexOf('@') === -1 || email.value.indexOf('.') === -1) {
    errors.value.email = blurOnly ? 'Please enter a valid email.' : null
    return
  }
  errors.value.email = null
}

function validatePassword(blurOnly) {
  if (!password.value) {
    errors.value.password = blurOnly ? 'Password is required.' : null
    return
  }
  errors.value.password = null
}

function clearForm() {
  email.value = ''
  password.value = ''
  errors.value.email = null
  errors.value.password = null
  msg.value = ''
  ok.value = false
}

async function handleLogin() {
  loading.value = true
  msg.value = ''
  ok.value = false

  validateEmail(true)
  validatePassword(true)
  if (errors.value.email || errors.value.password) {
    msg.value = 'Please fix the errors above.'
    loading.value = false
    return
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    const lite = {
      email: cred.user.email,
      uid: cred.user.uid,
      displayName: cred.user.displayName || '',
    }

    localStorage.setItem('currentUser', JSON.stringify(lite))
    localStorage.setItem('__cached_auth_user__', JSON.stringify(lite))

    window.dispatchEvent(new Event('auth-changed'))
    ok.value = true
    msg.value = 'Login success (Firebase).'
    router.push({ name: 'MyAccount' })
  } catch (error) {
    const map = {
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-disabled': 'This account is disabled.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Wrong password.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    }
    msg.value = map[error.code] || `Login failed: ${error.code}`
    console.error('Error logging in:', error)
  } finally {
    loading.value = false
  }
}

// If logged in, it will be redirected to the account page directly; and also be automatically recognized after refreshing.
onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    if (u) router.push({ name: 'MyAccount' })
  })
})
</script>
