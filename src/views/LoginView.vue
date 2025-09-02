<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2>EZLOG Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Masukkan email Anda"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Masukkan password Anda"
          />
        </div>

        <!-- Tampilkan pesan error jika ada -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" class="btn-login">Login</button>
      </form>
      <p class="register-link">
        Belum punya akun? <RouterLink to="/register">Daftar di sini</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// State reaktif untuk menampung input pengguna dan pesan error
const email = ref('')
const password = ref('')
const errorMessage = ref(null)

// Dapatkan akses ke auth store kita
const authStore = useAuthStore()

// Fungsi yang dijalankan saat form di-submit
const handleLogin = async () => {
  errorMessage.value = null // Reset pesan error setiap kali mencoba login
  try {
    // Panggil action 'login' dari store dengan email dan password
    await authStore.login(email.value, password.value)
    // Redirect ke halaman utama akan ditangani di dalam store
  } catch (error) {
    // Jika terjadi error (misal: password salah), tangkap dan tampilkan pesannya
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
/* Kontainer utama sekarang menjadi latar belakang putih dan mengisi seluruh layar */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff; /* Latar belakang sekarang putih */
  padding: 2rem; /* Beri sedikit jarak dari tepi layar, terutama di mobile */
  box-sizing: border-box;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
}

/* Wrapper ini hanya untuk membatasi lebar form agar tidak terlalu besar di desktop */
.login-form-wrapper {
  width: 100%;
  max-width: 420px;
  text-align: center;
}

h2 {
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px; /* Sedikit lebih bulat */
  box-sizing: border-box;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.btn-login {
  width: 100%;
  padding: 14px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #33a06f;
}

.error-message {
  color: #d93025;
  margin-top: -10px;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 24px;
  font-size: 0.9rem;
}

.register-link a {
  color: #42b883;
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
