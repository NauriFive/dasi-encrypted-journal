import { useState } from 'react'
import { useAuthStore } from '../store/useAthStore'
import { AtSign, Mail, Lock, Eye, EyeOff, Loader2, Rabbit } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const { signup, isSigningUp } = useAuthStore()

    const validateForm = () => {
        if (!formData.username.trim()) {
            return toast.error('Username is required!')
        }
        if (!formData.email.trim()) {
            return toast.error('Email is required!')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return toast.error('Invalid email!')
        }
        if (!formData.password) {
            return toast.error('Password is required!')
        }
        if (formData.password.length < 8) {
            return toast.error('Password must be at least 8 characters!')
        }

        return true;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()

        const isSuccessful = validateForm()

        if (isSuccessful) {
            signup(formData);
        }
    }

    return (
        <div>
            {/* 📃 Login form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-5">
                    {/* Ⓜ️ Logo */}
                    <div className="text-center mb-5">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Rabbit className="size-8 text-primary stroke-1" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Join us</h1>
                            <p className="text-base-content/60">Join us in the fight against distraction!</p>
                        </div>
                    </div>

                    {/* 📃 Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 🫠 Username */}
                        <div className="form-control mb-5">
                            <label className="label mb-1">
                                <span className="label-text">Username</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                                        <AtSign className="size-5 opacity-70" style={{ strokeWidth: 1 }} />
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-300`}
                                    placeholder="FabulousMoney67"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* ✉️ Email */}
                        <div className="form-control mb-5">
                            <label className="label mb-1">
                                <span className="label-text">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                                    <Mail className="size-5 opacity-70" style={{ strokeWidth: 1 }} />
                                </div>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-300`}
                                    placeholder="batman@super.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* 🔐 Password */}
                        <div className="form-control mb-5">
                            <label className="label mb-1">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                                    <Lock className="size-5 opacity-70" style={{ strokeWidth: 1 }} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input input-bordered w-full pl-10 focus:outline-none focus:border-gray-300`}
                                    placeholder="•••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center z-1" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                                </button>
                            </div>
                        </div>

                        {/* 💖 Submit button */}
                        <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* 🔗 Link */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{' '}
                            <Link to="/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
