<!-- src/pages/SignUpPage.vue -->
<template>
  <section>
    <h2>Sign Up</h2>
    <form class="row g-3 mt-1" @submit.prevent="onSubmit">
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input
          v-model.trim="form.email"
          type="email"
          class="form-control"
          @blur="validateEmail(true)"
          @input="validateEmail(false)"
        />
        <div v-if="errors.email" class="text-danger mt-1">{{ errors.email }}</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Password</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          @blur="validatePassword(true)"
          @input="validatePassword(false)"
        />
        <div v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</div>
      </div>

      <div class="col-12">
        <button class="btn btn-primary" type="submit">Create Account</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: null,
  password: null,
})

const validateEmail = (blur) => {
  if (!form.email) {
    if (blur) errors.email = 'Email is required.'
    return
  }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  errors.email = ok ? null : blur ? 'Invalid email format.' : errors.email
}

const validatePassword = (blur) => {
  const v = form.password
  const min = 8
  const hasUpper = /[A-Z]/.test(v)
  const hasLower = /[a-z]/.test(v)
  const hasNum = /\d/.test(v)
  const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(v)

  if (v.length < min) {
    if (blur) errors.password = `At least ${min} characters.`
    return
  }
  if (!hasUpper) {
    if (blur) errors.password = 'Must include an uppercase letter.'
    return
  }
  if (!hasLower) {
    if (blur) errors.password = 'Must include a lowercase letter.'
    return
  }
  if (!hasNum) {
    if (blur) errors.password = 'Must include a number.'
    return
  }
  if (!hasSpec) {
    if (blur) errors.password = 'Must include a special character.'
    return
  }

  errors.password = null
}

const onSubmit = () => {
  validateEmail(true)
  validatePassword(true)
  if (!errors.email && !errors.password) {
    alert('Account created (demo only). Take a screenshot to evidence validations.')
  }
}
</script>
