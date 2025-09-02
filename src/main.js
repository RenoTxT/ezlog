import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { inject } from '@vercel/analytics'

async function initializeApp() {
  const app = createApp(App)

  app.use(createPinia())

  const authStore = useAuthStore()

  await authStore.listenForAuthStateChanges()

  app.use(router)
  app.mount('#app')
}

inject()

initializeApp()
