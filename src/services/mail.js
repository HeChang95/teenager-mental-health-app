import axios from 'axios'
const MAIL_BASE = import.meta.env.VITE_MAIL_BASE

export async function sendMail({ fromEmail, subject, message, file }) {
  const form = new FormData()
  form.append('fromEmail', fromEmail)
  form.append('subject', subject)
  form.append('message', message)
  if (file) form.append('file', file, file.name)
  try {
    const res = await axios.post(`${MAIL_BASE}/sendMail`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (e) {
    console.error('Error sending mail:', e)
    throw e
  }
}
