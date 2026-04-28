import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify?token=${token}`;

  const mailOptions = {
    from: `"Accounting System" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: 'تفعيل حسابك في نظام المحاسبة',
    html: `
      <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6366f1;">مرحباً ${name || 'بك'}</h2>
        <p>لقد تم إنشاء حساب لك في نظام المحاسبة. يرجى تفعيل حسابك من خلال الضغط على الزر أدناه:</p>
        <div style="margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #6366f1; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            تفعيل الحساب الآن
          </a>
        </div>
        <p>أو قم بنسخ الرابط التالي ولصقه في المتصفح:</p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 4px; word-break: break-all;">${verifyUrl}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #888;">إذا لم تكن أنت من طلب هذا الحساب، يرجى تجاهل هذه الرسالة.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}
