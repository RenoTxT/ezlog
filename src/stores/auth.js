import { defineStore } from 'pinia'
import router from '@/router'
import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

let unsubscribeFromAuthChanges

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthReady: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async register(email, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        router.push('/')
      } catch (error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error('Email sudah terdaftar.')
          case 'auth/weak-password':
            throw new Error('Password terlalu lemah (minimal 6 karakter).')
          default:
            throw new Error('Terjadi kesalahan saat pendaftaran.')
        }
      }
    },

    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        router.push('/')
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error('User tidak ditemukan.')
          case 'auth/wrong-password':
            throw new Error('Password salah.')
          default:
            throw new Error('Terjadi kesalahan saat login.')
        }
      }
    },

    async logout() {
      await signOut(auth)
      router.push('/login')
    },

    listenForAuthStateChanges() {
      return new Promise((resolve) => {
        if (unsubscribeFromAuthChanges) {
          unsubscribeFromAuthChanges()
        }

        unsubscribeFromAuthChanges = onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user
          } else {
            this.user = null
          }
          this.isAuthReady = true
          resolve()
        })
      })
    },
  },
})
