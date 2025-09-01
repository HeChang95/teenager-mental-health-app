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
const router = useRouter()

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

// basic email check
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

// basic password check
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

function handleLogin() {
  loading.value = true
  msg.value = ''
  ok.value = false

  // run validations
  validateEmail(true)
  validatePassword(true)

  // stop if any error
  if (errors.value.email || errors.value.password) {
    loading.value = false
    msg.value = 'Please fix the errors above.'
    ok.value = false
    return
  }

  // read users from localStorage
  let users = []
  const raw = localStorage.getItem('users')
  if (raw) {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      users = parsed
    }
  }

  // find user
  let found = null
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    if (u.email === email.value && u.password === password.value) {
      found = u
      break
    }
  }

  if (!found) {
    loading.value = false
    msg.value = 'Invalid email or password.'
    ok.value = false
    return
  }

  // set current user and go to account
  localStorage.setItem('currentUser', JSON.stringify(found))
  loading.value = false
  ok.value = true
  msg.value = 'Login success.'
  router.push({ name: 'MyAccount' })
}
</script>
