<template>
  <div class="calendar-wrapper">
    <div class="header-info">
      <h1>Log Book Kalender</h1>
      <p>Login sebagai: {{ authStore.user?.email }}</p>
    </div>

    <div class="calendar-card">
      <div class="calendar-header">
        <button @click="prevMonth" class="nav-btn">&lt;</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button @click="nextMonth" class="nav-btn">&gt;</button>
      </div>
      <div class="calendar-grid">
        <div v-for="dayName in dayNames" :key="dayName" class="day-name">{{ dayName }}</div>
        <div
          v-for="(day, index) in calendarGrid"
          :key="index"
          class="day-cell"
          :class="{
            'not-current-month': !day.isCurrentMonth,
            'is-today': isToday(day.date, day.isCurrentMonth),
            'is-selected': isSelected(day.date, day.isCurrentMonth),
          }"
          @click="selectDate(day)"
        >
          <span>{{ day.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const today = new Date()
const currentMonth = ref(today.getMonth()) // 0-11
const currentYear = ref(today.getFullYear())
const selectedDate = ref(null)

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const calendarGrid = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 for Sunday, 1 for Monday...
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []

  // Days from previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth; i > 0; i--) {
    days.push({ date: daysInPrevMonth - i + 1, isCurrentMonth: false })
  }

  // Days for current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, isCurrentMonth: true })
  }

  // Days for next month
  const remainingCells = 42 - days.length // 6 weeks * 7 days
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ date: i, isCurrentMonth: false })
  }

  return days
})

const currentMonthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('id-ID', { month: 'long' })
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// --- FUNGSI YANG DIPERBAIKI ---
const selectDate = (day) => {
  let year = currentYear.value
  let month = currentMonth.value

  // Menangani klik pada tanggal dari bulan sebelumnya atau berikutnya
  if (!day.isCurrentMonth) {
    if (day.date > 20) {
      // Tanggal dari bulan sebelumnya
      if (month === 0) {
        month = 11
        year--
      } else {
        month--
      }
    } else {
      // Tanggal dari bulan berikutnya
      if (month === 11) {
        month = 0
        year++
      } else {
        month++
      }
    }
  }

  // Membuat string tanggal secara manual untuk menghindari masalah zona waktu
  // Bulan ditambah 1 karena 0-indexed, lalu padStart untuk format 'MM'
  const monthString = (month + 1).toString().padStart(2, '0')
  const dateString = day.date.toString().padStart(2, '0')
  const fullDateString = `${year}-${monthString}-${dateString}`

  // Navigasi ke halaman aktivitas dengan tanggal yang benar
  router.push({ name: 'activity', params: { date: fullDateString } })
}

const isToday = (date, isCurrentMonth) => {
  return (
    isCurrentMonth &&
    date === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

const isSelected = (date, isCurrentMonth) => {
  if (!selectedDate.value) return false
  const selected = new Date(selectedDate.value)
  return (
    isCurrentMonth &&
    date === selected.getDate() &&
    currentMonth.value === selected.getMonth() &&
    currentYear.value === selected.getFullYear()
  )
}
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}
.header-info {
  text-align: center;
}
.header-info h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #374151;
}
.header-info p {
  color: #6b7280;
  font-size: 0.9rem;
}
.calendar-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 480px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.calendar-header h2 {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1f2937;
}
.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #9ca3af;
  transition: color 0.2s;
}
.nav-btn:hover {
  color: #1f2937;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}
.day-name,
.day-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
}
.day-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
}
.day-cell {
  cursor: pointer;
  border-radius: 9999px;
  transition:
    background-color 0.2s,
    color 0.2s;
  color: #374151;
}
.day-cell:hover {
  background-color: #f3f4f6;
}
.day-cell.not-current-month {
  color: #d1d5db;
}
.day-cell.is-today {
  background-color: #42b883;
  color: #ffffff;
  font-weight: 600;
}
.day-cell.is-selected {
  outline: 2px solid #42b883;
}
</style>
