import { useEffect } from 'react'
import { NavBar } from './Components/NavBar.tsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage.tsx'
import LoginPage from './Pages/LoginPage.tsx'
import SignupPage from './Pages/SignupPage.tsx'
import SettingPage from './Pages/SettingsPage.tsx'
import ProfilePage from './Pages/ProfilePage.tsx'
import { useAuthStore } from './store/useAthStore.ts'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    console.log({ authUser })

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }

    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={authUser ? <SettingPage /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster />
        </div>
    )
}

export default App
