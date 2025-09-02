<template>
  <div id="app-wrapper">
    <header class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <RouterLink to="/" class="logo-link">
            <span>EZLOG</span>
          </RouterLink>
        </div>
        <nav v-if="authStore.isLoggedIn">
          <RouterLink :to="{ name: 'activity', params: { date: todayDate } }">Activity</RouterLink>
          <a href="#" @click.prevent="authStore.logout()">Logout</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
#app-wrapper {
  /* --- 1. LAYOUT FULL-SCREEN & ANTI-SCROLL --- */
  height: 100vh;
  overflow: hidden; /* Mencegah scroll */
  display: flex;
  flex-direction: column;
  position: relative; /* Diperlukan untuk pseudo-element */
  z-index: 1; /* Membuat konteks stacking */
}

/* --- 2. LOGO SEBAGAI LATAR BELAKANG --- */
#app-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Pastikan nama file logo Anda benar dan ada di folder /public */
  background-image: url('/public/ezlog.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  opacity: 0.05; /* Buat logo menjadi sangat pudar agar tidak mengganggu */
  z-index: -1; /* Posisikan di belakang konten */
}

.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 0 2rem;
  height: 64px;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-link span {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: -1px;
}

/* Konten utama yang menengahkan kalender */
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  /* Latar belakang semi-transparan agar logo tetap terlihat namun konten terbaca */
  background-color: rgba(255, 255, 255, 0.8);
}

nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

nav a {
  font-weight: 600;
  color: #4a5568;
  text-decoration: none;
  padding: 0.25rem 0;
  position: relative;
  transition: color 0.2s;
}

nav a:hover {
  color: #2d3748;
}

nav a.router-link-exact-active {
  color: #42b883;
}
</style>
