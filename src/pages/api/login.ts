import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { connectToDatabase } from '../../utils/mongodb'

interface LoginRequestBody {
  email: string
  password: string
}

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const { email, password }: LoginRequestBody = req.body

  // Connect to database
  const { db } = await connectToDatabase()

  // Find user by email
  const user = await db.collection('users').findOne({ email })
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

//   Compare password with hashed password in database
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    
    console.log('Invalid password');
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  // Generate JWT token
  const token = sign({ id: user._id }, process.env.JWT_SECRET!)

  // Send token and user data in response
  res.status(200).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  })
}
