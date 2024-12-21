import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail', // Hoặc SMTP khác
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (đặt trong .env)
    pass: process.env.EMAIL_PASS, // Mật khẩu email (đặt trong .env)
  },
});

// Hàm gửi email
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};
