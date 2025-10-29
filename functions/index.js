import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as cors from 'cors'
import axios from 'axios'
import sgMail from '@sendgrid/mail'

try {
  if (!admin.apps.length) {
    admin.initializeApp()
  }
} catch (e) {
  /* App already initialized */
}

const SENDGRID_KEY = functions.config().sendgrid?.key || functions.config().sendgrid?.key

const WEATHER_KEY = functions.config().weather?.key || functions.config().weather?.key

if (SENDGRID_KEY) sgMail.setApiKey(SENDGRID_KEY)

// Firestore bookmark count
export const countResources = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })
    try {
      const db = admin.firestore()
      const topic = (req.query.topic || '').toString().trim()

      let col = db.collection('resources')
      if (topic) col = col.where('topic', '==', topic)

      if (typeof col.count === 'function') {
        const snap = await col.count().get()
        return res.json({ count: snap.data().count || 0 })
      }
      const qs = await col.select(admin.firestore.FieldPath.documentId()).get()
      return res.json({ count: qs.size })
    } catch (error) {
      console.error('Error counting resources:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
})

// Learning task count
export const countTasks = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })
    try {
      const db = admin.firestore()
      const status = (req.query.status || '').toString().trim()
      const owner = (req.query.owner || '').toString().trim()

      let col = db.collection('study_tasks')
      if (owner) col = col.where('ownerUid', '==', owner)
      if (status) col = col.where('status', '==', status)

      if (typeof col.count === 'function') {
        const snap = await col.count().get()
        return res.json({ count: snap.data().count || 0 })
      }
      const qs = await col.select(admin.firestore.FieldPath.documentId()).get()
      return res.json({ count: qs.size })
    } catch (error) {
      console.error('Error counting tasks:', error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
})

// OpenWeather
export const weatherProxy = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })
    if (!WEATHER_KEY) return res.status(500).json({ error: 'WEATHER_API_KEY not configured' })

    try {
      let { city, lat, lon, units } = req.query
      const params = { appid: WEATHER_KEY, units: units || 'metric' }

      if (lat && lon) {
        params.lat = String(lat)
        params.lon = String(lon)
      } else {
        city = (city || '').toString().trim()
        if (!city) return res.status(400).json({ error: 'city or lat/lon is required' })
        params.q = city
      }

      const url = 'https://api.openweathermap.org/data/2.5/weather'
      const resp = await axios.get(url, { params })
      return res.json(resp.data)
    } catch (error) {
      console.error('Error fetching weather:', error)
      const status = error.response?.status || 500
      return res.status(status).json({ error: 'Failed to fetch weather' })
    }
  })
})

// OpenWeather Academic and Health Briefing
export const weatherBrief = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })
    if (!WEATHER_KEY) return res.status(500).json({ error: 'WEATHER_API_KEY not configured' })

    try {
      let { city, lat, lon } = req.query
      const params = { appid: WEATHER_KEY, units: 'metric' }

      if (lat && lon) {
        params.lat = String(lat)
        params.lon = String(lon)
      } else {
        city = (city || '').toString().trim()
        if (!city) return res.status(400).json({ error: 'city or lat/lon is required' })
        params.q = city
      }

      const url = 'https://api.openweathermap.org/data/2.5/weather'
      const { data } = await axios.get(url, { params })

      const name = data.name
      const main = data.main || {}
      const wind = data.wind || {}
      const w0 = (data.weather && data.weather[0]) || {}
      const temp = typeof main.temp === 'number' ? main.temp : null
      const humidity = typeof main.humidity === 'number' ? main.humidity : null
      const windSpeed = typeof wind.speed === 'number' ? wind.speed : null
      const desc = w0.description || ''
      const code = w0.id || 0 // eg 5xx Rain/6xx Snow

      const risks = []
      const advice = []

      if (temp !== null) {
        if (temp >= 35) {
          risks.push('heat')
          advice.push('Heat: Stay hydrated and cool; reduce outdoor activities if needed.')
        } else if (temp <= 5) {
          risks.push('cold')
          advice.push('Cold: Keep warm; wear insulating layers when going out.')
        }
      }
      if (windSpeed !== null && windSpeed >= 10) {
        risks.push('wind')
        advice.push('Strong winds: Allow extra travel time (incl. exam day) and stay safe.')
      }
      if (String(code).startsWith('2')) {
        risks.push('thunderstorm')
        advice.push('Thunderstorms: Avoid open areas; monitor travel conditions.')
      } else if (String(code).startsWith('5') || String(code).startsWith('3')) {
        risks.push('rain')
        advice.push('Rain: Bring rain gear; slow down on slick roads; leave earlier for exams.')
      } else if (String(code).startsWith('6')) {
        risks.push('snow')
        advice.push('Snow: Slippery roads expected; use caution commuting and on campus.')
      } else if (String(code).startsWith('7')) {
        risks.push('low-visibility')
        advice.push('Low visibility (fog/smog): Take extra care when cycling or walking')
      }

      if (humidity !== null) {
        if (humidity >= 85 && temp >= 28)
          advice.push('Muggy/humid: Ventilate and cool indoor study spaces.')
        if (humidity <= 25)
          advice.push('Dry air: Moisturize skin/airways and drink water regularly.')
      }

      return res.json({
        city: name || city || null,
        desc,
        temp,
        humidity,
        wind: windSpeed,
        risks,
        advice,
      })
    } catch (error) {
      console.error('Error generating weather brief:', error)
      const status = error.response?.status || 500
      return res.status(status).json({ error: 'Failed to generate weather brief' })
    }
  })
})

// Send email
export const sendMail = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
    if (!SENDGRID_KEY) return res.status(500).json({ error: 'SENDGRID_API_KEY not configured' })

    const { to, subject, text, html, attachments } = req.body || {}
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'to, subject and text|html are required' })
    }

    try {
      const msg = {
        to,
        from: 'hcha0196@student.monash.edu',
        subject,
        text: text || undefined,
        html: html || undefined,
        attachments: Array.isArray(attachments)
          ? attachments.map((a) => ({
              filename: a.filename,
              type: a.type || 'application/octet-stream',
              content: a.content,
              disposition: 'attachment',
            }))
          : undefined,
      }

      const resp = await sgMail.send(msg)
      return res.json({
        ok: true,
        messageId: resp && resp[0]?.headers && resp[0].headers['x-message-id'],
      })
    } catch (error) {
      console.error('Error sending mail:', error)
      return res.status(500).json({ error: 'Failed to send mail' })
    }
  })
})
