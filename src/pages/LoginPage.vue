<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <h2 class="mb-3">Log in</h2>
      <p class="text-muted">Welcome back!</p>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-3">
          <label for="lemail" class="form-label">Email *</label>
          <input
            id="lemail"
            type="email"
            class="form-control"
            v-model="email"
            @blur="validateEmail(true)"
            @input="validateEmail(false)"
          />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="lpwd" class="form-label">Password *</label>
          <input
            id="lpwd"
            type="password"
            class="form-control"
            v-model="password"
            @blur="validatePassword(true)"
            @input="validatePassword(false)"
          />
          <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Checking...' : 'Log in' }}
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="clearForm">Clear</button>
        </div>

        <!-- Message -->
        <div v-if="msg" class="alert mt-3" :class="ok ? 'alert-success' : 'alert-danger'">
          {{ msg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Firebase Auth API
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

// form state
const email = ref('')
const password = ref('')

// ui state
const loading = ref(false)
const msg = ref('')
const ok = ref(false)

// simple errors object
const errors = ref({
  email: null,
  password: null,
})

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
    loading.value = false
    msg.value = 'Please fix the errors above.'
    ok.value = false
    return
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ email: cred.user.email, uid: cred.user.uid }),
    )

    loading.value = false
    ok.value = true
    msg.value = 'Login success (Firebase).'
    router.push({ name: 'MyAccount' })
  } catch (error) {
    loading.value = false
    ok.value = false

    const map = {
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-disabled': 'This account is disabled.',
      'auth/user-not-found': 'No user found with this email.',
      'auth/wrong-password': 'Wrong password.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    }
    msg.value = map[error.code] || `Login failed: ${error.code}`
    console.log('Firebase Sign-in Error:', error)
  }
}
</script>
