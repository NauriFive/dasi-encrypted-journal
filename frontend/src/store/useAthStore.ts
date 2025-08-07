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
            console.log('Error in checkAuth:', error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (signupData: { username: string; email: string; password: string }) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post('/auth/signup', signupData, { withCredentials: true })
            set({
                authUser: {
                    username: res.data.username,
                    email: res.data.email,
                    profilePicture: res.data.profilePicture,
                },
            })
            toast.success(res.data.message)
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error signing up.'
            toast.error(message)
            console.log('💀 ERROR IN SIGNUP:', message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (loginData: { email: string; password: string }) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/auth/login', loginData, { withCredentials: true })
            set({
                authUser: {
                    username: res.data.username,
                    email: res.data.email,
                    profilePicture: res.data.profilePicture,
                },
            })
            toast.success('Logged in successfully!')
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error logging in.'
            toast.error(message)
            console.log('💀 ERROR IN LOGIN:', message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get('/auth/logout')
            set({ authUser: null })
            toast.success('Logged out successfully!')
        } catch (error) {
            toast.error('Error logging out!')
        }
    },
}))

interface AuthStore {
    authUser: {
        username: string,
        email: string,
        profilePicture: string,
    } | null
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    isCheckingAuth: boolean
    checkAuth: () => Promise<void>
    signup: (signupData: { username: string; email: string; password: string }) => Promise<void>
    login: (loginData: { email: string; password: string }) => Promise<void>
    logout: () => Promise<void>
}
