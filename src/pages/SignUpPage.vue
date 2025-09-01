<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <h2 class="mb-3">Create your account</h2>
      <p class="text-muted">Sign up to save your tools and progress.</p>

      <form @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label" for="email">Email *</label>
          <input
            id="email"
            type="email"
            class="form-control"
            v-model="form.email"
            @input="validateEmail(false)"
            @blur="validateEmail(true)"
          />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
          <small v-else-if="ok.email" class="text-success">Looks good.</small>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label" for="pwd">Password *</label>
          <input
            id="pwd"
            type="password"
            class="form-control"
            v-model="form.password"
            @input="validatePassword(false)"
            @blur="validatePassword(true)"
          />
          <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
          <small v-else-if="ok.password" class="text-success">Strong enough.</small>
        </div>

        <!-- Display name -->
        <div class="mb-3">
          <label class="form-label" for="name">Display name (optional)</label>
          <input id="name" type="text" class="form-control" v-model="form.displayName" />
        </div>

        <!-- Role -->
        <div class="mb-3">
          <label class="form-label d-block">Role *</label>

          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="role-student"
              name="role"
              value="student"
              v-model="form.role"
              @change="validateRole()"
            />
            <label class="form-check-label" for="role-student">Student</label>
          </div>

          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              id="role-parent"
              name="role"
              value="parent"
              v-model="form.role"
              @change="validateRole()"
            />
            <label class="form-check-label" for="role-parent">Parent</label>
          </div>

          <div>
            <small v-if="errors.role" class="text-danger">{{ errors.role }}</small>
          </div>
        </div>

        <!-- Agree -->
        <div class="form-check mb-3">
          <input
            class="form-check-input"
            type="checkbox"
            id="agree"
            v-model="form.agree"
            @change="validateAgree()"
          />
          <label class="form-check-label" for="agree">I agree to the Terms and Privacy.</label>
          <div>
            <small v-if="errors.agree" class="text-danger">{{ errors.agree }}</small>
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2">
          <button class="btn btn-primary" type="submit" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Sign up' }}
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="clearForm">Clear</button>
        </div>

        <!-- Message -->
        <div
          v-if="serverMsg"
          class="alert mt-3"
          :class="serverOk ? 'alert-success' : 'alert-danger'"
        >
          {{ serverMsg }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  displayName: '',
  agree: false,
  role: '', // 'student' | 'parent'
})

const errors = reactive({
  email: null,
  password: null,
  agree: null,
  role: null,
})
const ok = reactive({
  email: false,
  password: false,
})

const submitting = ref(false)
const serverMsg = ref('')
const serverOk = ref(false)

// Email check（include @ and .）
function validateEmail(blurOnly) {
  ok.email = false
  if (!form.email) {
    errors.email = blurOnly ? 'Email is required.' : null
    return
  }
  if (form.email.indexOf('@') === -1 || form.email.indexOf('.') === -1) {
    errors.email = blurOnly ? 'Please enter a valid email.' : null
    return
  }
  errors.email = null
  ok.email = true
}

// Password >= 8
function validatePassword(blurOnly) {
  ok.password = false
  if (!form.password) {
    errors.password = blurOnly ? 'Password is required.' : null
    return
  }
  if (form.password.length < 8) {
    errors.password = blurOnly ? 'Password must be at least 8 characters.' : null
    return
  }
  errors.password = null
  ok.password = true
}

// agree
function validateAgree() {
  errors.agree = form.agree ? null : 'Please tick the checkbox to continue.'
}

// select role
function validateRole() {
  errors.role = form.role ? null : 'Please choose a role.'
}

function clearForm() {
  form.email = ''
  form.password = ''
  form.displayName = ''
  form.agree = false
  form.role = ''

  errors.email = null
  errors.password = null
  errors.agree = null
  errors.role = null

  ok.email = false
  ok.password = false

  serverMsg.value = ''
  serverOk.value = false
}

function handleSubmit() {
  submitting.value = true
  serverMsg.value = ''
  serverOk.value = false

  validateEmail(true)
  validatePassword(true)
  validateAgree()
  validateRole()

  if (errors.email || errors.password || errors.agree || errors.role) {
    submitting.value = false
    serverMsg.value = 'Please fix the errors above.'
    serverOk.value = false
    return
  }

  let users = []
  const raw = localStorage.getItem('users')
  if (raw) {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) users = parsed
  }

  // email check
  let duplicated = false
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === form.email) {
      duplicated = true
      break
    }
  }
  if (duplicated) {
    submitting.value = false
    serverMsg.value = 'This email has already been registered.'
    serverOk.value = false
    return
  }

  // save new person
  const newUser = {
    email: form.email,
    password: form.password,
    displayName: form.displayName ? form.displayName : form.email.split('@')[0],
    role: form.role,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))

  submitting.value = false
  serverOk.value = true
  serverMsg.value = 'Sign up success!'
  router.push({ name: 'MyAccount' })
}
</script>

<style>
input[type='password']::-ms-reveal,
input[type='password']::-ms-clear {
  display: none;
}
input[type='password']::-webkit-credentials-auto-fill-button {
  visibility: hidden;
}
</style>
