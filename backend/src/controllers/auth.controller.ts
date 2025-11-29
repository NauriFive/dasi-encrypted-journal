import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import User from './../models/user.model'
import { generateTokenAndSetCookie } from '../lib/util'
import cloudinary from '../lib/cloudinary'

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Missing required fields.' })
      return
    }
    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters.' })
      return
    }

    const user = await User.findOne({ email })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: 'Invalid email.' })
      return
    }
    if (user) {
      res.status(400).json({ message: 'Email already exists.' })
      return
    }

    const salt: string = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password, salt)

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    })

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        message: 'Account created successfully!',
      })
    } else {
      res.status(400).json({ message: 'Invalid user data.' })
    }
  } catch (error) {
    console.log('💢 Error in Signup controller:', error)
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email: email, password: password } = req.body

    const user = await User.findOne({ email: email })
    const isValidPassword = await bcrypt.compare(password, user?.password || '')

    if (!user || !isValidPassword) {
      res.status(400).json({ message: 'Incorrect email or password.' })
      return
    }

    generateTokenAndSetCookie(user._id, res)

    res.status(200).json({
      message: 'Logged in successfully.',
      username: user.username,
      email: user.email,
      profilePicture: user.avatar,
    })
  } catch (error) {
    console.log('💢 Error in Login controller:', error)
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('💢 Error in Logout controller.')
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}

export const updateAvatar = async (req: any, res: Response) => {
  try {
    const { newAvatar: newAvatar } = req.body
    const userId = req.user._id

    if (!newAvatar) {
      res.status(400).json({ message: 'Avatar is required' })
      return
    }

    const uploadResponse = await cloudinary.uploader.upload(newAvatar)

    await User.findByIdAndUpdate(userId, { avatar: uploadResponse.secure_url })

    res.status(200).json({ message: 'Updated avatar successfully.', avatar: newAvatar })
  } catch (error) {
    console.log('💀 ERROR IN updateAvatar controller')
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}

export const updateUsername = async (req: any, res: Response) => {
  try {
    let { newUsername: newUsername } = req.body
    newUsername = newUsername.trim()

    const userId = req.user._id

    if (!newUsername) {
      res.status(400).json({ message: 'Username is required' })
      return
    }

    await User.findByIdAndUpdate(userId, { username: newUsername })

    res.status(200).json({ message: 'Updated username successfully.', username: newUsername })
  } catch (error) {
    console.log('ERROR IN updateUsername:', error)
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}

export const checkAuth = async (req: any, res: Response) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log('💢 Error in checkAuth controller.')
    res.status(500).json({ message: 'Something is broken on our end.' })
  }
}
