import nodemailer, { Transporter } from 'nodemailer';

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Sends a password reset email with a reset token to the specified email address.
 *
 * @param toEmail The email address to send the email to.
 * @param resetToken The password reset token to include in the email.
 *
 * @returns True if the email was sent successfully; false otherwise.
 */
export async function sendPasswordResetEmail(toEmail: string, resetToken: string): Promise<boolean> {
  const mailOptions = {
    from: `My App <${process.env.EMAIL_USERNAME}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <p>Hello,</p>
      <p>You recently requested a password reset for your My App account. To complete the password reset process, please click the link below:</p>
      <p><a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thanks,</p>
      <p>My App Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending password reset email to ${toEmail}:`, error);
    return false;
  }
}
