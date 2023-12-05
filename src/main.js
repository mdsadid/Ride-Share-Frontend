import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"
import VueGoogleMaps from '@fawmi/vue-google-maps'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000
})

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCAqdwRPpTtDGc6lWZKlSO0EPgkAKRo-8o',
    libraries: 'places'
  }
})

app.mount('#app')
