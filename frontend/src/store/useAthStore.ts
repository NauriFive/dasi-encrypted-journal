import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create<AuthStore>()((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
        } catch (error) {
            console.log('💢 Error in checkAuth:', error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data: any) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post('/auth/signup', data)
            set({ authUser: res.data })
            toast.success('Account created successfully!')
        } catch (error: any) {
            toast.error(error.resonse?.data?.message)
            console.log("💀 Something is broken in useAuthStore.ts' signup") // 💀 LOG
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout")
            set({authUser: null})
            toast.success('Successfully logged out!')
        } catch (error) {
            toast.error('Error logging out!')
        }
    }
}))

interface AuthStore {
    authUser: any
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    isCheckingAuth: boolean
    checkAuth: () => Promise<void>
    signup: (data: any) => Promise<void>
    logout: () => void
}
