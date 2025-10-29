export async function sendMail({ fromEmail, subject, message, file }) {
  const base = window.FUNCTIONS_BASE_URL
  const url = `${base}/sendMail`

  let attachments
  if (file) {
    const b64 = await fileToBase64(file)
    attachments = [
      {
        filename: file.name,
        type: file.type || 'application/octet-stream',
        content: b64.replace(/^data:.*;base64,/, ''),
      },
    ]
  }

  const body = {
    to: fromEmail,
    subject,
    text: message,
    attachments,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
