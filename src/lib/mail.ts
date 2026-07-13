import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD?.replace(/\s/g, ''), // Strip spaces from Gmail app password
  },
});

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://qyedx.com'}/verify?token=${token}`;

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

export async function sendWelcomeEmail(email: string, name: string, companyId: string, username: string, pass: string, days: number) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://qyedx.com'}/login`;

  const mailOptions = {
    from: `"نظام قيد إكس المحاسبي السحابي" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: `✨ تهانينا! تم تفعيل حساب شركة ${name} بنجاح`,
    html: `
      <div style="direction: rtl; text-align: right; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px 0; background-color: #fafafa;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #eeeeee;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 50px 30px; text-align: center;">
            <div style="background: #eab308; width: 60px; height: 60px; border-radius: 15px; display: inline-block; margin-bottom: 20px; line-height: 60px; font-size: 30px; text-align: center;">💼</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">نظام قيد إكس المحاسبي السحابي</h1>
            <p style="color: #94a3b8; margin-top: 10px; font-size: 14px; font-weight: 500;">شريكك الموثوق في الإدارة المالية الذكية</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 35px; color: #334155;">
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 15px;">تهانينا، <span style="color: #ca8a04;">${name}</span>!</h2>
            <p style="font-size: 16px; color: #64748b; margin-bottom: 30px; line-height: 1.6;">لقد تم الانتهاء من تأسيس النظام الخاص بشركتكم بنجاح. يسعدنا أن نرحب بكم في مجتمعنا، ونؤكد لكم أن نظامكم جاهز الآن للانطلاق بكامل طاقته.</p>
            
            <p style="font-weight: 700; color: #0f172a; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">🎫 بطاقة بيانات الدخول (الاشتراك):</p>
            
            <div style="background: #ffffff; border: 2px solid #f1f5f9; border-radius: 20px; padding: 30px; margin-bottom: 35px; position: relative; overflow: hidden;">
              <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 6px; background: #eab308;"></div>
              
              <table style="width: 100%; border-spacing: 0 12px;">
                <tr>
                  <td style="color: #64748b; font-size: 14px;">معرف النظام (Tenant ID)</td>
                  <td style="text-align: left; font-family: monospace; font-size: 18px; font-weight: 800; color: #b45309;">${companyId}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">اسم المستخدم</td>
                  <td style="text-align: left; font-family: monospace; font-size: 16px; font-weight: 600; color: #0f172a;">${username}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">كلمة المرور المؤقتة</td>
                  <td style="text-align: left; font-family: monospace; font-size: 16px; font-weight: 600; color: #0f172a;">${pass}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 15px; border-top: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">صلاحية الاشتراك</td>
                  <td style="text-align: left; font-weight: 800; color: #10b981; font-size: 15px;">${days} يوم (نشط)</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${loginUrl}" style="background: #0f172a; color: #ffffff; padding: 18px 50px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2); transition: all 0.3s ease;">
                الدخول إلى لوحة التحكم
              </a>
            </div>
            
            <div style="background: #fffbeb; border-radius: 16px; padding: 20px; border: 1px solid #fef3c7;">
              <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 700; display: flex; align-items: center;">
                ⚠️ تنبيه أمني هام
              </p>
              <p style="font-size: 13px; color: #b45309; margin: 5px 0 0 0;">نوصي بشدة بتغيير كلمة المرور المؤقتة فور تسجيل دخولك لأول مرة لضمان أقصى درجات الخصوصية والأمان لبياناتكم المالية.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0;">هذه رسالة آلية من "نظام قيد إكس" السحابي.</p>
            <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} جميع الحقوق محفوظة لشركتنا.</p>
          </div>
        </div>
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

export async function sendResetPasswordEmail(email: string, token: string, name?: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://qyedx.com'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Accounting System" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: 'طلب إعادة تعيين كلمة المرور',
    html: `
      <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6366f1;">مرحباً ${name || 'بك'}</h2>
        <p>لقد استلمنا طلب لإعادة تعيين كلمة المرور لحسابك.</p>
        <p>إذا كنت أنت من طلب ذلك، يرجى الضغط على الزر أدناه لتغيير كلمة المرور:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background: #eab308; color: #1e293b; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            إعادة تعيين كلمة المرور
          </a>
        </div>
        <p>أو قم بنسخ الرابط التالي ولصقه في المتصفح:</p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 4px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #ef4444; font-size: 0.9rem; margin-top: 20px;">هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #888;">إذا لم تكن أنت من طلب إعادة التعيين، يرجى تجاهل هذه الرسالة ولن يتم إجراء أي تغيير.</p>
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

