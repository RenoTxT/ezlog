<template>
  <div class="activity-container">
    <div class="activity-header">
      <h2>Aktivitas untuk Tanggal</h2>
      <p>{{ formattedDate }}</p>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="form-section">
      <form @submit.prevent="handleSubmit" class="log-form">
        <input
          v-model="newActivityText"
          type="text"
          placeholder="Tulis aktivitas baru di sini..."
          required
        />
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Menyimpan...' : 'Tambah Log' }}
        </button>
      </form>

      <button v-if="canEndActivity" @click="handleEndActivity" class="btn-end" :disabled="isEnding">
        {{ isEnding ? 'Mengakhiri...' : 'End Current Activity' }}
      </button>
    </div>

    <div class="logs-list">
      <!-- 2. Gunakan `isLoading` langsung -->
      <div v-if="isLoading" class="loading">Memuat data...</div>
      <!-- 3. Gunakan `logs` langsung -->
      <ul v-else-if="logs.length > 0">
        <li v-for="log in logs" :key="log.id" class="log-item">
          <p class="log-text">{{ log.activityText }}</p>
          <span class="log-time">
            {{ formatTime(log.startTime) }} - {{ formatTime(log.endTime) || '...' }}
          </span>
        </li>
      </ul>
      <div v-else class="empty-state">
        <p>Belum ada aktivitas untuk tanggal ini. Mulai catat sekarang!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
// --- 1. PERUBAHAN UTAMA DI SINI ---
import { storeToRefs } from 'pinia'
import { useActivityStore } from '@/stores/activity'

const route = useRoute()
const activityStore = useActivityStore()

// Gunakan storeToRefs untuk membuat state menjadi reactive refs
const { logs, isLoading } = storeToRefs(activityStore)

const date = ref(route.params.date)
const newActivityText = ref('')
const errorMessage = ref(null)
const isSubmitting = ref(false)
const isEnding = ref(false)

// Computed property sekarang bisa menggunakan `logs.value`
const canEndActivity = computed(() => {
  if (logs.value.length === 0) {
    return false
  }
  const lastLog = logs.value[logs.value.length - 1]
  return lastLog && !lastLog.endTime
})

const formattedDate = computed(() => {
  if (!date.value) return ''
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date.value).toLocaleDateString('id-ID', options)
})

onMounted(() => {
  activityStore.fetchLogs(date.value)
})

onUnmounted(() => {
  activityStore.stopFetchingLogs()
})

const handleSubmit = async () => {
  errorMessage.value = null
  isSubmitting.value = true
  try {
    await activityStore.addLog(newActivityText.value, date.value)
    newActivityText.value = ''
  } catch (error) {
    console.error('Gagal menambahkan log:', error)
    errorMessage.value = 'Gagal menyimpan aktivitas.'
  } finally {
    isSubmitting.value = false
  }
}

const handleEndActivity = async () => {
  errorMessage.value = null
  isEnding.value = true
  try {
    await activityStore.endLastLog()
  } catch (error) {
    console.error('Gagal mengakhiri log:', error)
    errorMessage.value = error.message || 'Gagal mengakhiri aktivitas.'
  } finally {
    isEnding.value = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return null
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.activity-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Tambahkan scroll jika konten melebihi */
  max-height: calc(100vh - 64px - 4rem); /* Sesuaikan tinggi maksimal */
}
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}
.activity-header {
  text-align: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}
.activity-header h2 {
  margin: 0;
  color: #333;
}
.activity-header p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 1.1rem;
}
.form-section {
  margin-bottom: 2rem;
}
.log-form {
  display: flex;
  gap: 1rem;
}
.log-form input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.log-form button {
  padding: 0.75rem 1.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}
.log-form button:hover {
  background-color: #33a06f;
}
.log-form button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}
.btn-end {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #ef5350;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}
.btn-end:hover {
  background-color: #d32f2f;
}
.btn-end:disabled {
  background-color: #e57373;
  cursor: not-allowed;
}
.logs-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.log-item:last-child {
  border-bottom: none;
}
.log-text {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}
.log-time {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #555;
}
.loading,
.empty-state {
  text-align: center;
  color: #888;
  padding: 2rem;
}
</style>
