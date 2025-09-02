import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
// 1. Impor fungsi inject dari Vercel Analytics
import { inject } from '@vercel/analytics'

// Fungsi asinkron untuk menginisialisasi aplikasi
async function initializeApp() {
  const app = createApp(App)

  app.use(createPinia())

  const authStore = useAuthStore()

  // Tunggu hingga pengecekan otentikasi pertama dari Firebase selesai.
  // Ini adalah kunci untuk memastikan 'isAuthReady' bernilai true
  // sebelum router mulai bekerja.
  await authStore.listenForAuthStateChanges()

  // Setelah status auth siap, baru kita gunakan router dan mount aplikasi.
  app.use(router)
  app.mount('#app')
}

// 2. Panggil fungsi inject untuk mengaktifkan analytics
inject()

// Jalankan fungsi inisialisasi
initializeApp()
