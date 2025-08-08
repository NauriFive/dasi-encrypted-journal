import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create<AuthStore>()((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingAvatar: false,
    isUpdatingUsername: false,
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
                    avatar: res.data.avatar,
                },
            })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.message || 'Error signing up.')
            console.log('💀 ERROR IN SIGNUP:', error.response.data.message)
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
                    avatar: res.data.avatar,
                },
            })
            toast.success('Logged in successfully!')
        } catch (error: any) {
            toast.error(error.response.data.message || 'Error logging in')
            console.log('💀 ERROR IN LOGIN:', error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get('/auth/logout')
            set({ authUser: null })
            toast.success('Logged out successfully!')
        } catch (error: any) {
            toast.error(error.response.data.message || 'Error logging out.')
            console.log('💀 ERROR IN logout:', error.response.data.message)
        }
    },

    updateAvatar: async (newAvatar: { newAvatar: string }) => {
        set({ isUpdatingAvatar: true })
        try {
            const res = await axiosInstance.put('/auth/update-avatar', newAvatar, { withCredentials: true })
            toast.success(res.data.message || 'Updated avatar successfully.')
        } catch (error: any) {
            toast.error(error.response.data.message || 'Error updating avatar')
            console.log('💀 ERROR IN updateAvatar:', error.response.data.message)
        } finally {
            set({ isUpdatingAvatar: false })
        }
    },

    updateUsername: async (newUsername: { newUsername: string }) => {
        set({ isUpdatingUsername: true })
        try {
            const res = await axiosInstance.put('/auth/update-username', newUsername, { withCredentials: true })
            set((state) => ({
                authUser: state.authUser ? { ...state.authUser, username: res.data.username } : state.authUser,
            }))
            toast.success(res.data.message || 'Updated username successfully.')
        } catch (error: any) {
            toast.error(error.response.data.message || 'Error updating username')
            console.log('💀 ERROR IN updateUsername:', error.response.data.message)
        } finally {
            set({ isUpdatingUsername: false })
        }
    },
}))

interface AuthStore {
    authUser: {
        username: string
        email: string
        avatar: string
    } | null
    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingAvatar: boolean
    isUpdatingUsername: boolean
    isCheckingAuth: boolean
    checkAuth: () => Promise<void>
    signup: (signupData: { username: string; email: string; password: string }) => Promise<void>
    login: (loginData: { email: string; password: string }) => Promise<void>
    logout: () => Promise<void>
    updateAvatar: (newAvatar: { newAvatar: string }) => Promise<void>
    updateUsername: (newUsername: { newUsername: string }) => Promise<void>
}
