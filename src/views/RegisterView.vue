<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Buat Akun Baru</h2>
      <form @submit.prevent="handleRegister">
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
            placeholder="Minimal 6 karakter"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Ulangi password Anda"
          />
        </div>
        <!-- Tampilkan pesan error jika ada -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="btn-register">Daftar</button>
      </form>
      <p class="login-link">Sudah punya akun? <RouterLink to="/login">Login di sini</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref(null)

const authStore = useAuthStore()

const handleRegister = async () => {
  errorMessage.value = null // Reset pesan error
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Password dan konfirmasi password tidak cocok.'
    return
  }

  try {
    // Panggil action register dari store
    await authStore.register(email.value, password.value)
    // Redirect akan ditangani di dalam action store setelah berhasil
  } catch (error) {
    // Tangkap error jika pendaftaran gagal
    errorMessage.value = error.message
  }
}
</script>

<style scoped>
/* Style ini mirip dengan halaman login untuk konsistensi */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: Inter, sans-serif;
}
.register-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
h2 {
  margin-bottom: 24px;
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
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
input:focus {
  outline: none;
  border-color: #42b883;
}
.btn-register {
  width: 100%;
  padding: 12px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-register:hover {
  background-color: #33a06f;
}
.error-message {
  color: red;
  margin-top: -10px;
  margin-bottom: 15px;
  font-size: 0.9em;
}
.login-link {
  margin-top: 20px;
  font-size: 0.9em;
}
.login-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
}
</style>
