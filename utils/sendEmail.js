const nodemailer = require('nodemailer');

// دالة لإرسال البريد الإلكتروني
const sendEmail = async options => {
  // إعداد خدمة الإرسال باستخدام المتغيرات البيئية
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME, // بريدك الإلكتروني المخزن في المتغيرات البيئية
      pass: process.env.EMAIL_PASSWORD, // كلمة مرور البريد الإلكتروني
    },
  });
  console.log(process.env.EMAIL_USERNAME, '   ', process.env.EMAIL_PASSWORD);

  // تحديد محتوى البريد الإلكتروني
  const mailOptions = {
    from: `Your App <${process.env.EMAIL_FROM}>`, // عنوان البريد الإلكتروني المرسل
    to: options.email, // المستلم
    subject: options.subject, // عنوان الرسالة
    text: options.message, // محتوى الرسالة
  };

  // إرسال البريد الإلكتروني
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
