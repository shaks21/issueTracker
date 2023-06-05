import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { connectToDatabase } from '../../utils/mongodb';
import { sendPasswordResetEmail } from '../../utils/email';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const { db } = await connectToDatabase();
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ email });

  if (!user) {
    // Do not reveal that the email address does not exist in the system
    return res.status(200).json({ message: 'Password reset instructions have been sent to your email address (if it exists in our system).' });
  }

  // Generate a secure and unique token for password reset
  const resetToken = nanoid();

  // Store the reset token and expiration time in the user's record
  const resetExpiration = new Date();
  resetExpiration.setHours(resetExpiration.getHours() + 1); // Token will expire in 1 hour
  const updateResult = await usersCollection.updateOne({ _id: user._id }, { $set: { resetToken, resetExpiration } });
  if (updateResult.modifiedCount !== 1) {
    return res.status(500).json({ message: 'Error updating user record' });
  }

  // Send the password reset email
  const sent = await sendPasswordResetEmail(user.email, resetToken);
  if (!sent) {
    return res.status(500).json({ message: 'Error sending password reset email' });
  }

  res.status(200).json({ message: 'Password reset instructions have been sent to your email address.' });
}
