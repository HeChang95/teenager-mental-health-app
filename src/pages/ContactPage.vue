<script setup>
import { reactive, ref } from 'vue'
import { sendMail } from '@/services/mail'

const form = reactive({ fromEmail: '', subject: '', message: '' })
const file = ref(null)
const loading = ref(false)
const ok = ref('')
const err = ref('')

async function onSubmit() {
  loading.value = true
  ok.value = ''
  err.value = ''
  try {
    await sendMail({ ...form, file: file.value?.files?.[0] })
    ok.value = 'Mail sent successfully.'
  } catch (e) {
    err.value = e?.response?.data?.error || e?.message || 'Failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="container" style="max-width: 640px" @submit.prevent="onSubmit">
    <h2>Contact / Referral</h2>
    <div class="mb-3">
      <label for="em" class="form-label">Your Email</label>
      <input id="em" v-model="form.fromEmail" type="email" required class="form-control" />
    </div>
    <div class="mb-3">
      <label for="sb" class="form-label">Subject</label>
      <input id="sb" v-model="form.subject" required class="form-control" />
    </div>
    <div class="mb-3">
      <label for="msg" class="form-label">Message</label>
      <textarea id="msg" v-model="form.message" rows="6" required class="form-control" />
    </div>
    <div class="mb-3">
      <label for="att" class="form-label">Attachment (optional)</label>
      <input id="att" ref="file" type="file" class="form-control" />
    </div>
    <button class="btn btn-primary" :disabled="loading">
      {{ loading ? 'Sending...' : 'Send' }}
    </button>
    <div v-if="ok" class="alert alert-success mt-3">{{ ok }}</div>
    <div v-if="err" class="alert alert-danger mt-3">{{ err }}</div>
  </form>
</template>
