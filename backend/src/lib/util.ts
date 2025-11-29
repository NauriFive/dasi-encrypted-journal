import * as jwt from 'jsonwebtoken'
import type { Response } from 'express'
import { Types } from 'mongoose'

export const generateTokenAndSetCookie = (userId: Types.ObjectId, res: Response) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('❌ JWT_SECRET is not defined!')
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ✏️ In Milisecond
        httpOnly: true, 
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    })
    
    return token
}