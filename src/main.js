import './firebase'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

window.FUNCTIONS_BASE_URL = 'http://127.0.0.1:5001/teenager-mental-health-app/australia-southeast2' // for local development
window.FUNCTIONS_BASE_URL =
  'https://australia-southeast2-teenager-mental-health-app.cloudfunctions.net' // for production
