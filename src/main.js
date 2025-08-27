// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap (responsive)
import 'bootstrap/dist/css/bootstrap.min.css'

// Router
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
