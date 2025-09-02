import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/activity/:date',
    name: 'activity',
    component: () => import('../views/ActivityView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- GUARD YANG SUDAH DIPERBAIKI ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Jika pengecekan Firebase belum selesai, tunggu dulu.
  // Ini adalah kunci untuk mencegah race condition.
  if (!authStore.isAuthReady) {
    await authStore.listenForAuthStateChanges()
  }

  const requiresAuth = to.meta.requiresAuth

  // Setelah yakin status auth sudah siap, baru buat keputusan.
  if (requiresAuth && !authStore.isLoggedIn) {
    // Jika butuh login tapi tidak login, arahkan ke /login.
    next({ name: 'login' })
  } else {
    // Jika tidak butuh login, atau sudah login, lanjutkan.
    next()
  }
})

export default router
