import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore()

// Gunakan async/await untuk memastikan listener selesai sebelum app di-mount
async function initializeApp() {
  await authStore.listenForAuthStateChanges()

  app.use(router)
  app.mount('#app')
}

initializeApp()
