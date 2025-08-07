import React, { useState } from 'react'
import { User, Mail, Edit3, Check, X, Camera } from 'lucide-react'

interface ProfilePageProps {
    initialUsername?: string
    initialEmail?: string
    initialAvatar?: string
}

const ProfilePage: React.FC<ProfilePageProps> = ({ initialUsername = 'BruceWayne67', initialEmail = 'batman@super.com', initialAvatar = '' }) => {
    const [username, setUsername] = useState(initialUsername)
    const [email] = useState(initialEmail)
    const [avatar] = useState(initialAvatar)
    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [tempUsername, setTempUsername] = useState(username)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleUsernameEdit = () => {
        setTempUsername(username)
        setIsEditingUsername(true)
    }

    const handleUsernameSave = async () => {
        setIsUpdating(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setUsername(tempUsername)
        setIsEditingUsername(false)
        setIsUpdating(false)
    }

    const handleUsernameCancel = () => {
        setTempUsername(username)
        setIsEditingUsername(false)
    }

    const handleAvatarUpload = () => {
        // Placeholder for avatar upload functionality
        console.log('Avatar upload clicked')
    }

    return (
        <div className="bg-base-100">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex flex-col items-center gap-2 group">
                            <h1 className="text-2xl font-bold mt-2">Profile</h1>
                            <p className="text-base-content/60">Manage your account settings</p>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center space-y-4 mb-5">
                        <div className="relative group">
                            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-base-300 group-hover:border-primary/30 transition-colors">
                                {avatar ? <img src={avatar} alt="Profile" className="size-full object-cover" /> : <User className="size-12 text-primary/70 stroke-1" />}
                            </div>
                            <button onClick={handleAvatarUpload} className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary text-primary-content flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg">
                                <Camera className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-5">
                        {/* Username Field */}
                        <div className="form-control mb-5">
                            <label className="label mb-1">
                                <span className="label-text">Username</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                                    <User className="size-5 opacity-70" style={{ strokeWidth: 1 }} />
                                </div>

                                {isEditingUsername ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1 pl-10 focus:outline-none focus:border-gray-300"
                                            value={tempUsername}
                                            onChange={(e) => setTempUsername(e.target.value)}
                                            placeholder="Enter username"
                                            autoFocus
                                        />
                                        <button onClick={handleUsernameSave} disabled={isUpdating || !tempUsername.trim()} className="btn btn-primary btn-sm px-3">
                                            {isUpdating ? <div className="size-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" /> : <Check className="size-4" />}
                                        </button>
                                        <button onClick={handleUsernameCancel} disabled={isUpdating} className="btn btn-ghost btn-sm px-3">
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <input type="text" className="input input-bordered flex-1 pl-10 bg-base-200 cursor-default focus:outline-none focus:border-gray-300" value={username} readOnly />
                                        <button onClick={handleUsernameEdit} className="btn btn-ghost btn-sm ml-2 px-3">
                                            <Edit3 className="size-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="form-control mb-5">
                            <label className="label mb-1">
                                <span className="label-text">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10">
                                    <Mail className="size-5 opacity-70" style={{ strokeWidth: 1 }} />
                                </div>
                                <input type="email" className="input input-bordered w-full pl-10 bg-base-200 cursor-default focus:outline-none focus:border-gray-300" value={email} readOnly />
                            </div>
                        </div>
                        
                        {/* Additional Actions */}
                        <div className="space-y-4">
                            <button className="btn btn-outline w-full">Change Password</button>
                            <button className="btn btn-error btn-outline w-full">Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
