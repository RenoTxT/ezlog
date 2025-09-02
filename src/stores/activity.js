import { defineStore } from 'pinia'
import { db } from '@/firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useAuthStore } from './auth'

let unsubscribeFromLogs = null

export const useActivityStore = defineStore('activity', {
  state: () => ({
    logs: [],
    isLoading: false,
  }),
  actions: {
    stopFetchingLogs() {
      if (unsubscribeFromLogs) {
        console.log('Listener dihentikan.')
        unsubscribeFromLogs()
        unsubscribeFromLogs = null
      }
    },

    fetchLogs(date) {
      this.isLoading = true
      this.stopFetchingLogs()

      const authStore = useAuthStore()
      const userId = authStore.user?.uid

      if (!userId) {
        this.isLoading = false
        return
      }

      const logsCollection = collection(db, 'logs')
      const q = query(
        logsCollection,
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('createdAt', 'asc'),
      )

      unsubscribeFromLogs = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedLogs = []
          querySnapshot.forEach((doc) => {
            fetchedLogs.push({ id: doc.id, ...doc.data() })
          })

          console.log(
            `[${new Date().toLocaleTimeString()}] Listener menerima ${querySnapshot.docs.length} data dari Firebase.`,
          )
          console.log(
            'Data yang diterima:',
            fetchedLogs.map((log) => log.activityText),
          )

          // --- PERUBAHAN DI SINI ---
          // Gunakan $patch untuk memperbarui state dengan andal
          this.$patch({
            logs: fetchedLogs,
            isLoading: false,
          })

          console.log(`State Pinia sekarang memiliki ${this.logs.length} data.`)
        },
        (error) => {
          console.error('Gagal mengambil data log:', error)
          this.isLoading = false
        },
      )
    },

    async addLog(activityText, date) {
      if (!activityText.trim()) return

      const authStore = useAuthStore()
      const userId = authStore.user?.uid
      if (!userId) return

      const logsCollection = collection(db, 'logs')
      const currentTime = serverTimestamp()

      const lastLog = this.logs.length > 0 ? this.logs[this.logs.length - 1] : null

      if (lastLog && !lastLog.endTime) {
        const lastLogRef = doc(db, 'logs', lastLog.id)
        await updateDoc(lastLogRef, {
          endTime: currentTime,
        })
      }

      const newLogData = {
        activityText,
        date,
        userId,
        startTime: currentTime,
        endTime: null,
        createdAt: currentTime,
      }

      await addDoc(logsCollection, newLogData)
    },

    async endLastLog() {
      const lastLog = this.logs.length > 0 ? this.logs[this.logs.length - 1] : null

      if (lastLog && !lastLog.endTime) {
        try {
          const lastLogRef = doc(db, 'logs', lastLog.id)
          await updateDoc(lastLogRef, {
            endTime: serverTimestamp(),
          })
        } catch (error) {
          console.error('Gagal mengakhiri log terakhir:', error)
          throw new Error('Gagal memperbarui aktivitas terakhir.')
        }
      }
    },
  },
})
